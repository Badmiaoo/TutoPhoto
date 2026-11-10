// Zone nette (NET-01) : limites proche et lointaine autour de la distance de mise au point, par la formule du cercle
// de confusion, c = A × |S₂ − S₁| / S₂ × f / (S₁ − f) avec A = f / N [wikipedia-circle-of-confusion]
// https://en.wikipedia.org/w/index.php?title=Circle_of_confusion&oldid=1335590423 , en posant c égal au flou
// acceptable d / 1500 (d : diagonale du capteur). Avec q = c × N × (S₁ − f) / f², limite proche S₁ / (1 + q),
// limite lointaine S₁ / (1 − q), ou l'infini si q ≥ 1. Partagée par l'indicateur d'équilibre et la vue de dessus.

/** Flou acceptable, en millimètres : diagonale du capteur / 1500. */
export function blurLimitMm(sensorWidthMm: number, sensorHeightMm: number): number {
  return Math.hypot(sensorWidthMm, sensorHeightMm) / 1500;
}

/** Limites de la zone nette, en mètres, pour une focale en mm, une ouverture N et une distance S₁ en mètres. */
export function sharpZone(focalMm: number, aperture: number, distanceM: number, blurMm: number): { near: number; far: number } {
  const q = (blurMm * aperture * (distanceM * 1000 - focalMm)) / (focalMm * focalMm);
  return { near: distanceM / (1 + q), far: q < 1 ? distanceM / (1 - q) : Infinity };
}
