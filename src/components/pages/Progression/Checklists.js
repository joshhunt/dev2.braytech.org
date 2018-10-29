import React from 'react';
import cx from 'classnames'

import './Checklists.css'

const regionChests = (props) => {

  let characterProgressions = props.data.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.data.ProfileResponse.profileProgression.data;
  let characterId = props.data.activeCharacterId;

  let manifest = JSON.parse(localStorage.getItem("manifest")).response.data

  console.log(manifest)

  let list = []

  Object.entries(characterProgressions[characterId].checklists[1697465175]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let item = false;
    Object.entries(manifest.DestinyChecklistDefinition[1697465175].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[1697465175].entries[pear].checklistHash === hash) {
        item = manifest.DestinyChecklistDefinition[1697465175].entries[pear];
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

    let regionchest = false;
    Object.keys(destination.bubbles).forEach(subKey => {
      if (destination.bubbles[subKey].hash === item.bubbleHash) {
        regionchest = destination.bubbles[subKey];
        return;
      }
    });
    
    list.push(
      <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-name={ place.displayProperties.name }>
        <div className={cx(
            "state",
            {
              "completed": completed
            }
          )}></div>
        <div className="text">
          <p>{ regionchest ? regionchest.displayProperties.name : `???` }</p>
          <p>{ place.displayProperties.name }</p>
        </div>
      </li>
    )
  });

  return (
    <ul className="list no-interaction">
      {list}
    </ul>
  )

}

const Checklists = (props) => {
  
  /*
    checklists  
      region chests
      lost sectors
      adventures
      sleeper nodes
      ghost scans
      latent memories
      caydes journals
  */

  let list
  
  console.log(props)

  switch(props.list) {
    case "regionchests":
      list = regionChests(props)
      break;
    default:

  }

  return (
    <div className="checklists">
      {list}
    </div>
  )
}

export default Checklists;