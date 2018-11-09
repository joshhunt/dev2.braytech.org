import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

import './Triumphs.css';

class TriumphsChildren extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

  }
  

  render() {

    let characterProgressions = this.props.state.ProfileResponse.characterProgressions.data;
    let profileProgressions = this.props.state.ProfileResponse.profileProgression.data;
    let profileRecords = this.props.state.ProfileResponse.profileRecords.data.records;
    let characterId = this.props.route.match.params.characterId;
  
    let manifest = this.props.manifest.response.data;
    
    let primaryHash = this.props.route.match.params.primary ? this.props.route.match.params.primary : false; // crucible
    
    if (!primaryHash) {

      let parent = manifest.DestinyPresentationNodeDefinition[1024788583];

      let nodes = [];

      parent.children.presentationNodes.forEach(child => {

        let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

        nodes.push(
          <div key={ node.hash } className="node">
            <Link to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/triumphs/${node.hash}` }>
              <ObservedImage className={cx(
                    "image",
                    "icon"
                  )}
                src={ `https://www.bungie.net${ node.originalIcon }` } />
                { node.displayProperties.name }
            </Link>
          </div>
        )
        
      });

      return (
        <div className="node">
          <div className="parent">
            { nodes }
          </div>
        </div>
      )
    }
    else {    
    
      let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];
      
      let secondaryHash = this.props.route.match.params.secondary ? this.props.route.match.params.secondary : primaryDefinition.children.presentationNodes[0].presentationNodeHash; // crucible -> lifetime
      let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];
    
      let tertiaryHash = this.props.route.match.params.tertiary ? this.props.route.match.params.tertiary : secondaryDefinition.children.presentationNodes[0].presentationNodeHash; // crucible -> lifetime -> combat record
      let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[tertiaryHash];
      
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
            <NavLink isActive={isActive} to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/triumphs/${primaryHash}/${node.hash}` }>
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
            <NavLink isActive={isActive} to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/triumphs/${primaryHash}/${secondaryHash}/${node.hash}` }>{node.displayProperties.name}</NavLink>
          </li>
        )
      });
    
      let tertiaryChildren = [];
      tertiaryDefinition.children.records.forEach(child => {
    
        let recordDefinition = child;

        console.log(profileRecords[child.hash])

        let objectives = [];
        child.objectiveHashes.forEach(hash => {

          let objectiveDefinition = manifest.DestinyObjectiveDefinition[hash];
          
          if (profileRecords[child.hash]) {

            let playerProgress = null;
            profileRecords[child.hash].objectives.forEach(objective => {
              if (objective.objectiveHash === hash) {
                playerProgress = objective;
              }
            });

            objectives.push(
              <div key={objectiveDefinition.hash} className="progress">
                <div className="title">{ objectiveDefinition.progressDescription }</div>
                <div className="fraction">{ playerProgress.progress }/{ playerProgress.completionValue }</div>
                <div className="bar" style={{width: `${ playerProgress.progress / playerProgress.completionValue * 100}%`}}></div>
              </div>
            )

          }
          else {
            objectives.push(
              null
            )
          }
        });
        
        tertiaryChildren.push(
          <li key={recordDefinition.hash} className={cx(
                {
                  "completed": profileRecords[child.hash] ? enumerateRecordState(profileRecords[child.hash].state).recordRedeemed : false
                }
              )}>
            <div className="icon">  
              <ObservedImage className={cx(
                    "image",
                    "icon"
                  )}
                src={ `https://www.bungie.net${ recordDefinition.displayProperties.icon }` } />
            </div>
            <div className="text">
              <div className="name">{ recordDefinition.displayProperties.name }</div>
              <div className="description">{ recordDefinition.displayProperties.description }</div>
            </div>
            <div className="objectives">
              {objectives}
            </div>
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
          <div className="records">
            <ul className="list no-interaction tertiary">
              {tertiaryChildren}
            </ul>
          </div>
        </div>
      )
    }

  }
}

export default TriumphsChildren;