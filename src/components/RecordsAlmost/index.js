import React from 'react';
import cx from 'classnames';

import Records from '../Records';
import { enumerateRecordState } from '../../utils/destinyEnums';

class RecordsAlmost extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToRecordRef = React.createRef();
  }

  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const characterRecords = this.props.response.profile.characterRecords.data;
    const profileRecords = this.props.response.profile.profileRecords.data.records;

    let almost = [];
    let ignores = [];

    // ignore collections badges
    manifest.DestinyPresentationNodeDefinition[498211331].children.presentationNodes.forEach(child => {
      ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
      manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].children.presentationNodes.forEach(subchild => {
        ignores.push(manifest.DestinyPresentationNodeDefinition[subchild.presentationNodeHash].completionRecordHash);
      });
    });

    // ignore triumph seals
    manifest.DestinyPresentationNodeDefinition[1652422747].children.presentationNodes.forEach(child => {
      ignores.push(manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash].completionRecordHash);
    });

    Object.entries(profileRecords).forEach(([key, record]) => {
      // ignore collections badges etc
      if (ignores.includes(parseInt(key, 10))) {
        return;
      }

      if (enumerateRecordState(record.state).invisible) {
        return;
      }

      let completionValueTotal = 0;
      let progressValueTotal = 0;

      record.objectives.forEach(obj => {
        let v = parseInt(obj.completionValue, 10);
        let p = parseInt(obj.progress, 10);

        completionValueTotal = completionValueTotal + v;
        progressValueTotal = progressValueTotal + (p > v ? v : p); // prevents progress values that are greater than the completion value from affecting the average
      });

      var mark = false;

      let distance = progressValueTotal / completionValueTotal;
      if (distance > 0.81 && distance < 1.0) {
        mark = true;
      }

      let objectives = [];

      if (mark) {
        record.objectives.forEach(obj => {
          let objDef = manifest.DestinyObjectiveDefinition[obj.objectiveHash];

          objectives.push(
            <li key={objDef.hash}>
              <div
                className={cx('progress', {
                  complete: obj.progress >= obj.completionValue ? true : false
                })}
              >
                <div className='title'>{objDef.progressDescription}</div>
                <div className='fraction'>
                  {obj.progress}/{obj.completionValue}
                </div>
                <div
                  className='bar'
                  style={{
                    width: `${(obj.progress / obj.completionValue) * 100}%`
                  }}
                />
              </div>
            </li>
          );
        });

        almost.push({
          distance: distance,
          item: <Records selfLink key={key} {...this.props} hashes={[key]} />
        });
      }
    });

    almost.sort(function(b, a) {
      let distanceA = a.distance;
      let distanceB = b.distance;
      return distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;
    });

    almost = this.props.limit ? almost.slice(0,3) : almost;

    return (
      <ul className={cx('list record-items almost')}>
        {almost.map((value, index) => {
          return value.item;
        })}
      </ul>
    );
  }
}

export default RecordsAlmost;
