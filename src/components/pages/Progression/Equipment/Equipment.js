import React from 'react';

import Items from './Items.js';
import './Equipment.css';

class Equipment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const manifest = this.props.manifest;
    const equipment = this.props.state.response.profile.characterEquipment.data[this.props.route.match.params.characterId].items;

    let items = equipment.map(item => ({
      ...manifest.DestinyInventoryItemDefinition[item.itemHash],
      ...item
    }));

    let weapons = {
      subclass: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 3284755031)[0],
      kinetic: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 1498876634)[0],
      energy: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 2465295065)[0],
      power: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 953998645)[0],
      ghost: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 4023194814)[0],
      sparrow: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 2025709351)[0],
      ship: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 284967655)[0]
    };

    let armours = {
      helmet: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 3448274439)[0],
      gloves: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 3551918588)[0],
      chest: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 14239492)[0],
      legs: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 20886954)[0],
      class: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 1585787867)[0],
      emblem: items.filter(item => item.equippingBlock.equipmentSlotTypeHash === 4274335291)[0]
    };

    console.log(weapons, armours);

    return (
      <>
        <div className='equipment'>
          <div className='sub-header'>
            <div>Equipment</div>
          </div>
          <div className='character'>
            <div className='column weapons'>
              <ul className='items'>
                <Items manifest={manifest} items={Object.values(weapons)} />
              </ul>
            </div>
            <div className='column'></div>
            <div className='column'></div>
            <div className='column'></div>
            <div className='column armours'>
              <ul className='items'>
                <Items manifest={manifest} items={Object.values(armours)} />
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Equipment;
