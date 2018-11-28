import React from 'react';
import cx from 'classnames';

const catStatues = props => {
  let profileProgressions = props.state.ProfileResponse.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[2726513366]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let checklist = false;
    Object.entries(manifest.DestinyChecklistDefinition[2726513366].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[2726513366].entries[pear].hash === hash) {
        checklist = manifest.DestinyChecklistDefinition[2726513366].entries[pear];
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
          <p>Feline friend {number}</p>
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
        <h4>Cat Statues</h4>
        <div className='binding'>
          <p>Profile bound</p>
        </div>
        <div className='progress'>
          <div className='title'>Feline friends satisfied</div>
          <div className='fraction'>
            {Object.values(profileProgressions.checklists[2726513366]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[2726513366]).length}
          </div>
          <div
            className='bar'
            style={{
              width: `${(Object.values(profileProgressions.checklists[2726513366]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[2726513366]).length) * 100}%`
            }}
          />
        </div>
      </div>
      <ul className='list no-interaction'>{list}</ul>
    </>
  );
};

export default catStatues;
