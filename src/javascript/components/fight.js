import {controls} from '../../constants/controls';

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

  function stage(player1, player2, action1, action2) {
    if (action1 && action1.includes('Attack')) {
      if (action2 && action2.includes('Block')) {
        player2.health -= getDamage(player1, player2);
      } else {
        player2.health -= getDamage(player1, null);
      }
    }
    else if (action1 && action1.includes('CriticalHitCombination')) {
      player2.health -= player1.attack * 2;
    }
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

      let actions = getActions(keysPressed, keysPressed2);
      console.log(actions[0] + actions[1]);

      console.log(firstFighter.health, secondFighter.health);
      stage(firstFighter, secondFighter, actions[0], actions[1]);
      stage(secondFighter, firstFighter, actions[1], actions[0]);
      console.log(firstFighter.health, secondFighter.health);
      keysPressed.clear();
      keysPressed2.clear();

      if (firstFighter.health <= 0 || secondFighter.health <= 0) {

        // showWinnerModal(firstFighter.health > secondFighter.health ? firstFighter : secondFighter);
        resolve(firstFighter.health > secondFighter.health ? firstFighter : secondFighter);
      }
    });
  });
}

export function getDamage(attacker, defender) {
  // return damage
  let damage = getHitPower(attacker) - getBlockPower(defender);
  console.log('damage: ', damage);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  // return hit power
  let randomIntInclusive = getRandomFloatInclusive(1, 2);
  return fighter.attack * randomIntInclusive;
}

export function getBlockPower(fighter) {
  if (!fighter) {
    return 0;
  }
  // return block power
  let dodgeChance = getRandomFloatInclusive(1, 2);
  return fighter.defense * dodgeChance;
}

/*function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}*/

// Generates values from <0, 1>
function randomizeValue() {
  const value = (1 + 10E-16) * Math.random();

  if (value > 1.0) {
    return 1.0;
  }

  return value;
}

/*
	inclusive min (result can be equal to min value)
    inclusive max (result can be equal to min value)
*/
function getRandomFloatInclusive(min, max) {
  if(max == null) {
    max = (min == null ? Number.MAX_VALUE : min);
    min = 0.0;
  }

  if(min >= max) {
    throw new Error("Incorrect arguments.");
  }

  return min + (max - min) * randomizeValue();
}
