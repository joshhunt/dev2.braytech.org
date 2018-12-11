import React from 'react';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import cx from 'classnames';

import ObservedImage from '../ObservedImage';

import { enumerateRecordState } from '../../utils/destinyEnums';

import './styles.css';

class Records extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.highlight && this.scrollToRecordRef.current !== null) {
      window.scrollTo({
        top: this.scrollToRecordRef.current.offsetTop + this.scrollToRecordRef.current.offsetHeight / 2 - window.innerHeight / 2
      });
    }
  }

  render() {
    const manifest = this.props.manifest;

    const characterRecords = this.props.response.profile.characterRecords.data;
    const profileRecords = this.props.response.profile.profileRecords.data.records;
    const characterId = this.props.characterId;

    const highlight = this.props.highlight;

    let records = [];

    if (this.props.node) {
      let tertiaryDefinition = manifest.DestinyPresentationNodeDefinition[this.props.node];

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
        let ref = highlight == recordDefinition.hash ? this.scrollToRecordRef : null;

        if (recordDefinition.redacted) {
          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={ref}
                className={cx('redacted', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>Classified record</div>
                    <div className='description'>This record is classified and may be revealed at a later time.</div>
                  </div>
                </div>
              </li>
            )
          });
        } else {
          let description = recordDefinition.displayProperties.description !== '' ? recordDefinition.displayProperties.description : false;
          description = !description && recordDefinition.loreHash ? manifest.DestinyLoreDefinition[recordDefinition.loreHash].displayProperties.description.slice(0, 32) + '...' : description;

          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={ref}
                className={cx({
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash,
                  completed: enumerateRecordState(state).recordRedeemed,
                  'no-description': !description
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{recordDefinition.displayProperties.name}</div>
                    {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
                <div className='objectives'>{objectives}</div>
              </li>
            )
          });
        }
      });
    } else {
      let recordsRequested = this.props.hashes;
      recordsRequested.forEach(hash => {
        const recordDefinition = manifest.DestinyRecordDefinition[hash];

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

          link = `/triumphs/${reverse3.hash}/${reverse2.hash}/${reverse1.hash}/${hash}`;
        } catch (e) {
          console.log(e);
        }

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
        let ref = highlight == recordDefinition.hash ? this.scrollToRecordRef : null;

        if (recordDefinition.redacted) {
          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={ref}
                className={cx('redacted', {
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>Classified record</div>
                    <div className='description'>This record is classified and may be revealed at a later time.</div>
                  </div>
                </div>
              </li>
            )
          });
        } else {
          let description = recordDefinition.displayProperties.description !== '' ? recordDefinition.displayProperties.description : false;
          description = !description && recordDefinition.loreHash ? manifest.DestinyLoreDefinition[recordDefinition.loreHash].displayProperties.description.slice(0, 32) + '...' : description;

          records.push({
            completed: enumerateRecordState(state).recordRedeemed,
            hash: recordDefinition.hash,
            element: (
              <li
                key={recordDefinition.hash}
                ref={ref}
                className={cx({
                  linked: link && this.props.selfLink,
                  // eslint-disable-next-line eqeqeq
                  highlight: highlight && highlight == recordDefinition.hash,
                  completed: enumerateRecordState(state).recordRedeemed,
                  'no-description': !description
                })}
              >
                <div className='properties'>
                  <div className='icon'>
                    <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${recordDefinition.displayProperties.icon}`} />
                  </div>
                  <div className='text'>
                    <div className='name'>{recordDefinition.displayProperties.name}</div>
                    {recordDefinition.completionInfo.ScoreValue && recordDefinition.completionInfo.ScoreValue !== 0 ? <div className='score'>{recordDefinition.completionInfo.ScoreValue}</div> : null}
                    <div className='description'>{description}</div>
                  </div>
                </div>
                <div className='objectives'>{objectives}</div>
                {link && this.props.selfLink ? <Link to={link} /> : null}
              </li>
            )
          });
        }
      });
    }

    if (records.length === 0 && this.props.hideCompleted) {
      records.push(
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

    records = this.props.ordered ? orderBy(records, [item => item.completed], ['asc']) : records;

    return records.map(obj => obj.element);
  }
}

export default Records;
