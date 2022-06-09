import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  // todo: show fighter info (image, name, health, etc.)

  function createFighterInfo(fighter) {
    const fighterInfo = createElement({
      tagName: 'div',
      className: 'fighter-preview___info'
    });

    Object.keys(fighter).forEach(el => {
      console.log(el);
      if (el !== '_id' && el !== 'source') {
        const item = createElement({
          tagName: 'div',
          className: 'fighter-preview___item'
        });
        item.innerText = `${el} : ${fighter[el]}`;
        fighterInfo.append(item);
      }
    });

    return fighterInfo;
  }

  if (fighter){
    fighterElement.append(createFighterImage(fighter));
    fighterElement.append(createFighterInfo(fighter));
  }

  return fighterElement;
}


export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

export function createWinnerImage(fighter) {
  const { source, name } = fighter;
  const attributes = {
    src: source,
    title: name,
    alt: name
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img-winner',
    attributes,
  });

  return imgElement;
}
