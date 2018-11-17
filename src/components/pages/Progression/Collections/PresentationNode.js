import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import Collectibles from './Collectibles';

class PresentationNode extends React.Component {
  
  render() {

    let primaryHash = this.props.primaryHash;
    
    let manifest = this.props.manifest;

    let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];
      
    let secondaryHash = this.props.route.match.params.secondary ? this.props.route.match.params.secondary : primaryDefinition.children.presentationNodes[0].presentationNodeHash;
    let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];
  
    let tertiaryHash = this.props.route.match.params.tertiary ? this.props.route.match.params.tertiary : secondaryDefinition.children.presentationNodes[0].presentationNodeHash;
    
    let primaryChildren = [];
    primaryDefinition.children.presentationNodes.forEach(child => {
  
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      let isActive = (match, location) => {
        if (this.props.route.match.params.secondary === undefined && primaryDefinition.children.presentationNodes.indexOf(child) === 0) {
          return true
        }
        else if (match) {
          return true
        }
        else {
          return false
        }
      }
  
      primaryChildren.push(
        <li key={node.hash}>
          <NavLink isActive={isActive} to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/collections/${primaryHash}/${node.hash}` }>
            <ObservedImage className={cx(
                  "image",
                  "icon"
                )}
              src={ `https://www.bungie.net${ node.displayProperties.icon }` } />
          </NavLink>
        </li>
      )
    });
  
    let secondaryChildren = [];
    secondaryDefinition.children.presentationNodes.forEach(child => {
  
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      let isActive = (match, location) => {
        if (this.props.route.match.params.tertiary === undefined && secondaryDefinition.children.presentationNodes.indexOf(child) === 0) {
          return true
        }
        else if (match) {
          return true
        }
        else {
          return false
        }
      }
      
      secondaryChildren.push(
        <li key={node.hash}>
          <NavLink isActive={isActive} to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/collections/${primaryHash}/${secondaryHash}/${node.hash}` }>{node.displayProperties.name}</NavLink>
        </li>
      )
    });

    return (
      <div className="node">
        <div className="header">
          <div className="name">{primaryDefinition.displayProperties.name} <span>{secondaryDefinition.displayProperties.name}</span></div>
        </div>
        <div className="children">
          <ul className="list primary">
            {primaryChildren}
          </ul>
          <ul className="list secondary">
            {secondaryChildren}
          </ul>
        </div>
        <div className="collectibles">
          <ul className="list tertiary">
            <Collectibles {...this.props} tertiaryHash={tertiaryHash} />
          </ul>
        </div>
      </div>
    )

  }

}

export default PresentationNode;