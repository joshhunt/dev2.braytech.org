import React from 'react';

import InventoryItems from '../../components/InventoryItems';

import './styles.css';
import { withNamespaces } from 'react-i18next';

class Character extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    console.log(this);

    const equipment = this.props.response.profile.characterEquipment.data[characterId].items;

    let items = equipment.map(item => ({
      ...manifest.DestinyInventoryItemDefinition[item.itemHash],
      ...item
    }));

    console.log(this, items);

    let weapons = {
      subclass: items.find(item => item.inventory.bucketTypeHash === 3284755031),
      kinetic: items.find(item => item.inventory.bucketTypeHash === 1498876634),
      energy: items.find(item => item.inventory.bucketTypeHash === 2465295065),
      power: items.find(item => item.inventory.bucketTypeHash === 953998645),
      ghost: items.find(item => item.inventory.bucketTypeHash === 4023194814),
      sparrow: items.find(item => item.inventory.bucketTypeHash === 2025709351),
      ship: items.find(item => item.inventory.bucketTypeHash === 284967655)
    };

    let armours = {
      helmet: items.find(item => item.inventory.bucketTypeHash === 3448274439),
      gloves: items.find(item => item.inventory.bucketTypeHash === 3551918588),
      chest: items.find(item => item.inventory.bucketTypeHash === 14239492),
      legs: items.find(item => item.inventory.bucketTypeHash === 20886954),
      class: items.find(item => item.inventory.bucketTypeHash === 1585787867),
      emblem: items.find(item => item.inventory.bucketTypeHash === 4274335291)
    };

    console.log(weapons, armours);

    return (
      <div className='view' id='character'>
        <div className='wrapper'>
          <div className='column weapons'>
            <ul className='list items'>
              <InventoryItems manifest={manifest} hashes={Object.values(weapons).map(item => item.hash)} />
            </ul>
          </div>
          <div className='column' />
          <div className='column' />
          <div className='column' />
          <div className='column armours'>
            <ul className='list items'>
              <InventoryItems manifest={manifest} hashes={Object.values(armours).map(item => item.hash)} />
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Character);
