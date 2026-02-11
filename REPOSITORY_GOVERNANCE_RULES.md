# HCCVN-AI Repository Governance Rules
Version: 1.0
Status: Enforced

=====================================================
I. Architecture Separation (SSOT Rules)
=====================================================

Layer 1 -- HCCVN-AI (Governance + Documentation ONLY)
- Contains:
  - Architecture specs
  - Frozen governance files
  - OpenAPI contracts
  - Migration playbooks
- MUST NOT contain:
  - Python runtime code
  - Node runtime code
  - Dockerfiles
  - .env files

Layer 2 -- hccvn-runtime (Backend Runtime)
- Contains:
  - All Python services
  - requirements.txt per service
  - Dockerfiles
  - runtime-only code
- MUST NOT contain:
  - package.json
  - frontend assets
  - governance frozen files

Layer 3 -- hccvn-infra (Infrastructure)
- Contains:
  - Docker
  - Kubernetes
  - Helm
  - Cloudflare
- MUST NOT contain:
  - Python runtime code
  - Node runtime code

Layer 4 -- hccvn-frontend-web
- Contains:
  - Vite / React source
  - package.json
  - Dockerfile (frontend only)

=====================================================
II. Dependency Governance
=====================================================

- No cross-service imports.
- No cross-layer imports.
- Dev dependencies MUST be in requirements-dev.txt.
- Runtime dependencies MUST NOT include pytest or lint tools.

=====================================================
III. Python Version Policy
=====================================================

- Production Python version: 3.12.x
- .python-version MUST match production.
- CI must validate interpreter version.

=====================================================
IV. Cross-Layer Violations (Forbidden)
=====================================================

- Runtime importing from HCCVN-AI
- Infra importing from runtime
- Frontend importing backend internal files

=====================================================
V. CI Enforcement Required
=====================================================

Every PR must pass:
- Import scan
- Dependency validation
- Cross-layer violation check
- Docker build test
- Lint & format validation
