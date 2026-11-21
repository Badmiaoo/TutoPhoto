// Activité de LUM-02 (lumière dure ou douce) : le calcul de l'ombre, sans page (sorti de activities/lum02.ts dans la
// version 0.3.87, Sujet 27 du plan de corrections, pour les tests rapides : constats INT-14 et ARC-05 de l'audit). La
// page (activities/lum02.ts) dessine le schéma et écrit les valeurs ; ses sources y sont citées.
//
// Calcul, en vue de côté (rayons en ligne droite, triangles semblables). Source de hauteur D à x = 0, objet de
// hauteur H à x = d₁, mur à x = d₁ + d₂, tous centrés sur le même axe. Un rayon qui part du point s de la source et
// rase le bord o de l'objet frappe le mur en y = s + (o − s) × (d₁ + d₂) / d₁. D'où, sur le mur :
// - largeur de la pénombre, de chaque côté : D × d₂ / d₁ ;
// - hauteur de l'ombre pleine : H × (d₁ + d₂) / d₁ − D × d₂ / d₁, nulle si la source déborde l'objet ;
// - éclairement d'un point du mur : part de la source qu'il voit, l'objet cachant les points s compris entre
//   (o − y d₁ / L) × L / d₂ pour o = bas et haut de l'objet (L = d₁ + d₂) ;
// - taille apparente de la source vue de l'objet : 2 × atan(D / (2 d₁)).
// - bord extérieur de la pénombre, depuis l'axe : (H × L + D × d₂) / (2 d₁) ; le mur dessiné va de −100 à +100 cm, et
//   ce bord le dépasse quand l'objet est tout près d'une grande source (constat FMA-10 de l'audit) ;
// - sans ombre pleine, la pénombre couvre toute l'ombre, sur 2 × ce bord : H × L / d₁ + D × d₂ / d₁.

/** Hauteur de l'objet et distance objet–mur, en cm (choix de TutoPhoto). */
export const OBJECT_CM = 30;
export const WALL_GAP_CM = 50;
/** Demi-hauteur du mur dessiné, en cm. */
export const WALL_HALF_CM = 100;

/** Exemples de l'activité : taille de la source et distance source–objet, en cm (choisis pour TutoPhoto). */
export const PRESETS = {
  lamp: { size: 3, distance: 100 },
  window: { size: 120, distance: 200 },
  reflector: { size: 80, distance: 80 },
} as const;
export type Preset = keyof typeof PRESETS;

/** Grandeurs de l'ombre pour une source de taille d (cm) à la distance d1 (cm) de l'objet. */
export function shadow(d: number, d1: number): { angleDeg: number; penumbraCm: number; umbraCm: number; outerCm: number } {
  const L = d1 + WALL_GAP_CM;
  return {
    angleDeg: (2 * Math.atan(d / (2 * d1)) * 180) / Math.PI,
    penumbraCm: (d * WALL_GAP_CM) / d1,
    umbraCm: Math.max(0, (OBJECT_CM * L) / d1 - (d * WALL_GAP_CM) / d1),
    // Bord extérieur de la pénombre, depuis l'axe.
    outerCm: (OBJECT_CM * L + d * WALL_GAP_CM) / (2 * d1),
  };
}

/** Part de la source visible depuis le point du mur à la hauteur y (cm), de 0 (ombre pleine) à 1 (plein éclairage). */
export function litFraction(y: number, d: number, d1: number): number {
  const L = d1 + WALL_GAP_CM;
  const at = (o: number) => ((o - (y * d1) / L) * L) / WALL_GAP_CM;
  const lo = Math.max(-d / 2, at(-OBJECT_CM / 2));
  const hi = Math.min(d / 2, at(OBJECT_CM / 2));
  return 1 - Math.max(0, hi - lo) / d;
}

/**
 * Pénombre écrite par l'activité, en cm : de chaque côté de l'ombre pleine, ou, sans ombre pleine, toute l'ombre
 * (2 × bord extérieur) ; « au-delà du mur dessiné » quand son bord extérieur dépasse la demi-hauteur du mur.
 */
export function penumbraReading(d: number, d1: number): { cm: number; wholeShadow: boolean; beyondWall: boolean } {
  const r = shadow(d, d1);
  const wholeShadow = !(r.umbraCm > 0);
  return { cm: wholeShadow ? 2 * r.outerCm : r.penumbraCm, wholeShadow, beyondWall: r.outerCm > WALL_HALF_CM };
}
