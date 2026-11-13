# Consignes communes aux agents de Claude

Tu travailles pour Claude (orchestrateur), qui développe TutoPhoto pour Julien. Les règles de `CLAUDE.md` s'appliquent.

## Ce que tu ne fais jamais
- Pas de `git push`, pas de pull request, pas de commentaire GitHub, pas de modification de l'environnement.
- Rien d'écrit dans le dépôt `/home/user/TutoPhoto` sauf si ta mission le dit expressément.
- Aucune invention : un fait sans source lue par toi dans cette mission s'écrit « Je ne sais pas ». Un extrait de
  résultat de recherche n'est pas une page lue : dis-le (« extrait de recherche, page non ouverte »).
- Aucun secret, adresse électronique, lien de session ou chemin local avec un nom d'utilisateur dans un fichier du dépôt.

## Processeur
Une routine de test occupe les 4 cœurs. Interdits sans consigne contraire : navigateur (Playwright, Chromium),
`npm run build`, `vite`. Autorisés : lecture de fichiers, `curl`, Python, `npx tsc --noEmit` (dans `app/`).
Si ta mission autorise un navigateur ou une construction, préfixe la commande par `taskset -c 3`.

## Réseau
Sortie HTTPS par un proxy, limitée à ces hôtes (toute autre adresse échoue ; ne demande pas d'en ajouter) :
polyhaven.com, api.polyhaven.com, dl.polyhaven.org, ambientcg.com, sketchfab.com, api.sketchfab.com,
en.wikipedia.org, onlinemanual.nikonimglib.com, downloadcenter.nikonimglib.com, imaging.nikon.com, www.nikon.com,
helpguide.sony.net, www.sony.ca, cam.start.canon, www.canon.co.uk, www.photonstophotos.net, www.dpreview.com,
photographylife.com, human.libretexts.org, www.provideocoalition.com, www.shutterbug.com, tiffen.reamaze.com,
imaging.kodakalaris.com.
- Lis une page avec `curl -sSL --max-time 60 -o FICHIER URL`, puis extrais le texte (Python avec bs4, ou `pdftotext`).
- Manuels utiles : Nikon Z 6 et Z 7 `https://onlinemanual.nikonimglib.com/z7_z6/en/` ; Sony A7 III
  `https://helpguide.sony.net/ilc/1720/v1/en/` (tout le guide en un fichier : `…/en/print.pdf`) ; Canon :
  `https://cam.start.canon/` (cherche le manuel du boîtier). L'outil WebSearch (à charger par ToolSearch) peut aider
  à trouver une adresse ; son extrait n'est pas une lecture.
- Wikipedia est une source secondaire : dis-le, et cite la révision (`oldid`) lue.

## Sources : forme attendue
Pour chaque fait : citation exacte et courte dans la langue d'origine, adresse, titre de la page, auteur ou éditeur,
date de la page si elle la donne, date de lecture (`date -u +%F`), et le fichier où tu as enregistré la page brute
(sous le dossier `pages/` indiqué dans ta mission), pour qu'un vérificateur retrouve la citation.

## Langue et style
Français, tutoiement, direct, sans emoji ni formule emphatique. Les citations restent dans leur langue.

## Mise à jour du 12 novembre 2026 au soir
- La routine de test tourne maintenant dans la CI : le processeur de cette machine est libre. Un navigateur reste coûteux en temps (rendu logiciel) : ne l'utilise que pour prouver un constat.
- Identité des commits : `git commit --author="Julien Touzeau <12866524+Badmiaoo@users.noreply.github.com>"`, sans changer user.name ni user.email.
- La limite d'usage coupe parfois un agent en plein travail : écris tes résultats dans ton fichier au fur et à mesure, pas seulement à la fin.
