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

## Run tests

```powershell
pytest
```

## Database migrations

Apply the initial schema to the PostgreSQL database configured by `DATABASE_URL`:

```powershell
alembic upgrade head
```
