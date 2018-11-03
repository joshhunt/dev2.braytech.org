import React from 'react';
import cx from 'classnames';

import './Almost.css';

const Almost = (props) => {

  let profileRecords = props.records;
  let manifest = props.manifest;

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
    if (distance > 0.81 && distance < 1.00) {
      mark = true;
    }


    let objectives = [];

    if (mark) {

      record.objectives.forEach(obj => {

        let objDef = manifest.DestinyObjectiveDefinition[obj.objectiveHash];

        objectives.push(
          <li key={objDef.hash}>
            <div className="progress">
              <div className="title">{objDef.progressDescription}</div>
              <div className="fraction">{obj.progress}/{obj.completionValue}</div>
              <div className="bar" style={{
                width: `${ obj.progress / obj.completionValue * 100 }%`
              }}></div>
            </div>
          </li>
        )
  
      });

      // console.log(key, record, manifest.DestinyRecordDefinition[key]);

      almost.push(
        {
          distance: distance,
          item: <li key={key}>
            <p>{manifest.DestinyRecordDefinition[key].displayProperties.name} <span>{key}</span></p>
            <p>{manifest.DestinyRecordDefinition[key].displayProperties.description}</p>
            <ul className="list no-interaction">
              {objectives}
            </ul>
          </li>
        }
      )

    }

  });

  almost.sort(function(b, a) {
    let distanceA = a.distance;
    let distanceB = b.distance;
    return (distanceA < distanceB) ? -1 : (distanceA > distanceB) ? 1 : 0;
  });

  return almost.map((value, index) => {
    return value.item
  })

}

export default Almost;