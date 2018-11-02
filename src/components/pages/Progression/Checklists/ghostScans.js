import React from 'react';
import cx from 'classnames'

const ghostScans = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let characterId = props.state.activeCharacterId;

  let manifest = props.manifest.response.data

  let list = []

  Object.entries(profileProgressions.checklists[2360931290]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let item = false;
    Object.entries(manifest.DestinyChecklistDefinition[2360931290].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[2360931290].entries[pear].checklistHash === hash) {
        item = manifest.DestinyChecklistDefinition[2360931290].entries[pear];
        return;
      }
    });

    let destination = false;
    Object.keys(manifest.DestinyDestinationDefinition).forEach(subKey => {
      if (manifest.DestinyDestinationDefinition[subKey].hash === item.destinationHash) {
        destination = manifest.DestinyDestinationDefinition[subKey];
        return;
      }
    });

    let place = false;
    Object.keys(manifest.DestinyPlaceDefinition).forEach(subKey => {
      if (manifest.DestinyPlaceDefinition[subKey].hash === destination.placeHash) {
        place = manifest.DestinyPlaceDefinition[subKey];
        return;
      }
    });

    let scan = false;
    Object.keys(destination.bubbles).forEach(subKey => {
      if (destination.bubbles[subKey].hash === item.bubbleHash) {
        scan = destination.bubbles[subKey];
        return;
      }
    });
    
    list.push(
      <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-sort={ scan ? scan.displayProperties.name : `???` }>
        <div className={cx(
            "state",
            {
              "completed": completed
            }
          )}></div>
        <div className="text">
          <p>{ scan ? scan.displayProperties.name : `???` }</p>
          <p>{ place.displayProperties.name }</p>
        </div>
      </li>
    )
  });

  list.sort(function(a, b) {
    let textA = a.props['data-sort'].toUpperCase();
    let textB = b.props['data-sort'].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  return (
    <>
      <div className="head">
        <h4>Ghost scans</h4>
        <div className="progress">
          <div className="title">Ghost scans performed</div>
          <div className="fraction">{Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[2360931290]).length}</div>
          <div className="bar" style={{
            width: `${ Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[2360931290]).length * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list}
      </ul>
    </>
  )

}

export default ghostScans;