import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../destinyEnums';
import { damageTypeToString, ammoTypeToString } from '../destinyUtils';

const weaponsStats = [
  {
    hash: 2837207746,
    name: 'Swing Speed',
    type: 'bar'
  },
  {
    hash: 3614673599,
    name: 'Blast Radius',
    type: 'bar'
  },
  {
    hash: 2523465841,
    name: 'Velocity',
    type: 'bar'
  },
  {
    hash: 4043523819,
    name: 'Impact',
    type: 'bar'
  },
  {
    hash: 1240592695,
    name: 'Range',
    type: 'bar'
  },
  {
    hash: 2762071195,
    name: 'Efficiency',
    type: 'bar'
  },
  {
    hash: 209426660,
    name: 'Defence',
    type: 'bar'
  },
  {
    hash: 155624089,
    name: 'Stability',
    type: 'bar'
  },
  {
    hash: 943549884,
    name: 'Handling',
    type: 'bar'
  },
  {
    hash: 4188031367,
    name: 'Reload Speed',
    type: 'bar'
  },
  {
    hash: 1345609583,
    name: 'Aim Assistance',
    type: 'bar',
    hidden: true
  },
  {
    hash: 2715839340,
    name: 'Recoil Direction',
    type: 'bar',
    hidden: true
  },
  {
    hash: 3555269338,
    name: 'Zoom',
    type: 'bar',
    hidden: true
  },
  {
    hash: 1931675084,
    name: 'Inventory Size',
    type: 'bar',
    hidden: true
  },
  {
    hash: 925767036,
    name: 'Ammo Capacity',
    type: 'int'
  },
  {
    hash: 4284893193,
    name: 'Rounds Per Minute',
    type: 'int'
  },
  {
    hash: 2961396640,
    name: 'Charge Time',
    type: 'int'
  },
  {
    hash: 3871231066,
    name: 'Magazine',
    type: 'int'
  }
];

const weapon = (manifest, item) => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let socketIndexes;
  Object.keys(item.sockets.socketCategories).forEach(key => {
    if (item.sockets.socketCategories[key].socketCategoryHash === 4241085061) {
      socketIndexes = item.sockets.socketCategories[key].socketIndexes;
      return;
    }
  });

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
        intrinsic = manifest.DestinySandboxPerkDefinition[plug.perks[0].perkHash];
        return;
      }
      if (plug.hash === socket.singleInitialItemHash) {
        plug.investmentStats.forEach(modifier => {
          let index = weaponsStats.findIndex(stat => stat.hash === modifier.statTypeHash);
          if (index > -1) {
            weaponsStats[index].modifier = modifier.value;
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

  weaponsStats.forEach(stat => {
    if (stat.hidden) {
      return;
    }
    if (Object.keys(item.stats.stats).includes(stat.hash.toString())) {
      let modifier = stat.modifier ? stat.modifier : 0;
      stats.push(
        <div key={stat.hash} className='stat'>
          <div className='name'>{stat.name}</div>
          <div className={cx('value', stat.type)}>{stat.type === 'bar' ? <div className='bar' data-value={item.stats.stats[stat.hash].value + modifier} style={{ width: `${item.stats.stats[stat.hash].value + modifier}%` }} /> : item.stats.stats[stat.hash].value + modifier}</div>
        </div>
      );
    }
  });

  return (
    <>
      <div className='damage weapon'>
        <div className={cx('power', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())}>
          <div className={cx('icon', damageTypeToString(item.damageTypeHashes[0]).toLowerCase())} />
          <div className='text'>600</div>
        </div>
        <div className='slot'>
          <div className={cx('icon', ammoTypeToString(item.equippingBlock.ammoType).toLowerCase())} />
          <div className='text'>{ammoTypeToString(item.equippingBlock.ammoType)}</div>
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

export default weapon;
