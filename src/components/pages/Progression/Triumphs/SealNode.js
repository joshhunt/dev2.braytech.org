import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

import '../RecordItems.css';

class SealNode extends React.Component {
  
  render() {

    let manifest = this.props.manifest;

    let characterProgressions = this.props.state.ProfileResponse.characterProgressions.data;
    let profileProgressions = this.props.state.ProfileResponse.profileProgression.data;
    let characterRecords = this.props.state.ProfileResponse.characterRecords.data;
    let profileRecords = this.props.state.ProfileResponse.profileRecords.data.records;
    let characterId = this.props.route.match.params.characterId;

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

    let sealDefinition = manifest.DestinyPresentationNodeDefinition[this.props.route.match.params.secondary];
  
    let sealChildren = [];
    sealDefinition.children.records.forEach(child => {
  
      let recordDefinition = child;

      console.log(child)
  
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
      <div className="presentation-node triumphs">
        <div className="sub-header">
          <div>Triumphs</div>
        </div>
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
            <ul className="list no-interaction tertiary record-items">
              {sealChildren}
            </ul>
          </div>
        </div>
      </div>
    )

  }

}

export default SealNode;