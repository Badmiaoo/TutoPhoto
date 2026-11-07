# Lire le référentiel

_Section 3 de `REPRISE.md` (7 novembre 2026), copiée sans réécriture ; seuls les niveaux de titre changent._

191 notions en 13 domaines : 177 se simulent en V1, 12 commencent en V1 et s'achèvent en V2, 2 attendent la V2. 49 situations : 42 en V1, 7 en V2.

Champs d'une notion (section 4) :

- `id` : identifiant stable, préfixe du domaine et numéro, jamais renuméroté.
- `title.fr`, `title.en` : intitulés ; l'anglais amorce le glossaire FR/EN.
- `version` : V1 ; V1→V2 (base en V1 avec des variantes capturées, version libre en V2) ; V2.
- `level` : N1 débutant, N2 intermédiaire, N3 avancé.
- `spec` : la spécification des trois premières briques, pas leur contenu. `explanation` : ce que la personne doit comprendre. `simulator` : ce qu'elle manipule. `exercise` : ce qu'elle doit réussir. La quatrième brique est la situation réelle.
- `activity: true` : la notion ne se simule pas ; une activité interactive remplace le simulateur.
- `situations` : où la notion sert, en renvoi au catalogue ; `all` quand elle sert partout ; liste vide et `practice_outside` pour une notion qui se pratique ailleurs qu'en prise de vue (LEC-03, RET-15).
- `sources` : identifiants de `data/sources.yaml`. `notes` : calculs et précisions. `todo` : ce qui reste à sourcer ou à vérifier. `since` : version qui a introduit la notion.

Champs d'une situation (section 5) : `where_when`, `intention`, `key_notions`, `capture` (scène à produire, V1 seulement), `flash` (`required` ou `optional`), `level` et `level_max` (règle dans le bloc), `sources` quand la situation vient d'un cours.

Champs d'une source (section 10) : `id`, `group`, `label`, `url`, `note` éventuelle, et `used_in` quand elle n'est citée que dans un document en prose.

- Notions clés : celles qui sont propres à la situation. Les réglages de base (ouverture, vitesse, ISO, modes, mesure, AF, balance des blancs) servent dans toutes les recettes sans être répétés.
- Toute notion clé renvoie à sa situation. L'inverse n'est pas exigé : une notion peut servir dans une situation sans en être une notion clé.

Le squelette reprend l'ampleur du cours de photographie numérique de Marc Levoy à Stanford : science de l'image, technique des appareils, composition ([page du cours](https://graphics.stanford.edu/~levoy/teaching.html)), et exercices par genre ([liste des exercices](https://sites.google.com/site/marclevoylectures/assignments)).
