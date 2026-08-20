# ASI BRIDGE — Release Notes v1.0.0

Release date: 2026-08-20

Short description
-----------------
Initial release of ASI BRIDGE — a lightweight, self-contained Intent-to-Action scaffold for "Agencja Suwerennej Inteligencji". This release introduces the repository layout, FastAPI microservices, tests, CI pipeline, containerization, a demo UI and a GitHub Action manifest ready for Marketplace publication.

Highlights
----------
- Added asi-bridge/ scaffold with core services and documentation.
- FastAPI services:
  - services/intent_engine.py — /intent/compile endpoint (Intent → Spec)
  - services/auth_gate.py — /auth/verify endpoint (Zero‑Trust token verification)
  - services/telemetry_ingress.py — /telemetry/ingress endpoint (telemetry validation)
  - services/main.py — FastAPI application aggregating routers
- Test suite: pytest + pytest-asyncio tests for core services (asi-bridge/tests/)
- CI: GitHub Actions workflow (.github/workflows/ci.yml) running black, flake8 and pytest
- Containerization: Dockerfile and docker-compose.yml for local/dev runs
- Interactive demo: asi-bridge/index.html
- Marketplace integration: asi-bridge/action.yml (GitHub Action manifest ready for publication)
- Documentation: README.md, JULES_INSTRUCTIONS.md and LICENSE (MIT)

Files added (not exhaustive)
---------------------------
- asi-bridge/services/{main.py, intent_engine.py, auth_gate.py, telemetry_ingress.py, __init__.py}
- asi-bridge/tests/{test_intent_engine.py, test_auth_gate.py, test_telemetry_ingress.py, __init__.py}
- asi-bridge/{Dockerfile, docker-compose.yml, requirements.txt, .gitignore, LICENSE, README.md, JULES_INSTRUCTIONS.md, index.html, action.yml}
- asi-bridge/.github/workflows/ci.yml

Compatibility & Requirements
----------------------------
- Python 3.10+
- Docker & Docker Compose (for containerized run)
- The repository uses the Python dependencies in asi-bridge/requirements.txt (fastapi, uvicorn, pydantic, pytest, httpx, flake8, black, python-dotenv).

Security notes & recommendations
--------------------------------
- This initial scaffold is intended for local development and demonstration purposes. Before deploying to production:
  - Ensure secrets (API keys, tokens) are stored in a secure secrets manager or provided via environment variables at runtime — do NOT commit secrets to the repo.
  - Review auth_gate.py and telemetry_ingress.py for authentication, rate limiting and payload validation policies appropriate for your environment.
  - Harden network boundaries for telemetry ingestion endpoints and consider mutual TLS for service-to-service communication.

How to create a release and publish the Action
----------------------------------------------
1) Create a tag locally and push it to GitHub (example v1.0.0):

```bash
# create annotated tag
git tag -a v1.0.0 -m "ASI BRIDGE v1.0.0"
# push tag to remote
git push origin v1.0.0
```

2) Create a GitHub release using the GitHub CLI (gh) or the web UI. Example with gh:

```bash
# prepare RELEASE_NOTES.md (this file)
gh release create v1.0.0 --title "ASI BRIDGE v1.0.0" --notes-file asi-bridge/RELEASE_NOTES.md
```

3) Publish the Action to the GitHub Marketplace:
- Open the repository on GitHub → open the file asi-bridge/action.yml or go to Releases → find the released tag → Click "Publish this Action to the GitHub Marketplace" and follow the prompts. This step requires repository owner privileges.

Quick CLI alternative (REST API):
```bash
curl -H "Authorization: token $GITHUB_TOKEN" \
  -d '{"tag_name":"v1.0.0","name":"ASI BRIDGE v1.0.0","body":"Initial release of ASI BRIDGE","draft":false,"prerelease":false}' \
  https://api.github.com/repos/Paparara1/Incanto/releases
```

Notes about Marketplace publishing
---------------------------------
- The GitHub UI will ask you to confirm listing details (branding, categories and description). You must accept the GitHub Marketplace terms and confirm ownership.
- Publishing the Action does not automatically create a release tag — create the tag before publishing to ensure the Action version resolves correctly.

Suggested next steps
--------------------
- (Optional) Run a focused security review of auth_gate.py and telemetry_ingress.py.
- Add integration tests that exercise the whole FastAPI app via TestClient or HTTPX to validate router wiring in main.py.
- Add example workflows demonstrating how to call the asi-bridge GitHub Action from another repository.
- Create a top-level CHANGELOG.md to track future releases following keepachangelog.org conventions.

Acknowledgements
----------------
Initial implementation created by the project automation agent (Jules) and committed by @Paparara1.

---

Plik wygenerowany automatycznie: asi-bridge/RELEASE_NOTES.md
