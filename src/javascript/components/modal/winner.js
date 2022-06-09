import {showModal} from "./modal";
import {createWinnerImage} from "../fighterPreview";


export function showWinnerModal(fighter) {
  // call showModal function

    let title = `${fighter.name} wins!`;

    let bodyElement = createWinnerImage(fighter);

    let onClose = () => location.reload();
    showModal({title, bodyElement, onClose});
}
