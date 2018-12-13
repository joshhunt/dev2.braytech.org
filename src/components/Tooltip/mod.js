import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../../utils/destinyEnums';

const mod = (manifest, item) => {
  let traits = [];
  item.perks.forEach(perk => {
    let plug = manifest.DestinySandboxPerkDefinition[perk.perkHash];
    traits.push(
      <div key={plug.hash} className='plug trait'>
        <ObservedImage className={cx('icon', 'bitmap')} src={`https://www.bungie.net${plug.displayProperties.icon}`} />
        <div className='text'>
          <div className='description'>{plug.displayProperties.description}</div>
        </div>
      </div>
    );
  });

  let stats = [];
  item.investmentStats.forEach(stat => {
    let definition = manifest.DestinyStatDefinition[stat.statTypeHash];
    stats.push(
      <div key={stat.hash} className='stat'>
        <div className='name'>{definition.displayProperties.name}</div>
        <div className='value int'>+{stat.value}</div>
      </div>
    );
  });

  return (
    <>
      {stats.length > 0 ? <div className='stats'>{stats}</div> : null}
      <div className={cx('sockets', { hasTraits: traits.length > 0 })}>{traits.length > 0 ? traits : null}</div>
    </>
  );
};

export default mod;
