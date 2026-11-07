# TutoPhoto

_Version française : [README.md](README.md)._

An open source toolkit, in French and English, that teaches photography to beginners through simulation: setting up the camera, focusing, choosing AF points, and getting a photo right in a given situation (where, when, what, why).

TutoPhoto is the project name. The application will be published as a static site, on GitHub Pages first.

## Status as of 7 November 2026

- Scope and curriculum v0.2 are a draft, open to challenge: 191 topics in 13 domains, 49 situations, 78 sources.
- For beginners with a DSLR or mirrorless camera. Scenes are synthetic 3D; we start with a minimal V1 (one park scene, three situations), tested with beginners before going further.
- No application code or written content yet: coverage 0 of 191.

## Repository layout

| Path | Purpose |
| --- | --- |
| `data/` | Curriculum (`data/referentiel/`), situations, sources and milestones: the source of truth |
| `docs/` | Scope, architecture, reading the curriculum, content, licenses, tech stack, publication, open questions, history (in French) |
| `schemas/` | JSON Schemas for the files in `data/` |
| `app/` | Application (TypeScript, Babylon.js, Vite) |
| `scripts/` | Extraction, validation and coverage |
| `REPRISE.md` | Handover file of 7 November 2026, kept as is as an archive |
| `CLAUDE.md` | Working rules |
| `CHANGELOG.md` | Releases and tags (in French) |
| `LICENSE`, `LICENSES/` | License texts |

Data files are explained in [docs/lire-le-referentiel.md](docs/lire-le-referentiel.md) (in French).

## Running the application

Node.js 22 or later:

```sh
cd app
npm ci
npm run dev      # development server
npm run build    # type check and static site in app/dist/
```

## Checking the curriculum

```sh
pip install -r requirements.txt
python3 scripts/validate.py
python3 scripts/coverage.py
```

`validate.py` exits with an error if the curriculum is inconsistent; it also runs on every pull request.

## Contributing

- One branch and one pull request per topic; no direct push to `main`.
- Every change to `data/` goes through `scripts/validate.py`.
- Identifiers are stable: never renumbered; a retired identifier goes into `data/referentiel/retired.yaml`.
- Every factual claim is sourced; sources go into `data/sources.yaml`.
- Public repository: no secrets, no personal data, no private links ([docs/publication.md](docs/publication.md), in French); `python3 scripts/check_public.py --commits all` checks it.
- Every merged pull request is a release, described in [CHANGELOG.md](CHANGELOG.md) (in French) and marked by a `vX.Y.Z` tag.

## License

- Code (`scripts/`, `schemas/`, `.github/`, upcoming application): MIT, see [LICENSE](LICENSE).
- Content and data (`content/`, `docs/`, `data/`, READMEs, changelog): CC BY-SA 4.0, see [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).
- Third-party 3D models and textures: CC0 or CC BY only, each with its author and license.

Details: [docs/licences.md](docs/licences.md) (in French).
