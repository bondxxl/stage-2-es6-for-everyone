import {showModal} from "./modal";
import {createFighterImage} from "../fighterPreview";


export function showWinnerModal(fighter) {
  // call showModal function

    let title = `${fighter.name} wins!`;

    let bodyElement = createFighterImage(fighter);
    let onClose = () => location.reload();
    showModal({title, bodyElement, onClose});
}
