import { controls } from '../../constants/controls';
// import {showWinnerModal} from "modal/winner";

export async function fight(firstFighter, secondFighter) {

  console.log(firstFighter, secondFighter);

  function isKeyIncludes(key, controls, keysSet) {
    return typeof controls[key] === 'object'
        ? controls[key].every(el => keysSet.has(el))
        : keysSet.has(controls[key]);
  }

  function populateActionSets(ev, keysPressed, keysPressed2) {
    let control = Object.keys(controls)
        .find(key => {
          return typeof controls[key] === 'object'
              ? controls[key].includes(ev.code)
              : controls[key] === ev.code;
        });
    if (control && control.includes('One')) {
      keysPressed.add(ev.code);
    } else if (control && control.includes('Two')) {
      keysPressed2.add(ev.code);
    }
  }

  function getActions(keysPressed, keysPressed2) {
    /*
    * 1. if player1 have action and player2 have action then break
    * 2. if player1 haven't action then init or stay undefined
    * 3. else if player2 haven't action then init or stay undefined
    *
    * before the iteration set we reverse it, because critical hit has the highest priority
    * */
    let pOneAction;
    let pTwoAction;
    for (const key of Array.from(Object.keys(controls)).reverse()) {
      if (pOneAction && pTwoAction) {
        break;
      }
      if (!pOneAction && isKeyIncludes(key, controls, keysPressed)) {
        pOneAction = key;
      }
      else if (!pTwoAction && isKeyIncludes(key, controls, keysPressed2)) {
        pTwoAction = key;
      }
    }
    return [pOneAction, pTwoAction];
  }

  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    const keysPressed = new Set();
    const keysPressed2 = new Set();
    window.addEventListener('keydown', ev => {
      populateActionSets(ev, keysPressed, keysPressed2);
    });

    window.addEventListener('keyup', ev => {
      if (!keysPressed.size && !keysPressed2.size) {
        return;
      }

      console.log(getActions(keysPressed, keysPressed2));

      keysPressed.clear();
      keysPressed2.clear();
    });
  });
}

export function getDamage(attacker, defender) {
  // return damage
}

export function getHitPower(fighter) {
  // return hit power
  let criticalHitChance = getRandomIntInclusive(1, 2);
  return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  // return block power
  let dodgeChance = getRandomIntInclusive(1, 2);
  return fighter.defense * dodgeChance;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
