import React from 'react';
import cx from 'classnames';
import ObservedImage from '../ObservedImage';
import '../../utils/destinyEnums';
import { damageTypeToString, ammoTypeToString } from '../../utils/destinyUtils';

const round = number => {
  const floor = Math.floor(number);

  if (number - floor > 0.5) {
    return Math.ceil(number);
  } else {
    return floor;
  }
};

const interpolate = (investmentValue, displayInterpolation) => {
  const interpolation = [...displayInterpolation].sort((a, b) => a.value - b.value);

  const upperBound = interpolation.find(point => point.value >= investmentValue);
  const lowerBound = [...interpolation].reverse().find(point => point.value <= investmentValue);

  if (!upperBound && !lowerBound) {
    console.log('Invalid displayInterpolation');
  }

  if (!upperBound || !lowerBound) {
    if (upperBound) {
      return upperBound.weight;
    } else if (lowerBound) {
      return lowerBound.weight;
    } else {
      console.log('Invalid displayInterpolation');
    }
  }

  const range = upperBound.value - lowerBound.value;
  const factor = range > 0 ? (investmentValue - lowerBound.value) / 100 : 1;

  const displayValue = lowerBound.weight + (upperBound.weight - lowerBound.weight) * factor;
  return round(displayValue);
};

const badSockets = [
  4248210736, // Shaders
  236077174, // Y1 Masterworks
  2285418970, // Y2 Masterwork Trackers
  2323986101, // Mod Sockets
  2931483505, // Ornaments
  1959648454 // ornmanets
];

const weapon = (manifest, item) => {
  let sourceString = item.collectibleHash ? (manifest.DestinyCollectibleDefinition[item.collectibleHash] ? manifest.DestinyCollectibleDefinition[item.collectibleHash].sourceString : false) : false;

  let weaponsStats = [
    {
      hash: 2837207746,
      name: 'Swing Speed',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 3614673599,
      name: 'Blast Radius',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 2523465841,
      name: 'Velocity',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 4043523819,
      name: 'Impact',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 1240592695,
      name: 'Range',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 2762071195,
      name: 'Efficiency',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 209426660,
      name: 'Defence',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 155624089,
      name: 'Stability',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 943549884,
      name: 'Handling',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 4188031367,
      name: 'Reload Speed',
      type: 'bar',
      modifier: 0
    },
    {
      hash: 1345609583,
      name: 'Aim Assistance',
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 2715839340,
      name: 'Recoil Direction',
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 3555269338,
      name: 'Zoom',
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 1931675084,
      name: 'Inventory Size',
      type: 'bar',
      modifier: 0,
      hidden: true
    },
    {
      hash: 925767036,
      name: 'Ammo Capacity',
      type: 'int',
      modifier: 0
    },
    {
      hash: 4284893193,
      name: 'Rounds Per Minute',
      type: 'int',
      modifier: 0
    },
    {
      hash: 2961396640,
      name: 'Charge Time',
      type: 'int',
      modifier: 0
    },
    {
      hash: 3871231066,
      name: 'Magazine',
      type: 'int',
      modifier: 0
    }
  ];

  let statGroup = manifest.DestinyStatGroupDefinition[item.stats.statGroupHash];

  let intrinsic = false;
  let traits = [];
  item.sockets.socketEntries.forEach(socket => {
    if (badSockets.includes(socket.singleInitialItemHash) || socket.socketTypeHash === 2218962841) {
      return;
    }

    socket.reusablePlugItems.forEach(reusablePlug => {
      let plug = manifest.DestinyInventoryItemDefinition[reusablePlug.plugItemHash];

      if (plug.itemCategoryHashes.includes(2237038328)) {
        intrinsic = manifest.DestinySandboxPerkDefinition[plug.perks[0].perkHash];
      }

      if (plug.hash === socket.singleInitialItemHash) {
        plug.investmentStats.forEach(modifier => {
          let index = weaponsStats.findIndex(stat => stat.hash === modifier.statTypeHash);
          if (index > -1) {
            weaponsStats[index].modifier = modifier.value;
          }
        });

        if (plug.itemCategoryHashes.includes(2237038328)) {
          return;
        }
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
      if (stat.hash === 3871231066) {
        modifier = 0;
      }

      let investmentStat = item.investmentStats.find(investment => investment.statTypeHash === stat.hash);
      let scaledStats = statGroup.scaledStats.find(scale => scale.statHash === stat.hash);

      let interpolatatedModifier = scaledStats ? interpolate(investmentStat.value + modifier, scaledStats.displayInterpolation) : modifier;

      let value = interpolatatedModifier;
      if (stat.hash === 3871231066) {
        value = value < 1 ? 1 : value;
      }

      stats.push(
        <div key={stat.hash} className='stat'>
          <div className='name'>{stat.name}</div>
          <div className={cx('value', stat.type)}>{stat.type === 'bar' ? <div className='bar' data-value={value} style={{ width: `${value}%` }} /> : value}</div>
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
