# TutoPhoto

_Version française : [README.md](README.md)._

An open source toolkit, in French and English, that teaches photography to beginners through simulation: setting up the camera, focusing, choosing AF points, and getting a photo right in a given situation (where, when, what, why).

"TutoPhoto" is the repository name; the project name has not been chosen yet.

## Status as of 7 November 2026

- Scope and curriculum v0.2 approved: 191 topics in 13 domains, 49 situations (42 in V1, 7 in V2), 78 sources.
- V1 in 2.5D: real photos and their depth maps. V2: only the move to 3D and what it unlocks.
- No application code or written content yet: coverage 0 of 191.

## Repository layout

| Path | Purpose |
| --- | --- |
| `data/` | Curriculum (`data/referentiel/`), situations and sources: the source of truth |
| `docs/` | Scope, architecture, reading the curriculum, V2 in 3D, content, open questions, history (in French) |
| `schemas/` | JSON Schemas for the files in `data/` |
| `scripts/` | Extraction, validation and coverage |
| `REPRISE.md` | Handover file of 7 November 2026, kept as is as an archive |
| `CLAUDE.md` | Working rules |

Data files are explained in [docs/lire-le-referentiel.md](docs/lire-le-referentiel.md) (in French).

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

## License

Not chosen yet: it is an open question ([docs/questions-ouvertes.md](docs/questions-ouvertes.md), in French).
