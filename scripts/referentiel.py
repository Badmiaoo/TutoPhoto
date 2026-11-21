"""Chargement des fichiers de data/, commun à validate.py et coverage.py, et lecture des fiches de content/."""
import datetime
import io
import pathlib
import re
import string
import unicodedata
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
    """Un fichier ne se lit pas : fichier absent ou qui n'est pas en UTF-8 ; pour un fichier de data/, faute de syntaxe
    YAML, clé écrite deux fois, date impossible ou caractère refusé. Le message nomme le fichier, et la ligne quand
    elle est connue."""


def _ligne(debut):
    """Numéro de la ligne qui commence après `debut` (texte ou octets), fins de ligne LF, CRLF ou CR seul."""
    fins = rb"\r\n|\r|\n" if isinstance(debut, bytes) else r"\r\n|\r|\n"
    return len(re.findall(fins, debut)) + 1


def lire_octets(octets, nom):
    """Texte UTF-8 d'un contenu déjà lu. Un octet qui n'est pas de l'UTF-8 lève `LectureImpossible`, avec sa ligne."""
    try:
        return octets.decode("utf-8")
    except UnicodeDecodeError as e:
        raise LectureImpossible(
            f"{nom}, ligne {_ligne(octets[:e.start])} : octet 0x{octets[e.start]:02x}, le fichier n'est pas en UTF-8") from e


def lire_texte(path, nom=None):
    """Texte d'un fichier en UTF-8. Un fichier absent, illisible ou qui n'est pas en UTF-8 lève `LectureImpossible`, en
    une ligne qui le nomme (`nom`, ou son chemin), au lieu d'une trace Python (version 0.3.83)."""
    nom = nom or str(path)
    try:
        octets = pathlib.Path(path).read_bytes()
    except OSError as e:
        raise LectureImpossible(f"{nom} : {e.strerror or e}") from e
    return lire_octets(octets, nom)


_FUSION = object()  # la clé de fusion « << », distincte du texte « << » écrit entre guillemets


class _Chargeur(yaml.SafeLoader):
    """Le lecteur de PyYAML, qui refuse en plus une clé écrite deux fois dans un même bloc (constat RST-04 de l'audit,
    version 0.3.82). La spécification de YAML 1.2.2 veut les clés d'un bloc uniques (source yaml-spec-1-2-2 de
    data/sources.yaml : https://raw.githubusercontent.com/yaml/yaml-spec/1b1a1be43bd6e0cfec45caf0e40af3b5d2bb7f8a/spec/1.2.2/spec.md) ;
    PyYAML 6.0.3 garde la seconde valeur sans rien dire (source pyyaml-6-0-3-constructor :
    https://raw.githubusercontent.com/yaml/pyyaml/49790e73684bebad1df05ef8d828fa12f685bffb/lib/yaml/constructor.py)."""

    def __init__(self, stream):
        super().__init__(stream)
        self._blocs_vus = set()

    def flatten_mapping(self, node):
        # Une fois par bloc, avant que PyYAML n'y verse les clés reprises par une fusion (« << ») : un bloc repris
        # par une fusion est aplati avant d'être lu lui-même, et ses propres clés ne se distinguent plus après.
        if node not in self._blocs_vus:
            self._blocs_vus.add(node)
            vues = set()
            for cle_noeud, _ in node.value:
                if cle_noeud.tag == "tag:yaml.org,2002:merge":
                    cle = _FUSION
                elif cle_noeud.tag == "tag:yaml.org,2002:value":
                    cle = "="  # la clé « = » de YAML 1.1, que PyYAML garde comme le texte « = »
                else:
                    cle = self.construct_object(cle_noeud)
                try:
                    deja = cle in vues
                except TypeError:
                    continue  # clé non hachable : SafeLoader la refuse lui-même
                if deja:
                    texte = "<<" if cle is _FUSION else cle
                    raise yaml.constructor.ConstructorError(
                        None, None, f"clé « {texte} » écrite deux fois dans le même bloc", cle_noeud.start_mark)
                vues.add(cle)
        super().flatten_mapping(node)

    def construct_yaml_timestamp(self, node):
        # Une date impossible (2026-13-45) lève ValueError, et l'étiquette !!timestamp posée sur un texte qui n'est pas
        # une date, AttributeError, sans la ligne : les redonner comme erreurs de PyYAML.
        valeur = self.construct_scalar(node)
        if not self.timestamp_regexp.match(valeur):
            raise yaml.constructor.ConstructorError(None, None, f"« {valeur} » n'est pas une date", node.start_mark)
        try:
            return super().construct_yaml_timestamp(node)
        except ValueError as e:
            raise yaml.constructor.ConstructorError(
                None, None, f"date impossible « {valeur} » ({e})", node.start_mark) from e


_Chargeur.add_constructor("tag:yaml.org,2002:timestamp", _Chargeur.construct_yaml_timestamp)


def load_yaml(path, nom=None):
    """Lit un fichier YAML. `nom` : le chemin écrit dans le message d'une erreur de lecture (`LectureImpossible`)."""
    nom = nom or str(path)
    try:
        octets = pathlib.Path(path).read_bytes()
    except OSError as e:
        raise LectureImpossible(f"{nom} : {e.strerror or e}") from e
    return load_yaml_octets(octets, nom)


