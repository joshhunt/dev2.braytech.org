import React from 'react';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

class Records extends React.Component {
  render() {
    let manifest = this.props.manifest;

    let characterRecords = this.props.state.response.profile.characterRecords.data;
    let profileRecords = this.props.state.response.profile.profileRecords.data.records;
    let characterId = this.props.route.match.params.characterId;

    let recordsRequested = this.props.hashes;

    let records = [];
    recordsRequested.forEach(hash => {
      let recordDefinition = manifest.DestinyRecordDefinition[hash];

      let objectives = [];
      let link = false;

      // selfLink

      try {
        let reverse1;
        let reverse2;
        let reverse3;

        manifest.DestinyRecordDefinition[hash].presentationInfo.parentPresentationNodeHashes.forEach(element => {
          if (manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.filter(el => el.presentationNodeHash === element).length > 0) {
            return; // if hash is a child of seals, skip it
          }
          if (reverse1) {
            return;
          }
          reverse1 = manifest.DestinyPresentationNodeDefinition[element];
        });

        let iteratees = reverse1.presentationInfo ? reverse1.presentationInfo.parentPresentationNodeHashes : reverse1.parentNodeHashes;
        iteratees.forEach(element => {
          if (reverse2) {
            return;
          }
          reverse2 = manifest.DestinyPresentationNodeDefinition[element];
        });

        if (reverse2 && reverse2.parentNodeHashes) {
          reverse3 = manifest.DestinyPresentationNodeDefinition[reverse2.parentNodeHashes[0]];
        }

        link = `/progression/${this.props.route.match.params.membershipType}/${this.props.route.match.params.membershipId}/${this.props.route.match.params.characterId}/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
      } catch (e) {
        console.log(e);
      }

      //

      recordDefinition.objectiveHashes.forEach(hash => {
        let objectiveDefinition = manifest.DestinyObjectiveDefinition[hash];

        if (profileRecords[recordDefinition.hash]) {
          let playerProgress = null;
          profileRecords[recordDefinition.hash].objectives.forEach(objective => {
            if (objective.objectiveHash === hash) {
              playerProgress = objective;
            }
          });

          objectives.push(
            <div key={objectiveDefinition.hash} className='progress'>
              <div className='title'>{objectiveDefinition.progressDescription}</div>
              <div className='fraction'>
                {playerProgress.progress}/{playerProgress.completionValue}
              </div>
              <div className='bar' style={{ width: `${(playerProgress.progress / playerProgress.completionValue) * 100}%` }} />
            </div>
          );
        } else if (characterRecords[characterId].records[recordDefinition.hash]) {
          let playerProgress = null;
          characterRecords[characterId].records[recordDefinition.hash].objectives.forEach(objective => {
            if (objective.objectiveHash === hash) {
              playerProgress = objective;
            }
          });

          objectives.push(
            <div key={objectiveDefinition.hash} className='progress'>
              <div className='title'>{objectiveDefinition.progressDescription}</div>
              <div className='fraction'>
                {playerProgress.progress}/{playerProgress.completionValue}
              </div>
              <div className='bar' style={{ width: `${(playerProgress.progress / playerProgress.completionValue) * 100}%` }} />
            </div>
          );
        } else {
          objectives.push(null);
        }
      });

      let state;
      if (profileRecords[recordDefinition.hash]) {
        state = profileRecords[recordDefinition.hash] ? profileRecords[recordDefinition.hash].state : 0;
      } else if (characterRecords[characterId].records[recordDefinition.hash]) {
        state = characterRecords[characterId].records[recordDefinition.hash] ? characterRecords[characterId].records[recordDefinition.hash].state : 0;
      } else {
        state = 0;
      }

      if (enumerateRecordState(state).invisible) {
        return;
      }

      records.push({
        completed: enumerateRecordState(state).recordRedeemed,
        hash: recordDefinition.hash,
        element: (
          <li
            key={recordDefinition.hash}
            className={cx({
              completed: enumerateRecordState(state).recordRedeemed,
              'no-description': recordDefinition.displayProperties.description === ''
            })}
          >
            <div className='properties'>
              <div className='icon'>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
              </div>
              <div className='text'>
                <div className='name'>{recordDefinition.displayProperties.name}</div>
                {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                <div className='description'>{recordDefinition.displayProperties.description}</div>
              </div>
            </div>
            <div className='objectives'>{objectives}</div>
            {link && this.props.selfLink ? <Link to={link} /> : null}
          </li>
        )
      });
    });

    records = this.props.ordered ? orderBy(records, [item => item.completed], ['asc']) : records;

    return records.map(obj => obj.element);
  }
}

export default Records;
