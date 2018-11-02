import React from 'react';
import cx from 'classnames'

import regionChests from './regionChests'
import lostSectors from './lostSectors'
import adventures from './adventures'
import sleeperNodes from './sleeperNodes'
import ghostScans from './ghostScans'
import './Checklists.css'

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skip: 0
    }

    this.changeSkip = this.changeSkip.bind(this);
  }
  
  /*
    checklists  
      region chests
      lost sectors
      adventures
      sleeper nodes
      ghost scans
      latent memories
      caydes journals
  */

  changeSkip = (e) => {

    e.preventDefault();

    let index = e.currentTarget.dataset.index;
    console.log(index);

    this.setState({
      skip: index
    })

  }
  
  render() {

    console.log(this.props)

    let itemsPerPage = 5;
    if (this.props.viewport.width < 1600) {
      itemsPerPage = 4;
    }
    if (this.props.viewport.width < 1280) {
      itemsPerPage = 3;
    }
    if (this.props.viewport.width < 900) {
      itemsPerPage = 2;
    }
    if (this.props.viewport.width < 600) {
      itemsPerPage = 1;
    }

    const lists = [
      {
        name: "Region Chests",
        list: regionChests(this.props)
      },
      {
        name: "Lost Sectors",
        list: lostSectors(this.props)
      },
      {
        name: "Adventures",
        list: adventures(this.props)
      },
      {
        name: "Sleeper Nodes",
        list: sleeperNodes(this.props)
      },
      {
        name: "Ghost Scans",
        list: ghostScans(this.props)
      }
    ];

    return (
      <>
        <div className="checklistSelectors">
          <ul>
            { lists.map((list, index) => {
                console.log(list, index)

                let active = false;
                // % 5 === 0
                // if (index >= this.state.skip && index <= itemsPerPage) {
                //   active = true;
                // }
                // if (this.state.skip > 0 && (index + 1) > itemsPerPage) {
                //   active = false;
                // }
                // if (index < itemsPerPage) {
                //   active = true;
                // }
                // if (index < (this.state.skip + 1) * itemsPerPage && index >= this.state.skip) {
                //   active = true;
                // }
                if (index >= this.state.skip && index < (parseInt(this.state.skip, 10) + parseInt(itemsPerPage, 10))) {
                  active = true;
                }

                return (
                  <li key={list.name}>
                    <a href="/" 
                    className={cx(
                      {
                        "active": active
                      }
                    )} 
                    data-index={index} 
                    onClick={this.changeSkip}>{list.name}</a>
                  </li>
                )
              }) }
          </ul>
        </div>
        <div className={cx(
            "checklists",
            "col-" + itemsPerPage
          )}>
          { lists.slice(this.state.skip, (parseInt(this.state.skip, 10) + parseInt(itemsPerPage, 10))).map(list => {
              return (
                <div className="col" key={list.name}>{list.list}</div>
              )
            }) }
        </div>
      </>
    )
  }
}

export default Checklists;