import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateCollectibleState } from '../../../destinyEnums';
import Collectibles from './Collectibles';

class BadgeNode extends React.Component {
  
  render() {

    let manifest = this.props.manifest;

    let characterCollectibles = this.props.state.ProfileResponse.characterCollectibles.data;
    let profileCollectibles = this.props.state.ProfileResponse.profileCollectibles.data.collectibles;
    let characterId = this.props.route.match.params.characterId;

    let badgeDefinition = manifest.DestinyPresentationNodeDefinition[this.props.route.match.params.secondary];
  
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
        }
        else if (characterCollectibles[characterId].collectibles[child.collectibleHash]) {
          state = characterCollectibles[characterId].collectibles[child.collectibleHash] ? characterCollectibles[characterId].collectibles[child.collectibleHash].state : 0;
        }
        else {
          state = 0;
        }

        classState.push(state);
        
        childItems.push(
          <li key={collectibleDefinition.hash} className={cx(
                {
                  "completed": !enumerateCollectibleState(state).notAcquired
                }
              )}>
            <div className="icon">  
              <ObservedImage className={cx(
                    "image",
                    "icon"
                  )}
                src={ `https://www.bungie.net${ collectibleDefinition.displayProperties.icon }` } />
            </div>
            <div className="text">
              <div className="name">{ collectibleDefinition.displayProperties.name }</div>
            </div>
          </li>
        )

      });

      badgeChildren.push(
        <div key={nodeDefinition.hash} className="class">
          <h5>{nodeDefinition.displayProperties.name}</h5>
          <ul className="list tertiary items">
            {childItems}
          </ul>
        </div>
      );

      classStates.push(
        {
          "class": nodeDefinition.displayProperties.name,
          "states": classState
        }
      );
      
    });

    let completed = false;
    let progress = [];

    classStates.forEach(obj => {
      if (obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length) {
        completed = true;
      }
      progress.push(
        <div key={obj.class} className="progress">
          <div className="title">{obj.class}</div>
          <div className="fraction">{obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length}/{obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length}</div>
          <div className={cx(
            "bar",
            {
              "completed": obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length === obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length
            }
          )} style={{
            width: `${ obj.states.filter(collectible => !enumerateCollectibleState(collectible).notAcquired).length / obj.states.filter(collectible => !enumerateCollectibleState(collectible).invisible).length * 100 }%`
          }}></div>
        </div>
      )
    });

    return (
      <div className="presentation-node collections">
        <div className="sub-header">
          <div>Collections</div>
        </div>
        <div className="node badge">
          <div className="children">
            <div className="icon">
              <ObservedImage className={cx(
                    "image"
                  )}
                src={ `https://www.bungie.net${ badgeDefinition.displayProperties.icon }` } />
            </div>
            <div className="text">
              <div className="name">{ badgeDefinition.displayProperties.name }</div>
              <div className="description">{ badgeDefinition.displayProperties.description }</div>
            </div>
            <div className="until">
              {completed ? <h4 className="completed">Badge completed</h4> : <h4>Badge progress</h4>}
              {progress}
            </div>
          </div>
          <div className="records">
            {badgeChildren}
          </div>
        </div>
      </div>
    )

  }

}

export default BadgeNode;