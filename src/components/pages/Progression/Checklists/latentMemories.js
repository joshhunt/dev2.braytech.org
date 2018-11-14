import React from 'react';
import cx from 'classnames'

const latentMemories = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest;

  let list = []

  Object.entries(profileProgressions.checklists[2955980198]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let item = false;
    Object.entries(manifest.DestinyChecklistDefinition[2955980198].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[2955980198].entries[pear].checklistHash === hash) {
        item = manifest.DestinyChecklistDefinition[2955980198].entries[pear];
        return;
      }
    });

    let number = item.displayProperties.name.match(/([0-9]+)/)[0];
    
    list.push(
      <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-sort={ number }>
        <div className={cx(
            "state",
            {
              "completed": completed
            }
          )}></div>
        <div className="text">
          <p>{ item.displayProperties.name }</p>
        </div>
      </li>
    )
  });

  list.sort(function(a, b) {
    let intA = a.props['data-sort'];
    let intB = b.props['data-sort'];
    return intA - intB;
  });

  return (
    <>
      <div className="head">
        <h4>Latent Memory Fragments</h4>
        <div className="binding">
          <p>Profile bound</p>
        </div>
        <div className="progress">
          <div className="title">Memories shot</div>
          <div className="fraction">{Object.values(profileProgressions.checklists[2955980198]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[2955980198]).length}</div>
          <div className="bar" style={{
            width: `${ Object.values(profileProgressions.checklists[2955980198]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[2955980198]).length * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list}
      </ul>
    </>
  )

}

export default latentMemories;