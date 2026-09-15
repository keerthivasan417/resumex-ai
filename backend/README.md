# ResumeX Backend

## Setup on Windows

From the `backend` directory, create and activate a virtual environment:

```powershell
python -m venv venv
venv\Scripts\activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Optionally copy `.env.example` to `.env` and adjust the non-secret application settings.

For PostgreSQL, set `DATABASE_URL` in `.env` using the `postgresql+psycopg` driver URL shown in `.env.example`.

## Run the API

Start the development server from the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

Swagger UI is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

The health endpoint is available at `GET /api/health`.

## Resume uploads

Create the minimal local candidate profile before uploading a resume. `POST /api/candidates` accepts only `full_name`; `GET /api/candidates/{candidate_id}` retrieves that profile. Resume upload accepts the returned candidate UUID and one PDF or DOCX file. Uploads are limited to 10 MB by default, validated by extension, declared MIME type, and file signature, then stored outside Git in `UPLOAD_DIRECTORY` (default: `backend/uploads`).

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/candidates" -H "Content-Type: application/json" -d '{"full_name":"Ada Candidate"}'
curl.exe "http://127.0.0.1:8000/api/candidates/<candidate-uuid>"
curl.exe -X POST "http://127.0.0.1:8000/api/resumes/upload" -F "candidate_id=<candidate-uuid>" -F "file=@C:\path\to\resume.pdf;type=application/pdf"
```

## Skill intelligence

`GET /api/resumes/{resume_id}/skills` generates and stores the first deterministic skill-evidence pass when no result exists, then returns the stored explanation trail. The catalog currently normalizes common aliases such as `JS` to `JavaScript`, `ReactJS` to `React`, and `Postgres` to `PostgreSQL`.

Evidence is weighted by source: skills lists are weak evidence; education and certifications are stronger; concrete implementation or duration in experience/projects is strongest. Uncatalogued terms are not inferred, and no LLM, embeddings, or external service is used.

```powershell
curl.exe "http://127.0.0.1:8000/api/resumes/<resume-uuid>/skills"
```

## Job intelligence and matching

`POST /api/jobs` stores a job description and derives catalog-backed requirements. Explicit requirements may be marked `required` or `preferred`; a job-description line containing `preferred`, `nice to have`, `bonus`, or `plus` is treated as preferred.

`GET /api/jobs` returns selector-ready job summaries, including normalized requirements and status. `GET /api/jobs/{job_id}` returns one such job and responds with `404` when it does not exist.

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/jobs" -H "Content-Type: application/json" -d '{"title":"Backend Engineer","description":"Required Python and PostgreSQL. ReactJS is preferred."}'
curl.exe "http://127.0.0.1:8000/api/jobs"
curl.exe "http://127.0.0.1:8000/api/jobs/<job-uuid>"
```

`POST /api/jobs/{job_id}/resumes/{resume_id}/match` persists a deterministic screening result and returns requirement-level alignment with evidence snippets. Required requirements have weight 3 and preferred requirements weight 1 by default; configure `MATCH_REQUIRED_WEIGHT` and `MATCH_PREFERRED_WEIGHT` in `.env` to change that balance.

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/jobs/<job-uuid>/resumes/<resume-uuid>/match"
```

## Local embeddings and pgvector

The vector foundation uses the local open-source `sentence-transformers/all-MiniLM-L6-v2` model, which produces 384-dimensional embeddings. It is loaded only when `LocalEmbeddingService.embed()` is called; the first runtime use downloads the model if it is not already cached locally.

`text_vectors` stores generic chunks for resume or job entities with a pgvector embedding, optional source resume section, and deterministic chunk index. `VectorRepository.search_cosine()` provides basic cosine-distance retrieval only; it does not affect job matching.

Set `EMBEDDING_MODEL` and `EMBEDDING_DIMENSIONS` before running migrations. The configured dimension is used for the PostgreSQL `vector(n)` column and must match the selected embedding model. Changing dimensions later requires a new migration and re-embedding stored chunks.

## Semantic match supplement

The job-match endpoint now indexes current resume sections and job requirements with replacement semantics, so rerunning a match does not accumulate duplicate vectors. For each requirement it retrieves the top candidate resume-section chunks with pgvector cosine similarity.

Semantic credit is `0` below `SEMANTIC_SIMILARITY_THRESHOLD` (default `0.65`) and otherwise `(similarity - threshold) / (1 - threshold)`. The final per-requirement credit is `(MATCH_EVIDENCE_WEIGHT × deterministic credit + MATCH_SEMANTIC_WEIGHT × semantic credit) / (MATCH_EVIDENCE_WEIGHT + MATCH_SEMANTIC_WEIGHT)`; defaults are `0.7` and `0.3`. Required/preferred weighting remains unchanged. Deterministic evidence remains the trust layer: semantic retrieval can add `partially_supported`, but cannot override a deterministic `matched` decision.

## End-to-end screening workflow

