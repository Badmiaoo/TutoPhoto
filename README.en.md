# TutoPhoto

_Version française : [README.md](README.md)._

An open source toolkit, in French and English, that teaches photography to beginners through simulation: setting up the camera, focusing, choosing AF points, and getting a photo right in a given situation (where, when, what, why).

TutoPhoto is the project name. The application is published on GitHub Pages: https://badmiaoo.github.io/TutoPhoto/

## Status as of 8 November 2026

- Scope and curriculum v0.2 are a draft, open to challenge: 191 topics in 13 domains, 49 situations, 96 sources.
- For beginners with a DSLR or mirrorless camera. Scenes are synthetic 3D; we start with a minimal V1 (one park scene, three situations), tested with beginners before going further.
- Application under construction: the park scene is displayed (360° photo background, bench, trash cans, four people, a running dog), with a minimal virtual camera: aperture, shutter speed, ISO, focal length, light meter and exposure preview, focus by tapping the viewfinder, a photo computed on release (depth of field and motion blur) physically based digital noise an adjustable viewfinder preview (brightness, noise, approximate depth of field) and a magnifier up to 100%, in the viewfinder and on the photo. No camera shake yet. No written content yet: coverage 0 of 191.

## Repository layout

| Path | Purpose |
| --- | --- |
| `data/` | Curriculum (`data/referentiel/`), situations, sources and milestones: the source of truth |
| `docs/` | Scope, architecture, reading the curriculum, content, licenses, tech stack, physical camera, publication, open questions, history (in French) |
| `schemas/` | JSON Schemas for the files in `data/` and for scene manifests |
| `app/` | Application (TypeScript, Babylon.js, Vite); 3D scenes and their credits in `app/public/scenes/` |
| `scripts/` | Extraction, validation, coverage and checks (3D scenes, public repository, changelog) |
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
- Every 3D scene goes through `scripts/check_scenes.py`: each file is listed in its scene's `scene.json` manifest, with its author, its license (CC0 or CC BY) and its checksum.
- Identifiers are stable: never renumbered; a retired identifier goes into `data/referentiel/retired.yaml`.
- Every factual claim is sourced; sources go into `data/sources.yaml`.
- Public repository: no secrets, no personal data, no private links ([docs/publication.md](docs/publication.md), in French); `python3 scripts/check_public.py --commits all` checks it.
- Every merged pull request is a release, described in [CHANGELOG.md](CHANGELOG.md) (in French) and marked by a `vX.Y.Z` tag.

## License

- Code (`scripts/`, `schemas/`, `.github/`, `app/` except third-party models and textures): MIT, see [LICENSE](LICENSE).
- Content and data (`content/`, `docs/`, `data/`, READMEs, changelog): CC BY-SA 4.0, see [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).
- Third-party 3D models, textures and photos (`app/public/scenes/`): CC0 or CC BY only, each with its author and license, shown in the application ("Credits" button).

Details: [docs/licences.md](docs/licences.md) (in French).
