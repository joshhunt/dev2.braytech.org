import React from 'react';
import cx from 'classnames';

import '../destinyEnums';

import './Tooltip.css';
import weapon from './weapon';

class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hash: false
    };

    this.tooltip = React.createRef();

    this.mouseMove = this.mouseMove.bind(this);
  }

  mouseMove = e => {
    let x = 0;
    let y = 0;
    let offset = 0;
    let tooltipWidth = 384;
    let tooltipHeight = this.state.hash ? this.tooltip.current.clientHeight : 0;
    let scrollbarAllowance = 24;

    x = e.clientX;
    y = e.clientY + offset;

    if (x + tooltipWidth + scrollbarAllowance > window.innerWidth) {
      x = x - tooltipWidth - offset;
    } else {
      x = x + offset;
    }

    if (y + tooltipHeight > window.innerHeight) {
      y = y - tooltipHeight - offset;
    }

    if (this.state.hash) {
      this.tooltip.current.style.cssText = `top: ${y}px; left: ${x}px`;
    }
  };

  componentDidUpdate() {
    if (this.state.hash) {
      this.tooltip.current.addEventListener('touchstart', e => {
        this.tooltip.current.data = { moved: false };
      });
      this.tooltip.current.addEventListener('touchmove', e => {
        this.tooltip.current.data = { moved: true };
      });
      this.tooltip.current.addEventListener('touchend', e => {
        if (!this.tooltip.current.data.moved) {
          this.setState({
            hash: false
          });
        }
      });
    }
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.mouseMove);

    let toolTipples = document.querySelectorAll('.tooltip');

    toolTipples.forEach(item => {
      item.addEventListener('mouseenter', e => {
        console.log(e)
        if (e.currentTarget.dataset.itemhash) {
          this.setState({
            hash: parseInt(e.currentTarget.dataset.itemhash, 10)
          });
        }
      });
      item.addEventListener('mouseleave', e => {
        // this.setState({
        //   hash: false
        // });
      });
      item.addEventListener('touchstart', e => {
        item.data = { moved: false };
      });
      item.addEventListener('touchmove', e => {
        item.data = { moved: true };
      });
      item.addEventListener('touchend', e => {
        if (!item.data.moved) {
          if (e.currentTarget.dataset.itemhash) {
            this.setState({
              hash: parseInt(e.currentTarget.dataset.itemhash, 10)
            });
          }
        }
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.mouseMove);
  }

  render() {
    let manifest = this.props.manifest;
    if (this.state.hash) {
      let item = manifest.DestinyInventoryItemDefinition[this.state.hash];
      console.log(item);

      let render;
      switch (item.itemType) {
        case 3:
          render = weapon(manifest, item);
          break;
        default:
      }

      return (
        <div id="tooltip" ref={this.tooltip}>
          <div className="acrylic" />
          <div className={cx('frame', item.inventory.tierTypeName.toLowerCase())}>
            <div className="header">
              <div className="name">{item.displayProperties.name}</div>
              <div>
                <div className="kind">{item.itemTypeDisplayName}</div>
                <div className="rarity">{item.inventory.tierTypeName}</div>
              </div>
            </div>
            <div className="black">{render}</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Tooltip;
