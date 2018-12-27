import React from 'react';
import cx from 'classnames';

import ObservedImage from './ObservedImage';

import './Items.css';

class Items extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let itemsRequested = this.props.hashes;

    let items = [];
    
    itemsRequested.forEach(hash => {
      let itemDefinition = manifest.DestinyInventoryItemDefinition[hash];

      if (itemDefinition.redacted) {
        items.push(
          <li key={itemDefinition.hash + '-' + Math.random()} className={cx('item', 'tooltip')} data-itemhash={itemDefinition.hash}>
            <div className="icon">
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${manifest.settings.destiny2CoreSettings.undiscoveredCollectibleImage}`} />
            </div>
          </li>
        );
      } else {
        items.push(
          <li key={itemDefinition.hash + '-' + Math.random()} className={cx('item', 'tooltip')} data-itemhash={itemDefinition.hash}>
            <div className="icon">
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
            </div>
          </li>
        );
      }
      
    });

    return items;
  }
}

export default Items;
