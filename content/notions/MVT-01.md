# MVT-01 · Figer le mouvement

## Explication

Pendant la pose, un sujet qui bouge se déplace sur le capteur. Avec une projection simple, un point à la position (X, Z) devant l'appareil se projette en x = f X / Z ; s'il se déplace à la vitesse (vX, vZ), sa traînée sur le capteur vaut f × (vX Z − X vZ) / Z² × t, pour une focale f et une pose t. La traînée dépend donc de la vitesse du sujet, de sa direction (un sujet qui traverse le cadre traîne plus qu'un sujet qui vient vers soi) et de sa taille dans l'image (f / Z). On juge le sujet figé quand cette traînée reste sous le flou acceptable, la diagonale du capteur divisée par 1500, soit 0,029 mm en plein format ([Wikipedia, « Circle of confusion », révision 1335590423](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)).

Calcul pour le chien du parc (3,5 m/s, de profil, à 9 m, au 50 mm) : la traînée vaut 50 × 3,5 / 9 × t ≈ 19,4 mm/s × t. Elle reste sous 0,029 mm jusqu'à environ 1/680 s : il faut 1/800 s ou plus rapide. Pour le promeneur (1,25 m/s à 12,5 m), 50 × 1,25 / 12,5 = 5 mm/s × t, d'où 1/200 s suffit.

## Simulateur

L'indicateur d'équilibre donne la traînée du sujet visé ; le bulletin, celle de chaque sujet en mouvement présent dans le cadre au déclenchement. Les deux l'écrivent en pixels de la photo (1500 px de grand côté), avec la limite (1,2 px). La photo calculée montre le flou de mouvement réel, vue par vue en rafale. Le bougé de la main n'est ni sourcé ni simulé.

## Exercice

La fiche du référentiel propose de figer un saut puis un cycliste de profil ; le parc a un chien qui court de profil et un promeneur. Avec le boîtier de départ (Nikon Z 6) et la focale à 50 mm, trouve la vitesse la plus lente qui fige le promeneur (1/200 s), puis celle qui fige le chien (1/800 s). Pour vérifier, déclenche quand le sujet traverse le cadre : le bulletin de la photo donne la traînée de chaque sujet en mouvement présent dans le cadre, le chien seulement s'il y est. Réussis ensuite le défi SIT-06.

Avec le Canon EOS R50 (fenêtre « Boîtier de référence »), le capteur APS-C est plus petit, 22,3 × 14,9 mm : la même traînée y couvre plus de pixels de la photo (la limite reste 1,2 px), et le flou acceptable descend à 26,8 / 1500 ≈ 0,018 mm, sa diagonale divisée par 1500. Il faut 1/320 s pour le promeneur (0,018 / 5 : jusqu'à environ 1/280 s) et 1/1250 s pour le chien (0,018 / 19,4 : jusqu'à environ 1/1090 s). Une focale plus longue grossit le sujet et sa traînée : au 85 mm avec le Z 6, il faut aussi 1/320 s pour le promeneur et 1/1250 s pour le chien.
