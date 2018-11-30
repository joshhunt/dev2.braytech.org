import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../ObservedImage';

class Items extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let sales = this.props.sales;

    let items = [];

    sales.forEach(sale => {
      if (sale.costs !== undefined) {
        let itemDefinition = manifest.DestinyInventoryItemDefinition[sale.itemHash];

        let costs = [];
        sale.costs.forEach(cost => {
          let costDefinition = manifest.DestinyInventoryItemDefinition[cost.itemHash];
          costs.push(
            <li key={costDefinition.hash} className='tooltip' data-itemhash={costDefinition.hash}>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${costDefinition.displayProperties.icon}`} />
              <div className='value'>{cost.quantity}</div>
            </li>
          );
        });

        items.push(
          <li key={itemDefinition.hash + '-' + Math.random()}>
            <div className='icon item tooltip' data-itemhash={itemDefinition.hash}>
              <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
              {sale.quantity > 1 ? <div className='quantity'>{sale.quantity}</div> : null}
            </div>
            <div className='costs'>
              <ul>{costs}</ul>
            </div>
          </li>
        );
      } else {
        let itemDefinition = manifest.DestinyInventoryItemDefinition[sale];
        if (itemDefinition) {
          items.push(
            <li key={itemDefinition.hash + '-' + Math.random()}>
              <div className='icon item tooltip' data-itemhash={itemDefinition.hash}>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${itemDefinition.displayProperties.icon}`} />
              </div>
            </li>
          );
        } else {
          console.log(sale);
        }
      }
    });

    return items;
  }
}

export default Items;
