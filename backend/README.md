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

`POST /api/resumes/upload` accepts an existing candidate UUID and one PDF or DOCX file. Uploads are limited to 10 MB by default, validated by extension, declared MIME type, and file signature, then stored outside Git in `UPLOAD_DIRECTORY` (default: `backend/uploads`).

```powershell
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

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/jobs" -H "Content-Type: application/json" -d '{"title":"Backend Engineer","description":"Required Python and PostgreSQL. ReactJS is preferred."}'
```

`POST /api/jobs/{job_id}/resumes/{resume_id}/match` persists a deterministic screening result and returns requirement-level alignment with evidence snippets. Required requirements have weight 3 and preferred requirements weight 1 by default; configure `MATCH_REQUIRED_WEIGHT` and `MATCH_PREFERRED_WEIGHT` in `.env` to change that balance.

```powershell
curl.exe -X POST "http://127.0.0.1:8000/api/jobs/<job-uuid>/resumes/<resume-uuid>/match"
```

## Run tests

```powershell
pytest
```

## Database migrations

Apply the initial schema to the PostgreSQL database configured by `DATABASE_URL`:

```powershell
alembic upgrade head
```
