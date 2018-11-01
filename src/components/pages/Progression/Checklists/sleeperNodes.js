import React from 'react';
import cx from 'classnames'

const sleeperNodes = (props) => {

  let characterProgressions = props.data.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.data.ProfileResponse.profileProgression.data;
  let characterId = props.data.activeCharacterId;

  let manifest = JSON.parse(localStorage.getItem("manifest")).response.data

  let list = []

  Object.entries(profileProgressions.checklists[365218222]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let item = false;
    Object.entries(manifest.DestinyChecklistDefinition[365218222].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[365218222].entries[pear].checklistHash === hash) {
        item = manifest.DestinyChecklistDefinition[365218222].entries[pear];
        return;
      }
    });
    
    list.push(
      <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-sort={ item.displayProperties.description.toString().replace("CB.NAV/RUN.()","").match(/.*?(?=\.)/)[0] }>
        <div className={cx(
            "state",
            {
              "completed": completed
            }
          )}></div>
        <div className="text">
          <p>{ item.displayProperties.description.toString().replace("CB.NAV/RUN.()","") }</p>
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
    <div className="col">
      <div className="head">
        <h4>Sleeper nodes</h4>
        <div className="progress">
          <div className="title">Sleeper nodes hacked</div>
          <div className="fraction">{Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[365218222]).length}</div>
          <div className="bar" style={{
            width: `${ Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[365218222]).length * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list}
      </ul>
    </div>
  )

}

export default sleeperNodes;