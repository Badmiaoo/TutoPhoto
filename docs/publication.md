# Dépôt public : ce qui ne doit jamais y entrer

Décidé par Julien le 7 novembre 2026 : le dépôt devient public, condition pour publier le site gratuitement sur GitHub Pages. GitHub Pages est disponible pour les dépôts publics avec l'offre gratuite, et pour les dépôts privés seulement avec une offre payante ; même alors, le site publié reste public ([documentation GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), source lue dans le dépôt `github/docs`, commit `8cd1075` du 6 novembre 2026).

## Ce qui ne doit jamais être publié

- Secrets : jetons d'API, clés, mots de passe, clés privées. Un secret dont un workflow a besoin va dans les secrets GitHub du dépôt, jamais dans un fichier.
- Données personnelles : adresses électroniques (seules les adresses « noreply » sont admises), numéros de téléphone, adresses postales.
- Liens vers des ressources privées : documents Claude, Google Docs ou Drive, Dropbox, Notion.
- Chemins locaux qui révèlent un nom d'utilisateur (`/Users/…`, `/home/…`, `C:\Users\…`).

Exceptions acceptées par Julien : son nom, comme auteur des commits de fusion avec son adresse « noreply » de GitHub, et comme titulaire du copyright dans `LICENSE`.

## Contrôles

- `scripts/check_public.py` cherche ces informations dans tous les fichiers suivis par git et dans les messages de tous les commits, et vérifie les adresses des auteurs et des committers. Il tourne dans la CI de chaque pull request et de `main`, sur tout l'historique des commits (`--commits all`). Les messages de commit ne sont contrôlés que depuis le 8 novembre 2026 (voir ci-dessous).
- [gitleaks](https://github.com/gitleaks/gitleaks/tree/v8.30.1) 8.30.1 (licence MIT) cherche les secrets dans tout l'historique git, dans la même CI. Le binaire est téléchargé depuis la release officielle et vérifié par son empreinte SHA-256 avant d'être lancé.
- Côté GitHub, pour un dépôt public : la recherche de secrets (secret scanning) tourne automatiquement et gratuitement ([documentation](https://docs.github.com/en/code-security/concepts/secret-security/secret-scanning)), et la protection des pushes pour les utilisateurs est active par défaut ([documentation](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/prevent-future-leaks/manage-user-push-protection)). Sources lues dans le dépôt `github/docs`, commit `8cd1075` du 6 novembre 2026.

## Si quelque chose a fuité

Un dépôt public peut être copié dès qu'un commit est poussé : effacer le fichier ne suffit pas. Un secret qui a fuité doit être révoqué et remplacé tout de suite chez le service qui l'a émis. L'historique publié n'est pas réécrit (règle du dépôt) ; on le signale à Julien.

## Fuite du 8 novembre 2026 : liens de session Claude dans les messages de commit

- Les 28 commits faits par Claude du 7 au 8 novembre 2026, avant la version 0.3.9, finissent par une ligne « Claude-Session » qui donne l'adresse de la session de travail de Claude (claude.ai/code/session_…). Les descriptions des pull requests #1 à #14 contiennent la même adresse.
- C'est un lien vers une ressource privée : seul le propriétaire de la session peut l'ouvrir. Aucun secret ni donnée personnelle n'y figure.
- Cause : `scripts/check_public.py` ne lisait pas les messages de commit, et son motif ne couvrait pas ces adresses. Les deux sont corrigés dans la version 0.3.9. Les commits concernés sont listés dans `scripts/check_public_historique.txt` : l'historique publié n'est pas réécrit, et le contrôle tolère ce seul problème dans ces seuls commits.
- Signalé à Julien le 8 novembre 2026.

## Avant le passage en public

Audit du 7 novembre 2026 : aucun secret, aucune adresse électronique hors « noreply ». Le seul lien vers une ressource privée, celui du Claude Doc d'origine dans `REPRISE.md`, a été retiré de la version courante. Il reste dans l'historique, mais le document qu'il désigne est privé et inaccessible aux autres.
