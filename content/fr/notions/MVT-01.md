# MVT-01 · Figer le mouvement

## Explication

Pendant la pose, un sujet qui bouge se déplace sur le capteur. Avec une projection simple, un point à la position (X, Z) devant l'appareil se projette en x = f X / Z ; s'il se déplace à la vitesse (vX, vZ), sa traînée sur le capteur vaut f × (vX Z − X vZ) / Z² × t, pour une focale f et une pose t. La traînée dépend donc de la vitesse du sujet, de sa direction (un sujet qui traverse le cadre traîne plus qu'un sujet qui vient vers soi) et de sa taille dans l'image (f / Z). On juge le sujet figé quand cette traînée reste sous le flou acceptable, la diagonale du capteur divisée par 1500, soit 0,029 mm en plein format ([Wikipedia, « Circle of confusion », révision 1335590423](https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423)).

Calcul pour le chien du parc (3,5 m/s, de profil, à 9 m, au 50 mm) : la traînée vaut 50 × 3,5 / 9 × t ≈ 19,4 mm/s × t. Elle reste sous 0,029 mm jusqu'à environ 1/680 s : il faut 1/800 s ou plus rapide. Pour le promeneur (1,25 m/s à 12,5 m), 50 × 1,25 / 12,5 = 5 mm/s × t, d'où 1/200 s suffit.

## Simulateur

L'indicateur d'équilibre et le bulletin donnent la traînée du sujet visé, du promeneur et du chien, en pixels de la photo (1500 px de grand côté), avec la limite (1,2 px en plein format). La photo calculée montre le flou de mouvement réel, vue par vue en rafale. Le bougé de la main n'est ni sourcé ni simulé.

## Exercice

La fiche du référentiel propose de figer un saut puis un cycliste de profil ; le parc a un chien qui court de profil et un promeneur. Trouve la vitesse la plus lente qui fige le promeneur (1/200 s), puis celle qui fige le chien (1/800 s), et vérifie-les avec le bulletin ; réussis le défi SIT-06.