`POST /api/screenings/jobs/{job_id}/resumes/{resume_id}` runs one controlled sequence: existing resume skill intelligence is generated when missing, resume/job vectors are refreshed with replacement semantics, semantic candidate chunks are retrieved, deterministic and semantic signals are combined, and the final `ScreeningResult` plus evidence rows are persisted.

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/screenings/jobs/<job-uuid>/resumes/<resume-uuid>"
```

The response includes overall and deterministic scores, per-requirement evidence and semantic chunks, plus required/preferred matched, partial, and unsupported breakdowns. The existing job match endpoint continues to use this same workflow.

## GitHub developer intelligence

Candidates can optionally provide one public GitHub profile URL. `POST /api/candidates/{candidate_id}/github/sync` validates and normalizes that URL, calls only the public GitHub REST API, and caches a timestamped profile snapshot. It records public repository count, repository names/descriptions/language/stars/forks/recent activity, plus aggregated primary-language signals. No private data or GitHub HTML is fetched.

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/candidates/<candidate-uuid>/github/sync" -H "Content-Type: application/json" -d '{"github_profile_url":"https://github.com/octocat"}'
curl.exe "http://127.0.0.1:8000/api/candidates/<candidate-uuid>/developer-intelligence"
```

`GITHUB_CACHE_TTL_SECONDS` defaults to 86400, so a fresh snapshot is returned without another GitHub request. The developer-intelligence response retains the flat signal trail and also groups it into `profile`, `activity`, `repositories`, `languages`, `strengths`, and `source_metadata`. Activity uses a deterministic 180-day recent-repository window; repository quality exposes public description, stars, forks, archived state, and recent activity indicators. GitHub repository/language signals are stored separately from resume evidence. Catalog-recognized languages are linked to canonical skills for explainability, but do not create or overwrite resume skill claims.

## Skill gaps and learning recommendations

`GET /api/jobs/{job_id}/resumes/{resume_id}/skill-gap` derives a read-only gap report from stored job requirements and resume skill evidence. Strong or supported resume evidence is `satisfied`; weak evidence is `partial`; absent evidence is a `gap`; and unverified resume evidence or GitHub-only context is `needs_verification`. GitHub data never proves a resume skill.

Each catalog-backed gap receives a deterministic recommendation from the repository-local curated catalog, including learning topics and a static resource URL. Recommendations are guidance only and carry no completion state. No data is persisted and no external service is called by this endpoint.

```powershell
curl.exe "http://127.0.0.1:8000/api/jobs/<job-uuid>/resumes/<resume-uuid>/skill-gap"
```

## Evaluation reports and recruiter workflow

`GET /api/jobs/{job_id}/resumes/{resume_id}/report` aggregates one persisted screening result into a read-only recruiter report: requirement alignment, evidence snippets, persisted semantic evidence, cached GitHub context, skill gaps, local learning recommendations, and a deterministic `strong_fit`, `potential_fit`, `needs_review`, or `low_fit` assessment with reason codes.

Recruiter decisions are stored independently of the automated pipeline: `GET /api/jobs/{job_id}/candidates` lists screened candidates (with optional `recruiter_stage` and `shortlisted` filters); `GET /api/jobs/{job_id}/candidates/{candidate_id}/screening` returns the latest result; and `PATCH /api/screenings/{screening_id}/recruiter-state` updates only recruiter stage/shortlist state. These actions never modify evidence, skill intelligence, or automated score.

```powershell
curl.exe "http://127.0.0.1:8000/api/jobs/<job-uuid>/resumes/<resume-uuid>/report"
curl.exe -X PATCH "http://127.0.0.1:8000/api/screenings/<screening-uuid>/recruiter-state" -H "Content-Type: application/json" -d '{"recruiter_stage":"shortlisted"}'
```

## Screening evaluation

The versioned synthetic dataset at `training/evaluation/datasets/v1/screening_cases.json` covers exact matches, aliases, strong and weak evidence, absent skills, skill-list-only mentions, semantic wording differences, and required/preferred weighting. It contains no real resumes or personal data.

Run the deterministic offline evaluation from `backend`:

```powershell
python -m app.evaluation.screening_evaluator --output evaluation-report.json
```

The command prints precision, recall, F1, and evidence-status accuracy, and writes a machine-readable JSON report. The evaluation uses fixed semantic similarities as a local test fixture, so it does not download the embedding model or require PostgreSQL.

## Live semantic retrieval benchmark

The synthetic live benchmark at `training/evaluation/datasets/v1/semantic_retrieval_benchmark.json` uses the configured local embedding model and PostgreSQL pgvector to measure real cosine retrieval. It is isolated under the `evaluation_benchmark_v1` vector namespace and removes/replaces only that namespace on each run.

Apply migrations, ensure the local embedding model can be downloaded or is cached, then run from `backend`:

```powershell
python -m app.evaluation.semantic_benchmark --output semantic-benchmark-report.json
```

The report includes Top-1/3/5 hit accuracy and recall plus average relevant and irrelevant cosine similarity. This benchmark intentionally does not change production matching behavior.

## Run tests

```powershell
pytest
```

## Database migrations

Apply the initial schema to the PostgreSQL database configured by `DATABASE_URL`:

```powershell
alembic upgrade head
```
