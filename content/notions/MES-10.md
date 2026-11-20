# MES-10 · ISO auto

## Explication

Avec le contrôle de la sensibilité auto, l'appareil règle lui-même la sensibilité s'il est impossible d'obtenir l'exposition optimale avec la valeur choisie ([Nikon, manuel en ligne Z 7/Z 6, « ISO Sensitivity Settings »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_03_08.html), lu le 10 novembre 2026 ; [en français, « Réglage de la sensibilité »](https://onlinemanual.nikonimglib.com/z7_z6/fr/09_menu_guide_03_08.html), relu le 20 novembre 2026). Deux réglages l'encadrent (même source) :
- la sensibilité maximale, pour éviter qu'elle ne monte trop ;
- la vitesse d'obturation minimale, en dessous de laquelle l'ISO auto entre en jeu en modes P et A ; la vitesse peut quand même descendre plus bas si la sensibilité maximale ne suffit pas.

En mode M, l'ISO auto règle la sensibilité pour l'exposition optimale à la vitesse et à l'ouverture choisies ([« The Mode Dial »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_01.html)), et tient compte de la correction d'exposition ([« The Exposure Compensation Button »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_03.html)). L'ISO auto est activé par défaut sur le Z 6 ([« Defaults »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html)).

## Simulateur

Dans la fenêtre « Exposition » : contrôle de la sensibilité auto, sensibilité maximale (ISO 200 à 6400) et vitesse minimale. La molette s'appelle alors « ISO auto » et montre la valeur retenue. Le mode P n'est pas simulé : seuls les modes M, A et S le sont.

Une règle vient du manuel du Nikon D850, celui du Z 6 ne la donnant pas : l'ISO auto du D850 descend jusqu'à ISO 64 ; TutoPhoto en tire ISO 100, le bas de la plage normale du Z 6 (voir EXP-06) ([Nikon, manuel en ligne D850, « Auto ISO Sensitivity Control »](https://onlinemanual.nikonimglib.com/d850/en/10_iso_sensitivity_02.html), relu le 20 novembre 2026). Le même manuel précise qu'en mode A la sensibilité n'est modifiée que si la vitesse passerait sous la vitesse minimale ; TutoPhoto suit cette règle.

Sur le Z 6, la vitesse minimale est réglée au départ sur « Automatique » ([« Defaults »](https://onlinemanual.nikonimglib.com/z7_z6/en/09_menu_guide_01.html)) : l'appareil la choisit d'après la focale de l'objectif, plus rapide au téléobjectif (« Réglage de la sensibilité », lien plus haut). La page ne donne pas la règle, et TutoPhoto ne simule pas cette option : il part de 1/30 s, la valeur que le manuel du D850 fixe quand « Automatique » ne peut pas fonctionner, avec un objectif sans microprocesseur et sans données d'objectif (même page du D850). De même, la sensibilité maximale part de ISO 6400, le haut de l'échelle de TutoPhoto, et non de ISO 51 200 comme sur le Z 6 (« Defaults »).

## Exercice

La fiche du référentiel parle d'un enfant qui court en fin de journée ; dans le parc, c'est le chien. Avec le boîtier de départ (Nikon Z 6) et la focale à 50 mm, règle le mode A à f/8, ISO 100, la correction à « ±0,0 IL », l'ISO auto avec une vitesse minimale de 1/1000 s et une sensibilité maximale de 6400. L'appareil prend environ ISO 1000 et 1/1000 s. À 1/1000 s, le chien (3,5 m/s à 9 m) laisse sur le capteur une traînée de 50 × 3,5 × 0,001 / 9 ≈ 0,019 mm, soit 0,8 px sur la photo, sous la limite de 1,2 px : il est figé. Vérifie-le avec le défi SIT-06. Avec un boîtier APS-C, le capteur est plus petit : la même traînée y couvre plus de pixels de la photo et dépasse un peu la limite. Il faut 1/1250 s.
