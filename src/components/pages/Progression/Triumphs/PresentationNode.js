import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

import './Triumphs.css';

class PresentationNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

  }
  

  render() {
    
    let characterProgressions = this.props.state.ProfileResponse.characterProgressions.data;
    let profileProgressions = this.props.state.ProfileResponse.profileProgression.data;
    let characterRecords = this.props.state.ProfileResponse.characterRecords.data;
    let profileRecords = this.props.state.ProfileResponse.profileRecords.data.records;
    let characterId = this.props.route.match.params.characterId;
  
    let manifest = this.props.manifest;

    const sealBars = {
      2588182977: {
        text: "Wayfarer",
        nodeHash: 2588182977,
        recordHash: 2757681677,
        total: profileRecords[2757681677].objectives[0].completionValue,
        completed: profileRecords[2757681677].objectives[0].progress
      },
      3481101973: {
        text: "Dredgen",
        nodeHash: 3481101973,
        recordHash: 3798931976,
        total: profileRecords[3798931976].objectives[0].completionValue,
        completed: profileRecords[3798931976].objectives[0].progress
      },
      147928983: {
        text: "Unbroken",
        nodeHash: 147928983,
        recordHash: 3369119720,
        total: profileRecords[3369119720].objectives[0].completionValue,
        completed: profileRecords[3369119720].objectives[0].progress
      },
      2693736750: {
        text: "Chronicler",
        nodeHash: 2693736750,
        recordHash: 1754983323,
        total: profileRecords[1754983323].objectives[0].completionValue,
        completed: profileRecords[1754983323].objectives[0].progress
      },
      2516503814: {
        text: "Cursebreaker",
        nodeHash: 2516503814,
        recordHash: 1693645129,
        total: profileRecords[1693645129].objectives[0].completionValue,
        completed: profileRecords[1693645129].objectives[0].progress
      },
      1162218545: {
        text: "Rivensbane",
        nodeHash: 1162218545,
        recordHash: 2182090828,
        total: profileRecords[2182090828].objectives[0].completionValue,
        completed: profileRecords[2182090828].objectives[0].progress
      }
    }
    
    let primaryHash = this.props.route.match.params.primary ? this.props.route.match.params.primary : false; // crucible
    
    if (!primaryHash) {

      let parent = manifest.DestinyPresentationNodeDefinition[1024788583];
      let sealsParent = manifest.DestinyPresentationNodeDefinition[1652422747];

      let nodes = [];
      let sealNodes = [];

      parent.children.presentationNodes.forEach(child => {

        let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
        let states = [];

        node.children.presentationNodes.forEach(nodeChild => {
          let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];
          nodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
            let nodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];
            nodeChildNodeChildNode.children.records.forEach(record => {
              states.push(profileRecords[record.hash] ? profileRecords[record.hash].state : characterRecords[this.props.route.match.params.characterId].records[record.hash].state);
            });
          });
        });

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
            <div className="state">{states.filter(record => enumerateRecordState(record).recordRedeemed).length}/{states.filter(record => !enumerateRecordState(record).invisible).length}</div>
          </div>
        )
        
      });

      sealsParent.children.presentationNodes.forEach(child => {

        let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
        let states = [];

        node.children.records.forEach(record => {
          states.push(profileRecords[record.hash] ? profileRecords[record.hash].state : characterRecords[this.props.route.match.params.characterId].records[record.hash].state);
        });

        sealNodes.push(
          <div key={ node.hash } className="node">
            <Link to={ `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/triumphs/seal/${node.hash}` }>
              <ObservedImage className={cx(
                    "image",
                    "icon"
                  )}
                src={ `https://www.bungie.net${ node.originalIcon }` } />
                { node.displayProperties.name }
            </Link>
            <div className="state">{sealBars[node.hash].completed}/{sealBars[node.hash].total}</div>
          </div>
        )
        
      });

      return (
        <>
          <div className="node">
            <div className="parent">
              { nodes }
            </div>
          </div>
          <div className="node">
            <h4>Seals</h4>
            <div className="parent seals">
              { sealNodes }
            </div>
          </div>
        </>
      )
    }
    else if (primaryHash === "seal") {
      
      let sealDefinition = manifest.DestinyPresentationNodeDefinition[this.props.route.match.params.secondary];
  
      let sealChildren = [];
      sealDefinition.children.records.forEach(child => {
    
        let recordDefinition = child;
    
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
        
        sealChildren.push(
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
        <div className="node seal">
          <div className="children">
            <div className="icon">
              <div className="corners t"></div>
              <ObservedImage className={cx(
                    "image"
                  )}
                src={ `https://www.bungie.net${ sealDefinition.displayProperties.icon }` } />
              <div className="corners b"></div>
            </div>
            <div className="text">
              <div className="name">{ sealDefinition.displayProperties.name }</div>
              <div className="description">{ sealDefinition.displayProperties.description }</div>
            </div>
            <div className="until">
              <h4>Seal progress</h4>
              <div className="progress">
                <div className="title">{sealBars[sealDefinition.hash].text}</div>
                <div className="fraction">{sealBars[sealDefinition.hash].completed}/{sealBars[sealDefinition.hash].total}</div>
                <div className="bar" style={{
                  width: `${ sealBars[sealDefinition.hash].completed / sealBars[sealDefinition.hash].total * 100 }%`,
                  backgroundColor: sealBars[sealDefinition.hash].color ? sealBars[sealDefinition.hash].color : ``
                }}></div>
              </div>
            </div>
          </div>
          <div className="records">
            <ul className="list no-interaction tertiary">
              {sealChildren}
            </ul>
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
          else if (characterRecords[this.props.route.match.params.characterId].records[child.hash]) {

            let playerProgress = null;
            characterRecords[this.props.route.match.params.characterId].records[child.hash].objectives.forEach(objective => {
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

        let state;
        if (profileRecords[child.hash]) {
          state = profileRecords[child.hash] ? profileRecords[child.hash].state : 0;
        }
        else if (characterRecords[this.props.route.match.params.characterId].records[child.hash]) {
          state = characterRecords[this.props.route.match.params.characterId].records[child.hash] ? characterRecords[this.props.route.match.params.characterId].records[child.hash].state : 0;
        }
        else {
          state = 0;
        }

        if (enumerateRecordState(state).invisible) {
          return;
        }
        
        tertiaryChildren.push(
          <li key={recordDefinition.hash} className={cx(
                {
                  "completed": enumerateRecordState(state).recordRedeemed
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

export default PresentationNode;