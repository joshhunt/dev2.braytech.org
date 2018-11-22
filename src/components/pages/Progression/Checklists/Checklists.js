import React from 'react';
import cx from 'classnames';

import regionChests from './regionChests';
import lostSectors from './lostSectors';
import adventures from './adventures';
import sleeperNodes from './sleeperNodes';
import ghostScans from './ghostScans';
import latentMemories from './latentMemories';
import caydesJournals from './caydesJournals';
import './Checklists.css';

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      lowlidev: false
    };

    this.changeSkip = this.changeSkip.bind(this);
    this.lowlines = this.lowlines.bind(this);
  }

  itemsPerPage = 5;

  changeSkip = e => {
    e.preventDefault();

    let index = e.currentTarget.dataset.index;

    this.setState({
      page: Math.floor(index / this.itemsPerPage) // credit: elviswolcott
    });
  };

  lowlines = async () => {
    const request = await fetch(`https://lowlidev.com.au/destiny/api/v2/map/supported`);
    const response = await request.json();
    return response;
  }

  componentDidMount() {
    // this.lowlines().then(response => {
    //   const state = this.state;
    //   state.lowlidev = response.data;
    //   this.setState(state);
    // })
    // .catch(error => {
    //   console.log(error);
    // })
  }

  render() {

    if (this.props.viewport.width >= 1600) {
      this.itemsPerPage = 5;
    }
    if (this.props.viewport.width < 1600) {
      this.itemsPerPage = 4;
    }
    if (this.props.viewport.width < 1280) {
      this.itemsPerPage = 3;
    }
    if (this.props.viewport.width < 900) {
      this.itemsPerPage = 2;
    }
    if (this.props.viewport.width < 600) {
      this.itemsPerPage = 1;
    }

    const lists = [
      {
        name: 'Region Chests',
        list: regionChests(this)
      },
      {
        name: 'Lost Sectors',
        list: lostSectors(this.props)
      },
      {
        name: 'Adventures',
        list: adventures(this.props)
      },
      {
        name: 'Sleeper Nodes',
        list: sleeperNodes(this.props)
      },
      {
        name: 'Ghost Scans',
        list: ghostScans(this.props)
      },
      {
        name: 'Lost Memory Fragments',
        list: latentMemories(this.props)
      },
      {
        name: "Cayde's Journals",
        list: caydesJournals(this.props)
      }
    ];

    let sliceStart = parseInt(this.state.page, 10) * this.itemsPerPage;
    let sliceEnd = sliceStart + this.itemsPerPage;

    return (
      <>
        <div className="checklistSelectors">
          <ul>
            {lists.map((list, index) => {
              let active = false;

              if (index >= sliceStart && index < sliceEnd) {
                active = true;
              }

              return (
                <li key={list.name}>
                  <a
                    href="/"
                    className={cx({
                      active: active
                    })}
                    data-index={index}
                    onClick={this.changeSkip}
                  >
                    {list.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={cx('lists', 'col-' + this.itemsPerPage)}>
          {lists.slice(sliceStart, sliceEnd).map(list => {
            return (
              <div className="col" key={list.name}>
                {list.list}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

export default Checklists;
