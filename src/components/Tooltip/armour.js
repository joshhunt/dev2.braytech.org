import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../../utils/destinyEnums';

const armour = (manifest, item) => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let socketIndexes = [];

  let armourStats = [
    {
      hash: 2996146975,
      name: 'Mobility',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 392767087,
      name: 'Resilience',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 1943323491,
      name: 'Recovery',
      type: 'bar',
      modifier: 0
    }
  ];

  if (item.sockets) {
    Object.keys(item.sockets.socketCategories).forEach(key => {
      if (item.sockets.socketCategories[key].socketCategoryHash === 2518356196) {
        socketIndexes = item.sockets.socketCategories[key].socketIndexes;
        return;
      }
    });
  }

  let intrinsic = false;
  let traits = [];
  Object.values(socketIndexes).forEach(index => {
    let socket = item.sockets.socketEntries[index];

    if (socket.socketTypeHash === 1282012138) {
      return;
    }
    socket.reusablePlugItems.forEach(reusablePlug => {
      let plug = manifest.DestinyInventoryItemDefinition[reusablePlug.plugItemHash];

      if (plug.itemCategoryHashes.includes(2237038328)) {
        plug.investmentStats.forEach(modifier => {
          let index = armourStats.findIndex(stat => stat.hash === modifier.statTypeHash);
          if (index > -1) {
            armourStats[index].modifier = modifier.value;
          }
        });
        intrinsic = manifest.DestinySandboxPerkDefinition[plug.perks[0].perkHash];
        return;
      }
      if (plug.hash === socket.singleInitialItemHash) {
        plug.investmentStats.forEach(modifier => {
          let index = armourStats.findIndex(stat => stat.hash === modifier.statTypeHash);
          if (index > -1) {
            armourStats[index].modifier = modifier.value;
          }
        });
        traits.push(
          <div key={plug.hash} className='plug trait'>
            <ObservedImage className={cx('icon', 'bitmap')} src={`https://www.bungie.net${plug.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{plug.displayProperties.name}</div>
              {/* <div className="description">{plug.displayProperties.description}</div> */}
            </div>
          </div>
        );
      }
    });
  });

  let stats = [];

  armourStats.forEach(stat => {
    let value = item.stats.stats[stat.hash] ? item.stats.stats[stat.hash].value : 0;
    let modifier = stat.modifier ? stat.modifier : 0;
    stats.push(
      <div key={stat.hash} className='stat'>
        <div className='name'>{stat.name}</div>
        <div className={cx('value', stat.type)}>{stat.type === 'bar' ? <div className='bar' data-value={value + modifier} style={{ width: `${((value + modifier) / 3) * 100}%` }} /> : value + modifier}</div>
      </div>
    );
  });

  return (
    <>
      <div className='damage armour'>
        <div className={cx('power')}>
          <div className='text'>600</div>
          <div className='text'>Defence</div>
        </div>
      </div>
      {sourceString ? (
        <div className='source'>
          <p>{sourceString}</p>
        </div>
      ) : null}
      <div className='stats'>{stats}</div>
      <div className={cx('sockets', { hasTraits: traits.length > 0 })}>
        {intrinsic ? (
          <div className='plug intrinsic'>
            <ObservedImage className={cx('icon', 'bitmap')} src={`https://www.bungie.net${intrinsic.displayProperties.icon}`} />
            <div className='text'>
              <div className='name'>{intrinsic.displayProperties.name}</div>
              <div className='description'>{intrinsic.displayProperties.description}</div>
            </div>
          </div>
        ) : null}
        {traits.length > 0 ? traits : null}
      </div>
    </>
  );
};

export default armour;