def load_yaml_octets(octets, nom):
    """Lit un contenu YAML déjà lu en octets : un fichier de data/, ou un fichier d'une autre version du dépôt, que
    donne `git show` (option `--base` de validate.py). `nom` : ce qu'écrit le message d'une erreur de lecture.

    Le texte est décodé au fur et à mesure que PyYAML le lit, en fins de ligne universelles, comme par `open()` jusqu'à
    la version 0.3.82 : la première faute rencontrée est signalée, qu'elle soit de syntaxe, un caractère refusé ou un
    octet qui n'est pas de l'UTF-8 (relecture de la version 0.3.83, constat C7)."""
    flux = io.TextIOWrapper(io.BytesIO(octets), encoding="utf-8")
    try:
        return _dates_en_texte(yaml.load(flux, Loader=_Chargeur))
    except yaml.MarkedYAMLError as e:
        ligne = f", ligne {e.problem_mark.line + 1}" if e.problem_mark else ""
        contexte = f" ({e.context}, ligne {e.context_mark.line + 1})" if e.context and e.context_mark else ""
        raise LectureImpossible(f"{nom}{ligne} : {e.problem}{contexte}") from e
    except yaml.reader.ReaderError as e:
        # Caractère que YAML refuse (U+0007…) : PyYAML ne donne que sa position dans le texte qu'il a lu, fins de ligne
        # ramenées à LF ; la ligne est plus utile pour un caractère qui ne se voit pas.
        texte = re.sub(r"\r\n|\r", "\n", octets.decode("utf-8", errors="replace"))
        raise LectureImpossible(
            f"{nom}, ligne {texte[:e.position].count(chr(10)) + 1} : caractère #x{e.character:04x} refusé "
            f"({e.reason})") from e
    except UnicodeDecodeError as e:
        # La position que donne Python est celle du morceau lu (64 Kio), pas celle du fichier : chercher la ligne.
        lire_octets(octets, nom)
        raise LectureImpossible(f"{nom} : {e}") from e
    except (yaml.YAMLError, ValueError) as e:
        raise LectureImpossible(f"{nom} : {e}") from e


# --- Fiches de content/ ----------------------------------------------------------------------------------------------
# Lues comme les lit la construction des pages (app/scripts/build-pages.mjs), en JavaScript : sans la marque d'ordre
# des octets en tête, fins de ligne de Windows ramenées à celles d'Unix, blancs au sens de `trim()` de JavaScript.
# Avant la version 0.3.83, scripts/coverage.py ne comptait pas la casse des titres de section et comptait comme du
# texte une ligne faite d'un U+FEFF : il comptait une brique que la construction refuse (relecture de la version 0.3.81,
# constat C3).

def _blanc(c):
    """Blanc au sens de JavaScript : espaces de toutes sortes (catégories Zs, Zl et Zp de Unicode), tabulations, fins de
    ligne, et U+FEFF, que `str.strip()` de Python ne retire pas."""
    return c in string.whitespace or c == chr(0xFEFF) or unicodedata.category(c) in ("Zs", "Zl", "Zp")


def sans_blancs(texte):
    """`texte` sans ses blancs de début et de fin, comme `trim()` de JavaScript."""
    debut, fin = 0, len(texte)
    while debut < fin and _blanc(texte[debut]):
        debut += 1
    while fin > debut and _blanc(texte[fin - 1]):
        fin -= 1
    return texte[debut:fin]


def normaliser(texte):
    """Texte sans la marque d'ordre des octets (U+FEFF) en tête, fins de ligne CRLF ramenées à LF, comme la construction
    des pages lit ses fichiers."""
    if texte.startswith(chr(0xFEFF)):
        texte = texte[1:]
    return texte.replace("\r\n", "\n")


def texte_de_fiche(path, nom=None):
    """Texte d'une fiche, lu par `lire_texte` puis `normaliser`."""
    return normaliser(lire_texte(path, nom))


def premiere_ligne(texte):
    """(numéro, texte) de la première ligne qui n'est pas blanche, celle qui porte le titre de la fiche ; None si toutes
    le sont."""
    for numero, ligne in enumerate(texte.split("\n"), 1):
        if sans_blancs(ligne):
            return numero, ligne
    return None


def sections_de_fiche(texte):
    """Titres des sections de niveau 2 dont le corps n'est pas blanc : une ligne qui commence par « ## » et une espace,
    le titre tel qu'il est écrit (la casse compte), sans les commentaires HTML (docs/contenus.md). La construction des
    pages refuse en plus le balisage qu'elle ne connaît pas (titre de niveau 3, « **** », « - » seul…) : une section
    qui ne contient que cela compte ici, alors que la construction échoue."""
    texte = re.sub(r"<!--.*?-->", "", texte, flags=re.S)
    trouvees, titre, plein = set(), None, False
    for ligne in texte.split("\n"):
        if ligne.startswith("## "):
            if titre is not None and plein:
                trouvees.add(titre)
            titre, plein = sans_blancs(ligne[3:]), False
        elif titre is not None and sans_blancs(ligne):
            plein = True
    if titre is not None and plein:
        trouvees.add(titre)
    return trouvees


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
