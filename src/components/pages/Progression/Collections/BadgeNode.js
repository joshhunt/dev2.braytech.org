import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateCollectibleState } from '../../../destinyEnums';
import '../CollectionItems.css';

class BadgeNode extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let characterCollectibles = this.props.response.profile.characterCollectibles.data;
    let profileCollectibles = this.props.response.profile.profileCollectibles.data.collectibles;
    let characterId = this.props.match.params.characterId;

    let badgeDefinition = manifest.DestinyPresentationNodeDefinition[this.props.match.params.secondary];

    let badgeChildren = [];
    let classStates = [];

    badgeDefinition.children.presentationNodes.forEach(node => {
      let nodeDefinition = manifest.DestinyPresentationNodeDefinition[node.presentationNodeHash];

      let childItems = [];
      let classState = [];

      nodeDefinition.children.collectibles.forEach(child => {
        let collectibleDefinition = manifest.DestinyCollectibleDefinition[child.collectibleHash];

        let state;
        if (profileCollectibles[child.collectibleHash]) {
          state = profileCollectibles[child.collectibleHash] ? profileCollectibles[child.collectibleHash].state : 0;
        } else if (characterCollectibles[characterId].collectibles[child.collectibleHash]) {
          state = characterCollectibles[characterId].collectibles[child.collectibleHash] ? characterCollectibles[characterId].collectibles[child.collectibleHash].state : 0;
        } else {
          state = 0;
        }

        classState.push(state);
        if (collectibleDefinition.redacted) {
          childItems.push(
            <li
              key={collectibleDefinition.hash}
              className={cx('redacted', 'tooltip', {
                completed: !enumerateCollectibleState(state).notAcquired
              })}
              data-itemhash='343'
            >
              <div className='icon'>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
              </div>
              <div className='text'>
                <div className='name'>Classiefied</div>
              </div>
            </li>
          );
        } else {
          childItems.push(
            <li
              key={collectibleDefinition.hash}
              className={cx('tooltip', {
                completed: !enumerateCollectibleState(state).notAcquired
              })}
              data-itemhash={collectibleDefinition.itemHash}
            >
              <div className='icon'>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
              </div>
              <div className='text'>
                <div className='name'>{collectibleDefinition.displayProperties.name}</div>
              </div>
            </li>
          );
        }
      });

      badgeChildren.push(
        <div key={nodeDefinition.hash} className='class'>
          <div className='sub-header sub'>
            <div>{nodeDefinition.displayProperties.name}</div>
          </div>
          <ul className='list tertiary collection-items items'>{childItems}</ul>
        </div>
      );

      classStates.push({
        class: nodeDefinition.displayProperties.name,
        states: classState
      });
    });

    let completed = false;
    let progress = [];

    classStates.forEach(obj => {
      if (obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length) {
        completed = true;
      }
      progress.push(
        <div key={obj.class} className='progress'>
          <div className='title'>{obj.class}</div>
          <div className='fraction'>
            {obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}/{obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}
          </div>
          <div
            className={cx('bar', {
              completed: obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length
            })}
            style={{
              width: `${(obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length / obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length) * 100}%`
            }}
          />
        </div>
      );
    });

    let hires = {
      3241617029: '01E3-00000278.PNG',
      1419883649: '01E3-00000280.PNG',
      3333531796: '01E3-0000027C.PNG',
      2904806741: '01E3-00000244.PNG',
      1331476689: '01E3-0000024C.PNG',
      2881240068: '01E3-00000248.PNG',
      3642989833: '01E3-00000266.PNG',
      2399267278: '037E-00001D4C.PNG',
      701100740: '01A3-0000189C.PNG',
      1420354007: '01E3-0000032C.PNG',
      1086048586: '01E3-00000377.PNG'
    };

    //`https://www.bungie.net${badgeDefinition.displayProperties.icon}`

    return (
      <div className='presentation-node collections'>
        <div className='sub-header'>
          <div>Collections</div>
        </div>
        <div className='node badge'>
          <div className='children'>
            <div className='icon'>
              <ObservedImage className={cx('image')} src={`/static/images/extracts/badges/${hires[badgeDefinition.hash]}`} />
            </div>
            <div className='text'>
              <div className='name'>{badgeDefinition.displayProperties.name}</div>
              <div className='description'>{badgeDefinition.displayProperties.description}</div>
            </div>
            <div className='until'>
              {completed ? <h4 className='completed'>Badge completed</h4> : <h4>Badge progress</h4>}
              {progress}
            </div>
          </div>
          <div className='records'>{badgeChildren}</div>
        </div>
      </div>
    );
  }
}

export default BadgeNode;
