import React from 'react';
import cx from 'classnames';
import orderBy from 'lodash/orderBy';

const adventures = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;

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

    list.push({
      completed: completed ? 1 : 0,
      place: place.displayProperties.name,
      place2: adventure.displayProperties.name,
      name: item.activityDef.displayProperties.name,
      element: <li key={item.hash}>
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
      })

  });

  list = orderBy(list, [item => item.completed, item => item.place, item => item.place2, item => item.name], ['asc', 'asc', 'asc', 'asc']);

  return (
    <>
      <div className="head">
        <h4>Adventures</h4>
        <div className="binding">
          <p>Character bound</p>
        </div>
        <div className="progress">
          <div className="title">Adventures undertaken</div>
          <div className="fraction">{Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length}/{Object.keys(characterProgressions[characterId].checklists[4178338182]).length}</div>
          <div className="bar" style={{
            width: `${ Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length / Object.keys(characterProgressions[characterId].checklists[4178338182]).length * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list.map(obj => obj.element)}
      </ul>
    </>
  )

}

export default adventures;