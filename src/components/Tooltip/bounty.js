import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../../utils/destinyEnums';

const bounty = (manifest, item) => {
  let description = item.displaySource !== '' ? item.displaySource : false;

  let objective = item.displayProperties.description;
  let objectives = [];
  let rewards = [];

  item.objectives.objectiveHashes.forEach(element => {
    let definition = manifest.DestinyObjectiveDefinition[element];

    objectives.push(
      <div key={definition.hash} className='progress'>
        <div className='title'>{definition.progressDescription}</div>
        <div className='fraction'>
          {0}/{definition.completionValue}
        </div>
        <div
          className='bar'
          style={{
            width: `0%`
          }}
        />
      </div>
    );
  });

  item.value.itemValue.forEach(value => {
    if (value.itemHash !== 0) {
      let definition = manifest.DestinyInventoryItemDefinition[value.itemHash];
      rewards.push(
        <li key={value.itemHash}>
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${definition.displayProperties.icon}`} />
          <div className='text'>
            {definition.displayProperties.name}
            {value.quantity > 1 ? <> +{value.quantity}</> : null}
          </div>
        </li>
      );
    }
  });

  return (
    <>
      <div className='objective'>{objective}</div>
      {objectives ? <div className='objectives'>{objectives}</div> : null}
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {rewards.length ? (
        <div className='rewards'>
          <ul>{rewards}</ul>
        </div>
      ) : null}
    </>
  );
};

export default bounty;
