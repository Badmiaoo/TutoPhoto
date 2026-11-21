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


class LectureImpossible(Exception):
    """Un fichier de data/ ne se lit pas : faute de syntaxe YAML, clé écrite deux fois, date impossible, fichier absent
    ou qui n'est pas en UTF-8. Le message nomme le fichier, et la ligne quand PyYAML la connaît."""


class _Chargeur(yaml.SafeLoader):
    """Le lecteur de PyYAML, qui refuse en plus une clé écrite deux fois dans un même bloc (constat RST-04 de l'audit,
    version 0.3.82). La spécification de YAML 1.2.2 veut les clés d'un bloc uniques ; PyYAML garde la seconde valeur
    sans rien dire (`mapping[key] = value`, `lib/yaml/constructor.py`)."""

    def construct_mapping(self, node, deep=False):
        vues = set()
        for cle_noeud, _ in node.value:
            if cle_noeud.tag == "tag:yaml.org,2002:merge":
                continue  # « << » reprend les clés d'un autre bloc, que celui-ci peut redéfinir
            cle = self.construct_object(cle_noeud, deep=deep)
            try:
                deja = cle in vues
            except TypeError:
                continue  # clé non hachable : SafeLoader la refuse lui-même
            if deja:
                raise yaml.constructor.ConstructorError(
                    None, None, f"clé « {cle} » écrite deux fois dans le même bloc", cle_noeud.start_mark)
            vues.add(cle)
        return super().construct_mapping(node, deep=deep)

    def construct_yaml_timestamp(self, node):
        # Une date impossible (2026-13-45) lève ValueError, sans la ligne : la redonner comme erreur de PyYAML.
        try:
            return super().construct_yaml_timestamp(node)
        except ValueError as e:
            raise yaml.constructor.ConstructorError(
                None, None, f"date impossible « {node.value} » ({e})", node.start_mark) from e


_Chargeur.add_constructor("tag:yaml.org,2002:timestamp", _Chargeur.construct_yaml_timestamp)


def load_yaml(path, nom=None):
    """Lit un fichier YAML. `nom` : le chemin écrit dans le message d'une erreur de lecture (`LectureImpossible`)."""
    nom = nom or str(path)
    try:
        with open(path, encoding="utf-8") as f:
            return _dates_en_texte(yaml.load(f, Loader=_Chargeur))
    except yaml.MarkedYAMLError as e:
        ligne = f", ligne {e.problem_mark.line + 1}" if e.problem_mark else ""
        contexte = f" ({e.context}, ligne {e.context_mark.line + 1})" if e.context and e.context_mark else ""
        raise LectureImpossible(f"{nom}{ligne} : {e.problem}{contexte}") from e
    except yaml.reader.ReaderError as e:
        # Caractère que YAML refuse (U+0007…) : PyYAML ne donne que sa position dans le texte ; la ligne est plus
        # utile pour un caractère qui ne se voit pas.
        with open(path, encoding="utf-8") as f:
            ligne = f.read()[:e.position].count("\n") + 1
        raise LectureImpossible(f"{nom}, ligne {ligne} : caractère #x{e.character:04x} refusé ({e.reason})") from e
    except OSError as e:
        raise LectureImpossible(f"{nom} : {e.strerror or e}") from e
    except (yaml.YAMLError, ValueError) as e:
        raise LectureImpossible(f"{nom} : {e}") from e


@dataclass
class Referentiel:
    root: pathlib.Path
    domain_files: list = field(default_factory=list)  # [(chemin, contenu)] dans l'ordre des domaines
    retired_file: tuple = None                         # (chemin, contenu)
    situations_file: tuple = None
    sources_file: tuple = None
    jalons_file: tuple = None
    relecture_file: tuple = None

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

    @property
    def jalons(self):
        return self.jalons_file[1]["jalons"]

    @property
    def relues(self):
        return self.relecture_file[1]["relues"]

    def rel(self, path):
        return pathlib.Path(path).relative_to(self.root).as_posix()


def _domain_key(path):
    code = path.stem.upper()
    return (DOMAIN_ORDER.index(code), "") if code in DOMAIN_ORDER else (len(DOMAIN_ORDER), code)


def load(root=ROOT):
    """Lit data/ ; lève `LectureImpossible` sur le premier fichier qui ne se lit pas."""
    root = pathlib.Path(root).resolve()
    ref_dir = root / "data" / "referentiel"
    ref = Referentiel(root=root)

    def lire(path):
        return path, load_yaml(path, ref.rel(path))

    for path in sorted(ref_dir.glob("*.yaml"), key=_domain_key):
        if path.name == "retired.yaml":
            continue
        ref.domain_files.append(lire(path))
    ref.retired_file = lire(ref_dir / "retired.yaml")
    ref.situations_file = lire(root / "data" / "situations.yaml")
    ref.sources_file = lire(root / "data" / "sources.yaml")
    ref.jalons_file = lire(root / "data" / "jalons.yaml")
    ref.relecture_file = lire(root / "data" / "relecture.yaml")
    return ref


def situation_level_rule(levels):
    """Règle de situations.yaml : niveau d'entrée = médiane haute, level_max = plus haut niveau.

    `levels` est la liste des niveaux (N1, N2, N3) des notions clés.
    """
    ranks = sorted(LEVELS.index(lv) for lv in levels)
    return LEVELS[ranks[len(ranks) // 2]], LEVELS[ranks[-1]]
