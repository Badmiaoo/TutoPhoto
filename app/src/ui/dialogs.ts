// Fenêtres du simulateur (`<dialog>`) : ouverture en haut, fermeture par un toucher sur le fond (constat INT-20 de
// l'audit, version 0.4.10).

/**
 * Ouvre une fenêtre en haut de son contenu. Fermée par son bouton du bas, une fenêtre gardait son défilement : elle se
 * rouvrait par le bas, titre et premiers choix cachés (constat INT-20 de l'audit ; « Mise au point » sur l'iPhone 14
 * émulé, défilée de 95 px à la seconde ouverture). La remise à zéro vient après showModal() : demandée fenêtre fermée,
 * elle n'a pas d'effet dans Chromium (note du plan de corrections du 15 novembre 2026, Sujet 42).
 */
export function openDialog(dialog: HTMLDialogElement): void {
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}

/**
 * Ferme une fenêtre ouverte par showModal() quand on touche le fond, hors d'elle. Sur un téléphone, il n'y a pas de
 * touche Échap, et l'iPhone n'a pas le geste « retour » d'Android, que le standard compte parmi les demandes de
 * fermeture. Le standard a un attribut pour cela, `closedby="any"` [whatwg-html-dialog-closedby], mais Safari ne
 * l'applique qu'à partir de sa version 27.3, encore en bêta quand la version 27.2 est la version courante
 * [mdn-bcd-8-1-10-closedby] : la fermeture est donc écrite ici, pour tous les navigateurs. Le fond (`::backdrop`) fait
 * partie de l'élément `dialog` : un toucher sur lui a la fenêtre pour cible, comme un toucher sur sa marge intérieure ;
 * on regarde donc si le point est hors du rectangle de la fenêtre. Le geste doit commencer et finir hors d'elle : un
 * doigt posé dans la fenêtre et levé sur le fond (une sélection de texte, un défilement) ne la ferme pas.
 */
export function closeOnBackdrop(dialog: HTMLDialogElement): void {
  const outside = (e: MouseEvent) => {
    const box = dialog.getBoundingClientRect();
    return e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
  };
  let startedOutside = false;
  dialog.addEventListener("pointerdown", (e) => {
    startedOutside = e.target === dialog && outside(e);
  });
  dialog.addEventListener("click", (e) => {
    if (startedOutside && e.target === dialog && outside(e)) dialog.close();
    startedOutside = false;
  });
}
