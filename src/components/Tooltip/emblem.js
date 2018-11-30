import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../destinyEnums';

const emblem = (manifest, item) => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let description = item.displayProperties.description !== '' ? item.displayProperties.description : false;

  return (
    <>
      <ObservedImage className={cx('image', 'emblem')} src={`https://www.bungie.net${item.secondaryIcon}`} />
      {description ? (
        <div className='description'>
          <pre>{description}</pre>
        </div>
      ) : null}
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
    </>
  );
};

export default emblem;
