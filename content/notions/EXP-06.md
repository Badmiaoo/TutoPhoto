# EXP-06 · ISO

## Explication

Le manuel du Nikon Z 6 le résume : plus la sensibilité ISO est élevée, moins il faut de lumière pour exposer, ce qui permet des vitesses plus rapides ou des ouvertures plus petites, mais plus l'image risque d'être affectée par le bruit ([Nikon, manuel en ligne Z 7/Z 6, « The S (ISO Sensitivity) Button »](https://onlinemanual.nikonimglib.com/z7_z6/en/06_shooting_controls_02.html), lu le 10 novembre 2026). Les réglages étendus ont un prix : le bruit est « particulièrement probable » de Hi 0.3 à Hi 2, et en Lo les hautes lumières peuvent perdre des détails (même source).

Pourquoi le bruit vient surtout du manque de lumière : dans les modes automatiques (P, S, A), monter l'ISO fait viser une exposition plus faible ; l'appareil capte moins de lumière, et « this reduction in light leaves the image looking noisier » ([Richard Butler, « What is ISO invariance, and should I care? », DPReview, publié le 27 juillet 2026, mis à jour le 16 septembre 2026](https://www.dpreview.com/articles/iso-invar/), texte relevé par Julien le 11 novembre 2026). La plupart des appareils amplifient davantage le signal quand on monte l'ISO ; amplifier d'un cran fait sortir le cran le plus clair des hautes lumières de la plage du convertisseur : il est écrêté et ne se récupère pas (même source). Un capteur est dit « ISO invariant » quand monter l'ISO d'un cran retire un cran de plage dynamique sans rien gagner dans les ombres : on abandonne seulement un cran de hautes lumières (même source).

Le bruit a deux familles de sources ([Spencer Cox, « ISO Invariance Explained », Photography Life, mis à jour le 22 août 2022](https://photographylife.com/iso-invariance-explained), texte relevé par Julien le 11 novembre 2026) :
- le bruit photonique vient de la scène elle-même, pas de l'appareil : les photons n'arrivent pas tous également, et cette part aléatoire vaut la racine carrée du nombre de photons ; les zones sombres, qui en reçoivent moins, sont donc proportionnellement plus bruitées ;
- le bruit de lecture vient de l'appareil.

Les ISO étendus « simulés » par l'appareil n'apportent rien en qualité d'image et écrêtent plus facilement les hautes lumières (même source).

Pour juger le bruit, la norme des sensibilités numériques retient un rapport signal sur bruit de 40:1 pour une « excellent image quality » et de 10:1 pour une « acceptable image quality » ([Wikipedia, « Film speed », révision 1383727213](https://en.wikipedia.org/w/index.php?title=Film_speed&oldid=1383727213), lue le 10 novembre 2026).

## Simulateur

La molette « ISO » va de 100 à 6400 par tiers de cran (le Z 6 va au-delà ; TutoPhoto s'arrête là où s'arrêtent ses mesures de bruit). Le bruit photonique et le bruit de lecture sont calculés à partir de mesures de capteurs réels et se voit dans le viseur et sur la photo, à la loupe à 100 %. L'indicateur d'équilibre et le bulletin donnent le rapport signal sur bruit au point visé, avec les seuils 40:1 et 10:1. Avec l'ISO auto (MES-10), l'appareil choisit la sensibilité.

## Exercice

En mode M, sans ISO auto, impose f/4 et 1/1000 s. Trouve l'ISO le plus bas qui expose correctement. Calcul : à ISO 100, ces réglages valent 14 IL₁₀₀ (log₂(4²) + log₂(1000) ≈ 4 + 10), pour une scène à 12,5 IL₁₀₀ ; il manque 1,5 IL, soit ISO 100 × 2^1,5 ≈ 283, entre deux crans ; ISO 250 donne −1/6 IL, ISO 320 donne +1/6 IL. Compare le bruit au point visé à ISO 320 et à ISO 6400.
