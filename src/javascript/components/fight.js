import {controls} from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
  let fFighter = (({health, attack, defense}) => ({health, attack, defense}))(firstFighter);
  let sFighter = (({health, attack, defense}) => ({health, attack, defense}))(secondFighter);
  fFighter.id = 1;
  sFighter.id = 2;
  let leftFighterIndicator = document.querySelector('#left-fighter-indicator');
  let rightFighterIndicator = document.querySelector('#right-fighter-indicator');

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

  let isNoLocked = {
    PlayerOneCriticalHitCombination : true,
    PlayerTwoCriticalHitCombination : true
  };

  function changeDefenderHealth(damage, defender) {
    defender.health -= damage;
    let startHealth;
    let indicator;
    if (defender) {
      if (defender.id === 1) {
        indicator = leftFighterIndicator;
        startHealth = firstFighter.health;
      } else {
        indicator = rightFighterIndicator;
        startHealth = secondFighter.health;
      }
    }
    let number = defender.health > 0 ? 100 * defender.health / startHealth : 0;
    indicator.style.width = `${number}%`;
  }

  function stage(attacker, defender, attackerAction, defenderAction) {
    if (attackerAction && attackerAction.includes('Attack')) {
      if (!defenderAction || !defenderAction.includes('Block')) {
        changeDefenderHealth(getDamage(attacker, defender), defender);
      }
    }
    else if (attackerAction && isNoLocked[attackerAction] && attackerAction.includes('CriticalHitCombination')) {
      isNoLocked[attackerAction] = false;
      changeDefenderHealth(attacker.attack * 2, defender);
      setTimeout(() => isNoLocked[attackerAction] = true, 10000);
    }
  }

  return new Promise((resolve) => {
    // resolve the promise with the winner when fight is over
    const keysPressed = new Set();
    const keysPressed2 = new Set();
    let keydownHandler = ev => {
      populateActionSets(ev, keysPressed, keysPressed2);
    };
    let keyupHandler = ev => {
      if (!keysPressed.size && !keysPressed2.size) {
        return;
      }

      let actions = getActions(keysPressed, keysPressed2);

      stage(fFighter, sFighter, actions[0], actions[1]);
      stage(sFighter, fFighter, actions[1], actions[0]);
      keysPressed.clear();
      keysPressed2.clear();

      if (fFighter.health <= 0 || sFighter.health <= 0) {
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        const position = Symbol();
        resolve(fFighter.health > sFighter.health
            ? (firstFighter[position] = 'left', firstFighter)
            : (secondFighter[position] = 'right', secondFighter));
      }
    };

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keyup', keyupHandler);
  });
}

export function getDamage(attacker, defender) {
  // return damage
  let damage = getHitPower(attacker) - getBlockPower(defender);
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
