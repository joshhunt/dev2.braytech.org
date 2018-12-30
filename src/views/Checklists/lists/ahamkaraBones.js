import React from 'react';
import cx from 'classnames';

import ProgressBar from '../../../components/ProgressBar';

const ahamkaraBones = props => {
  let profileProgressions = props.response.profile.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[1297424116]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let checklist = false;
    Object.entries(manifest.DestinyChecklistDefinition[1297424116].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[1297424116].entries[pear].hash === hash) {
        checklist = manifest.DestinyChecklistDefinition[1297424116].entries[pear];
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
          <p>Bones {number}</p>
        </div>
        <div className='lowlines'>
          <a href={`https://lowlidev.com.au/destiny/maps/2779202173/${checklist.hash}?origin=BRAYTECH`} target='_blank' rel='noopener noreferrer'>
            <i className='uniE1C4' />
          </a>
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
        <h4>Ahamkara Bones</h4>
        <div className='binding'>
          <p>Profile bound</p>
        </div>
        <ProgressBar
          objectiveDefinition={{
            progressDescription: 'Bones found',
            completionValue: Object.keys(profileProgressions.checklists[1297424116]).length
          }}
          playerProgress={{
            progress: Object.values(profileProgressions.checklists[1297424116]).filter(value => value === true).length
          }}
          hideCheck
          chunky
        />
      </div>
      <ul className='list no-interaction'>{list}</ul>
    </>
  );
};

export default ahamkaraBones;
