import React from 'react';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import regionChests from './lists/regionChests';
import lostSectors from './lists/lostSectors';
import adventures from './lists/adventures';
import corruptedEggs from './lists/corruptedEggs';
import ahamkaraBones from './lists/ahamkaraBones';
import catStatues from './lists/catStatues';
import sleeperNodes from './lists/sleeperNodes';
import ghostScans from './lists/ghostScans';
import latentMemories from './lists/latentMemories';
import caydesJournals from './lists/caydesJournals';
import './styles.css';

class Checklists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      lowlidev: false
    };

    this.changeSkip = this.changeSkip.bind(this);
  }

  itemsPerPage = 5;

  changeSkip = e => {
    e.preventDefault();

    let index = e.currentTarget.dataset.index;

    this.setState({
      page: Math.floor(index / this.itemsPerPage)
    });
  };

  render() {
    const {t} = this.props;
    if (this.props.viewport.width >= 2000) {
      this.itemsPerPage = 5;
    }
    if (this.props.viewport.width < 2000) {
      this.itemsPerPage = 4;
    }
    if (this.props.viewport.width < 1600) {
      this.itemsPerPage = 3;
    }
    if (this.props.viewport.width < 1200) {
      this.itemsPerPage = 2;
    }
    if (this.props.viewport.width < 800) {
      this.itemsPerPage = 1;
    }

    const lists = [
      {
        name: t('Region Chests'),
        icon: 'destiny-region_chests',
        list: regionChests(this)
      },
      {
        name: t('Lost Sectors'),
        icon: 'destiny-lost_sectors',
        list: lostSectors(this.props)
      },
      {
        name: t('Adventures'),
        icon: 'destiny-adventure',
        list: adventures(this.props)
      },
      {
        name: t('Corrupted Eggs'),
        icon: 'destiny-corrupted_eggs',
        list: corruptedEggs(this.props)
      },
      {
        name: t('Ahamkara Bones '),
        icon: 'destiny-ahamkara_bones',
        list: ahamkaraBones(this.props)
      },
      {
        name: t('Cat Statues'),
        icon: 'destiny-cat_statues',
        list: catStatues(this.props)
      },
      {
        name: t('Sleeper Nodes'),
        icon: 'destiny-sleeper_nodes',
        list: sleeperNodes(this.props)
      },
      {
        name: t('Ghost Scans'),
        icon: 'destiny-ghost',
        list: ghostScans(this.props)
      },
      {
        name: t('Lost Memory Fragments'),
        icon: 'destiny-lost_memory_fragments',
        list: latentMemories(this.props)
      }
    ];

    if (Object.values(this.props.response.profile.profileProgression.data.checklists[2448912219]).filter(value => value === true).length === 4) {
      lists.push({
        name: t("Cayde's Journals"),
        icon: 'destiny-ace_of_spades',
        list: caydesJournals(this.props)
      });
    }

    let sliceStart = parseInt(this.state.page, 10) * this.itemsPerPage;
    let sliceEnd = sliceStart + this.itemsPerPage;

    return (
      <div className='view' id='checklists'>
        <div className='views'>
          <div className='sub-header sub'>
            <div>Checklists</div>
          </div>
          <ul className='list'>
            {lists.map((list, index) => {
              let active = false;

              if (index >= sliceStart && index < sliceEnd) {
                active = true;
              }

              return (
                <li key={list.name} className='linked'>
                  <a
                    href='/'
                    className={cx({
                      active: active
                    })}
                    data-index={index}
                    onClick={this.changeSkip}
                  >
                    <div className={list.icon} />
                    <div className='name'>{list.name}</div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={cx('lists', 'col-' + this.itemsPerPage)}>
          {lists.slice(sliceStart, sliceEnd).map(list => {
            return (
              <div className='col' key={list.name}>
                {list.list}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Checklists);