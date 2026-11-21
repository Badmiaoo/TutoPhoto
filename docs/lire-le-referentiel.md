# Lire le référentiel

_Repris de la section 3 de `REPRISE.md` (7 novembre 2026), puis mis à jour le même jour : champs `version` et `capture` retirés avec le passage à la 3D de synthèse._

191 notions en 13 domaines et 49 situations, toutes dans le périmètre de la V1. Les identifiants `SIT-V2-NN` sont ceux des anciennes situations V2, gardés tels quels.

Champs d'une notion (section 4) :

- `id` : identifiant stable, préfixe du domaine et numéro, jamais renuméroté.
- `title` : intitulé, en français (une chaîne ; jusqu'à la version 0.3.60, un objet à deux champs, `fr` et `en`).
- `level` : N1 débutant, N2 intermédiaire, N3 avancé.
- `spec` : la spécification des trois premières briques, pas leur contenu. `explanation` : ce que la personne doit comprendre. `simulator` : ce qu'elle manipule. `exercise` : ce qu'elle doit réussir. La quatrième brique est la situation réelle.
- `activity: true` : la notion ne se simule pas ; une activité interactive remplace le simulateur.
- `situations` : où la notion sert, en renvoi au catalogue ; `all` quand elle sert partout ; liste vide et `practice_outside` pour une notion qui se pratique ailleurs qu'en prise de vue (LEC-03, RET-15).
- `sources` : identifiants de `data/sources.yaml`. `notes` : calculs et précisions. `todo` : ce qui reste à sourcer ou à vérifier. `since` : version qui a introduit la notion.
- `terms` : les noms que donnent au réglage les manuels en français des boîtiers lus (décision D3 de Julien, 15 novembre 2026, `docs/historique.md`). Une entrée par boîtier : `brand` (`nikon`, `sony` ou `canon`), `body` (le boîtier dont le manuel est lu, son nom commençant par la marque), `names` (les termes, tels que le manuel les écrit, sans doublon), `sources` (identifiants de `data/sources.yaml`, les pages lues où ils sont écrits) et `note` éventuelle (par exemple un boîtier voisin, quand le manuel du boîtier du simulateur n'est pas lu). Le nom d'un réglage change parfois d'un modèle à l'autre d'une même marque : chaque terme vaut pour le boîtier nommé, pas pour toute la marque. Quand la notion a une fiche, chaque terme y est écrit tel quel, en mot entier : `scripts/validate.py` le contrôle, sans vérifier à quel boîtier la fiche l'attribue.

Champs d'une situation (section 5) : `where_when`, `intention`, `key_notions`, `flash` (`required` ou `optional`), `level` et `level_max` (règle dans le bloc `rules`), `sources` quand la situation vient d'un cours. Un écart à la règle de niveau sans raison écrite dans `notes`, ou un `level` au-dessus de `level_max`, est une erreur de `scripts/validate.py` (version 0.3.82).

Champs d'un jalon (`data/jalons.yaml`, ajouté le 7 novembre 2026) : `id`, `title`, `decided` (date de la décision), `goal`, `situations`, `notions`. Un jalon contient toutes les notions clés de ses situations ; `scripts/validate.py` le contrôle, et `scripts/coverage.py` donne sa couverture. Premier jalon : `v1-min`, la V1 minimale (scène de parc).

Champs d'une source (section 10) : `id`, `group`, `label`, `url`, `note` éventuelle, et `used_in` quand elle n'est citée que dans un document en prose.

- Notions clés : celles qui sont propres à la situation. Les réglages de base (ouverture, vitesse, ISO, modes, mesure, AF, balance des blancs) servent dans toutes les recettes sans être répétés.
- Toute notion clé renvoie à sa situation. L'inverse n'est pas exigé : une notion peut servir dans une situation sans en être une notion clé.
- Un bloc n'écrit pas deux fois la même clé, et une liste d'identifiants (situations et sources d'une notion, sources d'une entrée de `terms`, sources d'un domaine, notions clés et sources d'une situation, situations et notions d'un jalon) ne répète pas un identifiant : `scripts/validate.py` refuse l'un et l'autre (version 0.3.82), en nommant le fichier et la ligne, ou la liste et l'identifiant répété.

Le squelette reprend l'ampleur du cours de photographie numérique de Marc Levoy à Stanford : science de l'image, technique des appareils, composition ([page du cours](https://graphics.stanford.edu/~levoy/teaching.html)), et exercices par genre ([liste des exercices](https://sites.google.com/site/marclevoylectures/assignments)).
