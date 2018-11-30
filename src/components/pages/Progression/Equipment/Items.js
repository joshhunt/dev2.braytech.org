import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';
import { enumerateItemState } from '../../../destinyEnums';

class Items extends React.Component {
  render() {
    const manifest = this.props.manifest;

    let items = this.props.items;

    let render = [];

    items.forEach(item => {
      let itemDefinition = manifest.DestinyInventoryItemDefinition[item.hash];

      render.push(
        <li key={item.itemInstanceId}>
          <div
            className={cx('icon', 'item', 'tooltip', {
              masterworked: enumerateItemState(item.state).masterworked
            })}
            data-itemhash={itemDefinition.hash}
          >
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
          </div>
        </li>
      );
    });

    return render;
  }
}

export default Items;
