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
