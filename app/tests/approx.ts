// Tests rapides (Sujet 26 du plan de corrections, constat ARC-05) : comparaison de deux nombres à virgule flottante.
// Chaque test donne l'écart qu'il permet, avec sa raison.
import assert from "node:assert/strict";

export function assertClose(actual: number, expected: number, tolerance: number, what: string): void {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${what} : ${actual} au lieu de ${expected} (écart permis : ${tolerance})`,
  );
}
