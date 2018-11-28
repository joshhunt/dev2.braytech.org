import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

class Records extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.quaternaryHash && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    let manifest = this.props.manifest;

    let characterRecords = this.props.state.ProfileResponse.characterRecords.data;
    let profileRecords = this.props.state.ProfileResponse.profileRecords.data.records;
    let characterId = this.props.route.match.params.characterId;

    let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.tertiaryHash];

    let highlightHash = this.props.quaternaryHash;

    let tertiaryChildren = [];
    tertiaryDefinition.children.records.forEach(child => {
      let recordDefinition = manifest.DestinyRecordDefinition[child.recordHash];

      let objectives = [];
      if (recordDefinition.objectiveHashes) {
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
      }

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

      if (enumerateRecordState(state).recordRedeemed && this.props.hideCompleted) {
        return;
      }

      // eslint-disable-next-line eqeqeq
      let ref = highlightHash == recordDefinition.hash ? this.scrollToRecordRef : null;

      if (recordDefinition.redacted) {
        tertiaryChildren.push(
          <li
            key={recordDefinition.hash}
            ref={ref}
            className={cx('redacted', {
              // eslint-disable-next-line eqeqeq
              highlight: highlightHash && highlightHash == recordDefinition.hash
            })}
          >
            <div className='properties'>
              <div className='icon'>
                <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
              </div>
              <div className='text'>
                <div className='name'>Encrypted record</div>
                <div className='description'>This record is encrypted and may be revealed at a later time.</div>
              </div>
            </div>
          </li>
        );
      } else {
        tertiaryChildren.push(
          <li
            key={recordDefinition.hash}
            ref={ref}
            className={cx({
              completed: enumerateRecordState(state).recordRedeemed,
              // eslint-disable-next-line eqeqeq
              highlight: highlightHash && highlightHash == recordDefinition.hash,
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
          </li>
        );
      }
    });

    if (tertiaryChildren.length === 0 && this.props.hideCompleted) {
      tertiaryChildren.push(
        <li key='lol'>
          <div className='properties'>
            <div className='icon' />
            <div className='text'>
              <div className='name'>Nothing to show for your effort</div>
              <div className='description'>You've completed all the records here! GG</div>
            </div>
          </div>
        </li>
      );
    }

    return tertiaryChildren;
  }
}

export default Records;
