import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';

import { enumerateCollectibleState } from '../../utils/destinyEnums';

class Root extends React.Component {
  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const characterCollectibles = this.props.response.profile.characterCollectibles.data;
    const profileCollectibles = this.props.response.profile.profileCollectibles.data;

    const parent = manifest.DestinyPresentationNodeDefinition[3790247699];
    const parentBadges = manifest.DestinyPresentationNodeDefinition[498211331];

    let nodes = [];
    let recentlyDiscovered = [];
    let badges = [];
    let collectionsStates = [];
    let badgesStates = [];

    // recently discovered
    profileCollectibles.recentCollectibleHashes.forEach(child => {
      let collectibleDefinition = manifest.DestinyCollectibleDefinition[child];

      recentlyDiscovered.push(
        <li key={collectibleDefinition.hash} className={cx('item', 'tooltip')} data-itemhash={collectibleDefinition.itemHash}>
          <div className='icon'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${collectibleDefinition.displayProperties.icon}`} />
          </div>
        </li>
      );
    });

    // items nodes
    parent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];
        nodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          let nodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];
          if (nodeChildNodeChildNode.children.presentationNodes.length > 0) {
            nodeChildNodeChildNode.children.presentationNodes.forEach(nodeChildNodeChildNodeChild => {
              let nodeChildNodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChildNodeChild.presentationNodeHash];
              nodeChildNodeChildNodeChildNode.children.collectibles.forEach(collectible => {
                let scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[characterId].collectibles[collectible.collectibleHash];
                if (scope) {
                  states.push(scope.state);
                  collectionsStates.push(scope.state);
                } else {
                  console.log(`57 Undefined state for ${collectible.collectibleHash}`);
                }
              });
            });
          } else {
            nodeChildNodeChildNode.children.collectibles.forEach(collectible => {
              let scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[characterId].collectibles[collectible.collectibleHash];
              if (scope) {
                states.push(scope.state);
                collectionsStates.push(scope.state);
              } else {
                console.log(profileCollectibles.collectibles[collectible.collectibleHash], characterCollectibles[characterId].collectibles[collectible.collectibleHash], `68 Undefined state for ${collectible.collectibleHash}`);
              }
            });
          }
        });
      });

      nodes.push(
        <div key={node.hash} className='node'>
          <div className='images'>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
          </div>
          <div className='text'>
            <div>{node.displayProperties.name}</div>
            <div className='state'>
              <span>{states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}</span> / {states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}
            </div>
          </div>
          <Link to={`/collections/${node.hash}`} />
        </div>
      );
    });

    // badges
    parentBadges.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let classes = [];
      let fullComplete = 0;
      let semiComplete = false;

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        let sweep = [];
        nodeChildNode.children.collectibles.forEach(collectible => {
          let scope = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash] : characterCollectibles[characterId].collectibles[collectible.collectibleHash];
          if (scope) {
            sweep.push(scope.state);
          } else {
            console.log(`105 Undefined state for ${collectible.collectibleHash}`);
          }
        });

        classes.push({
          className: nodeChildNode.displayProperties.name,
          states: sweep
        });
      });

      classes.forEach(obj => {
        if (obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length) {
          fullComplete += 1;
          semiComplete = true;
        }
      });

      if (semiComplete) {
        badgesStates.push(node.displayProperties.name);
      }

      badges.push(
        <li
          key={node.hash}
          className={cx('badge', 'linked', {
            semiComplete: semiComplete,
            fullComplete: fullComplete
          })}
        >
          <Link to={`/collections/badge/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
            <div className='text'>
              <div>{node.displayProperties.name}</div>
            </div>
          </Link>
        </li>
      );
    });

    return (
      <>
        <div className='nodes'>
          <div className='sub-header'>
            <div>Items</div>
            <div>
              {collectionsStates.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}/{collectionsStates.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}
            </div>
          </div>
          <div className='node'>
            <div className='parent'>
              <ul className='list'>{nodes}</ul>
            </div>
          </div>
        </div>
        <div className='sidebar'>
          <div className='sub-header'>
            <div>Recently discovered</div>
          </div>
          <div className='recently-discovered'>
            <ul className='list'>{recentlyDiscovered.reverse()}</ul>
          </div>
          <div className='sub-header'>
            <div>Badges</div>
            <div>
              {badgesStates.length}/{parentBadges.children.presentationNodes.length}
            </div>
          </div>
          <div className='badges'>
            <ul className='list'>{badges}</ul>
          </div>
        </div>
      </>
    );
  }
}

export default Root;
