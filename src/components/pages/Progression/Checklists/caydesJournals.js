import React from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';

const caydesJournals = (props) => {

  let characterProgressions = props.state.ProfileResponse.characterProgressions.data;
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;
  let characterId = props.route.match.params.characterId;

  let manifest = props.manifest.response.data

  let list = []

  Object.entries(profileProgressions.checklists[2448912219]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    var actual = [78905203, 1394016600, 1399126202, 4195138678];
    if (actual.includes(hash)) {

      var completed = value;
      var item = false;
      Object.entries(manifest.DestinyChecklistDefinition[2448912219].entries).forEach(([pear, peach]) => {
        if (manifest.DestinyChecklistDefinition[2448912219].entries[pear].checklistHash === hash) {
          item = manifest.DestinyChecklistDefinition[2448912219].entries[pear];
          return;
        }
      });

      list.push(
        <li key={item.hash} data-state={ completed ? `complete` : `incomplete` } data-sort={ item.hash }>
          <div className={cx(
              "state",
              {
                "completed": completed
              }
            )}></div>
          <ReactMarkdown className="text" source={item.displayProperties.description} />
        </li>
      )
      
    }

  });

  list.sort(function(a, b) {
    let textA = a.props['data-sort'];
    let textB = b.props['data-sort'];
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  });

  return (
    <>
      <div className="head">
        <h4>Cayde's Journals</h4>
        <div className="binding">
          <p>Profile bound</p>
        </div>
        <div className="progress">
          <div className="title">Journals recovered</div>
          <div className="fraction">{Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length}/4</div>
          <div className="bar" style={{
            width: `${ Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length / 4 * 100 }%`
          }}></div>
        </div>
      </div>
      <ul className="list no-interaction">
        {list}
      </ul>
    </>
  )

}

export default caydesJournals;