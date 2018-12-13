import React from 'react';
import cx from 'classnames';

const sleeperNodes = props => {
  let profileProgressions = props.response.profile.profileProgression.data;

  let manifest = props.manifest;

  let list = [];

  Object.entries(profileProgressions.checklists[365218222]).forEach(([key, value]) => {
    let hash = parseInt(key, 10);

    let completed = value;

    let checklist = false;
    Object.entries(manifest.DestinyChecklistDefinition[365218222].entries).forEach(([pear, peach]) => {
      if (manifest.DestinyChecklistDefinition[365218222].entries[pear].hash === hash) {
        checklist = manifest.DestinyChecklistDefinition[365218222].entries[pear];
        return;
      }
    });

    let itemDefintion = manifest.DestinyInventoryItemDefinition[checklist.itemHash];

    list.push(
      <li
        key={checklist.hash}
        data-state={completed ? `complete` : `incomplete`}
        data-sort={
          itemDefintion.displayProperties.description
            .toString()
            .replace('CB.NAV/RUN.()', '')
            .match(/.*?(?=\.)/)[0]
        }
      >
        <div
          className={cx('state', {
            completed: completed
          })}
        />
        <div className='text'>
          <p>{itemDefintion.displayProperties.description.toString().replace('CB.NAV/RUN.()', '')}</p>
        </div>
        <div className='lowlines'>
          <a href={`https://lowlidev.com.au/destiny/maps/mars/${checklist.hash}?origin=BRAYTECH`} target='_blank' rel='noopener noreferrer'>
            <i className='uniE1C4' />
          </a>
        </div>
      </li>
    );
  });

  list.sort(function(a, b) {
    let textA = a.props['data-sort'].toUpperCase();
    let textB = b.props['data-sort'].toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return (
    <>
      <div className='head'>
        <h4>Sleeper nodes</h4>
        <div className='binding'>
          <p>Profile bound</p>
        </div>
        <div className='progress'>
          <div className='title'>Sleeper nodes hacked</div>
          <div className='fraction'>
            {Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length}/{Object.keys(profileProgressions.checklists[365218222]).length}
          </div>
          <div
            className='bar'
            style={{
              width: `${(Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length / Object.keys(profileProgressions.checklists[365218222]).length) * 100}%`
            }}
          />
        </div>
      </div>
      <ul className='list no-interaction'>{list}</ul>
    </>
  );
};

export default sleeperNodes;
