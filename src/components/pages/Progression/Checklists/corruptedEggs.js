import React from 'react';
import cx from 'classnames';

const corruptedEggs = props => {
  let profileProgressions = props.state.response.profile.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[2609997025]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let checklist = false;
    Object.entries(manifest.DestinyChecklistDefinition[2609997025].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[2609997025].entries[pear].hash === hash) {
        checklist = manifest.DestinyChecklistDefinition[2609997025].entries[pear];
        return;
      }
    });

    let number = checklist.displayProperties.name.match(/([0-9]+)/)[0];

    list.push(
      <li key={checklist.hash} data-state={completed ? `complete` : `incomplete`} data-sort={number}>
        <div
          className={cx('state', {
            completed: completed
          })}
        />
        <div className='text'>
          <p>Egg {number}</p>
        </div>
      </li>
    );
  });

  list.sort(function(a, b) {
    let intA = a.props['data-sort'];
    let intB = b.props['data-sort'];
    return intA - intB;
  });

  return (
    <>
      <div className='head'>
        <h4>Corrupted Eggs</h4>
        <div className='binding'>
          <p>Profile bound</p>
        </div>
        <div className='progress'>
          <div className='title'>Eggs destroyed</div>
          <div className='fraction'>
            {Object.values(profileProgressions.checklists[2609997025]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[2609997025]).length}
          </div>
          <div
            className='bar'
            style={{
              width: `${(Object.values(profileProgressions.checklists[2609997025]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[2609997025]).length) * 100}%`
            }}
          />
        </div>
      </div>
      <ul className='list no-interaction'>{list}</ul>
    </>
  );
};

export default corruptedEggs;
