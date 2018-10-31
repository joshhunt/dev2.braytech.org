import React from 'react';
import cx from 'classnames'

const adventures = (props) => {

  let characterProgressions = props.data.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.data.ProfileResponse.profileProgression.data;
  let characterId = props.data.activeCharacterId;

  let manifest = JSON.parse(localStorage.getItem("manifest")).response.data

  let list = []

  Object.entries(characterProgressions[characterId].checklists[4178338182]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let item = false;
    Object.entries(manifest.DestinyChecklistDefinition[4178338182].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[4178338182].entries[pear].checklistHash === hash) {
        item = manifest.DestinyChecklistDefinition[4178338182].entries[pear];
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

    let adventure = false;
    Object.keys(destination.bubbles).forEach(subKey => {
      if (destination.bubbles[subKey].hash === item.bubbleHash) {
        adventure = destination.bubbles[subKey];
        return;
      }
    });
    
    list.push(
      <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-name={ item.activityDef.displayProperties.name }>
        <div className={cx(
            "state",
            {
              "completed": completed
            }
          )}></div>
        <div className="text">
          <p>{ item.activityDef.displayProperties.name }</p>
          <p>{ adventure.displayProperties.name }, { place.displayProperties.name }</p>
        </div>
      </li>
    )
  });

  return (
    <div className="col">
      <div className="head">
        <h4>Adventures</h4>
        <div className="progress">
          <div className="title">Adventures undertaken</div>
          <div className="fraction">{Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length}/{Object.keys(characterProgressions[characterId].checklists[4178338182]).length}</div>
          <div className="bar" style={{
            width: `${ Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length / Object.keys(characterProgressions[characterId].checklists[4178338182]).length * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list}
      </ul>
    </div>
  )

}

export default adventures;