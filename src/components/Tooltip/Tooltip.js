import React from 'react';
import cx from 'classnames';

import db from '../db';
import '../destinyEnums';

import './Tooltip.css';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      manifest: false
    };
  }

  componentDidMount() {
    db.table('manifest')
      .toArray()
      .then(manifest => {
        let state = this.state;
        state.manifest = manifest[0].value;
        this.setState(state);
      });
  }

  render() {
    if (this.state.manifest) {
      let manifest = this.state.manifest;
      let item = manifest.DestinyInventoryItemDefinition[this.props.hash];
      console.log(item);
      return (
        <>
          <div id="tooltip">
            <div className="acrylic" />
            <div className={cx('frame', item.inventory.tierTypeName.toLowerCase())}>
              <div className="header">
                <div className="name">{item.displayProperties.name}</div>
                <div>
                  <div className="kind">{item.itemTypeDisplayName}</div>
                  <div className="rarity">{item.inventory.tierTypeName}</div>
                </div>
              </div>
              <div className="black"></div>
            </div>
          </div>
          <div className="example" />
        </>
      );
    } else {
      return <div id="tooltip">loading db</div>;
    }
  }
}

export default Tooltip;
