import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateCollectibleState } from '../../../destinyEnums';

class Root extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let characterCollectibles = this.props.state.response.profile.characterCollectibles.data;
    let profileCollectibles = this.props.state.response.profile.profileCollectibles.data;
    let characterId = this.props.route.match.params.characterId;

    let parent = manifest.DestinyPresentationNodeDefinition[3790247699];
    let parentBadges = manifest.DestinyPresentationNodeDefinition[498211331];

    let nodes = [];
    let recentlyDiscovered = [];
    let badges = [];

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
                let state = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash].state : false;
                state = state ? state : characterCollectibles[characterId].collectibles[collectible.collectibleHash] ? characterCollectibles[characterId].collectibles[collectible.collectibleHash].state : false;
                if (state) {
                  states.push(state);
                } else {
                  console.log(`53 Undefined state for ${collectible.collectibleHash}`);
                }
              });
            });
          } else {
            nodeChildNodeChildNode.children.collectibles.forEach(collectible => {
              let state = profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash].state : false;
              state = state ? state : characterCollectibles[characterId].collectibles[collectible.collectibleHash] ? characterCollectibles[characterId].collectibles[collectible.collectibleHash].state : false;
              if (state) {
                states.push(state);
              } else {
                console.log(`64 Undefined state for ${collectible.collectibleHash}`);
              }
            });
          }
        });
      });

      nodes.push(
        <li key={node.hash}>
          <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
          <div className='text'>
            <div>{node.displayProperties.name}</div>
            <div className='state'>
              {states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}/{states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}
            </div>
          </div>
          <Link to={`/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${characterId}/collections/${node.hash}`} />
        </li>
      );
    });

    parentBadges.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let classes = [];
      let completed = false;

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];

        let sweep = [];
        nodeChildNode.children.collectibles.forEach(collectible => {
          sweep.push(profileCollectibles.collectibles[collectible.collectibleHash] ? profileCollectibles.collectibles[collectible.collectibleHash].state : characterCollectibles[characterId].collectibles[collectible.collectibleHash].state);
        });

        classes.push({
          className: nodeChildNode.displayProperties.name,
          states: sweep
        });
      });

      classes.forEach(obj => {
        if (obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length) {
          completed = true;
        }
      });

      badges.push(
        <li
          key={node.hash}
          className={cx('badge', {
            completed: completed
          })}
        >
          <Link to={`/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${characterId}/collections/badge/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
            <div className='text'>
              <div>{node.displayProperties.name}</div>
            </div>
          </Link>
        </li>
      );
    });

    return (
      <div className='presentation-node collections'>
        <div className='nodes'>
          <div className='sub-header'>
            <div>Collections</div>
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
            <ul className='list'>{recentlyDiscovered}</ul>
          </div>
          <div className='sub-header'>
            <div>Badges</div>
          </div>
          <div className='badges'>
            <ul className='list'>{badges}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Root;
