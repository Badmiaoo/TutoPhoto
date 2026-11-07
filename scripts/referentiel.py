"""Chargement des fichiers de data/, commun à validate.py et coverage.py."""
import datetime
import pathlib
from dataclasses import dataclass, field

import yaml

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Ordre des domaines de REPRISE.md (section 4) ; un domaine absent de la liste vient ensuite, par ordre alphabétique.
DOMAIN_ORDER = ["EXP", "MES", "BOI", "MAP", "NET", "MVT", "OPT", "LUM", "COU", "CMP", "PLA", "RET", "LEC"]
LEVELS = ["N1", "N2", "N3"]


def _dates_en_texte(value):
    """YAML lit `2026-11-07` comme une date ; les schémas attendent du texte."""
    if isinstance(value, (datetime.date, datetime.datetime)):
        return value.isoformat()
    if isinstance(value, dict):
        return {k: _dates_en_texte(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_dates_en_texte(v) for v in value]
    return value


def load_yaml(path):
    with open(path, encoding="utf-8") as f:
        return _dates_en_texte(yaml.safe_load(f))


@dataclass
class Referentiel:
    root: pathlib.Path
    domain_files: list = field(default_factory=list)  # [(chemin, contenu)] dans l'ordre des domaines
    retired_file: tuple = None                         # (chemin, contenu)
    situations_file: tuple = None
    sources_file: tuple = None

    @property
    def domains(self):
        return [data["domain"] for _, data in self.domain_files]

    @property
    def notions(self):
        """Toutes les notions, dans l'ordre des domaines puis des fichiers, avec `_domain` ajouté."""
        out = []
        for _, data in self.domain_files:
            for n in data["notions"]:
                out.append({**n, "_domain": data["domain"]["id"]})
        return out

    @property
    def situations(self):
        return self.situations_file[1]["situations"]

    @property
    def sources(self):
        return self.sources_file[1]["sources"]

    @property
    def retired(self):
        return self.retired_file[1]["retired"]

    def rel(self, path):
        return pathlib.Path(path).relative_to(self.root).as_posix()


def _domain_key(path):
    code = path.stem.upper()
    return (DOMAIN_ORDER.index(code), "") if code in DOMAIN_ORDER else (len(DOMAIN_ORDER), code)


def load(root=ROOT):
    root = pathlib.Path(root).resolve()
    ref_dir = root / "data" / "referentiel"
    ref = Referentiel(root=root)
    for path in sorted(ref_dir.glob("*.yaml"), key=_domain_key):
        if path.name == "retired.yaml":
            continue
        ref.domain_files.append((path, load_yaml(path)))
    ref.retired_file = (ref_dir / "retired.yaml", load_yaml(ref_dir / "retired.yaml"))
    ref.situations_file = (root / "data" / "situations.yaml", load_yaml(root / "data" / "situations.yaml"))
    ref.sources_file = (root / "data" / "sources.yaml", load_yaml(root / "data" / "sources.yaml"))
    return ref


def situation_level_rule(levels):
    """Règle de situations.yaml : niveau d'entrée = médiane haute, level_max = plus haut niveau.

    `levels` est la liste des niveaux (N1, N2, N3) des notions clés.
    """
    ranks = sorted(LEVELS.index(lv) for lv in levels)
    return LEVELS[ranks[len(ranks) // 2]], LEVELS[ranks[-1]]
