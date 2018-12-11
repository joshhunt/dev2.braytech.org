import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';

import { enumerateRecordState } from '../../utils/destinyEnums';

import RecordsAlmost from '../../components/RecordsAlmost';

class Root extends React.Component {
  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const characterRecords = this.props.response.profile.characterRecords.data;
    const profileRecords = this.props.response.profile.profileRecords.data.records;

    const sealBars = {
      2588182977: {
        text: 'Wayfarer',
        nodeHash: 2588182977,
        recordHash: 2757681677,
        total: profileRecords[2757681677].objectives[0].completionValue,
        completed: profileRecords[2757681677].objectives[0].progress
      },
      3481101973: {
        text: 'Dredgen',
        nodeHash: 3481101973,
        recordHash: 3798931976,
        total: profileRecords[3798931976].objectives[0].completionValue,
        completed: profileRecords[3798931976].objectives[0].progress
      },
      147928983: {
        text: 'Unbroken',
        nodeHash: 147928983,
        recordHash: 3369119720,
        total: profileRecords[3369119720].objectives[0].completionValue,
        completed: profileRecords[3369119720].objectives[0].progress
      },
      2693736750: {
        text: 'Chronicler',
        nodeHash: 2693736750,
        recordHash: 1754983323,
        total: profileRecords[1754983323].objectives[0].completionValue,
        completed: profileRecords[1754983323].objectives[0].progress
      },
      2516503814: {
        text: 'Cursebreaker',
        nodeHash: 2516503814,
        recordHash: 1693645129,
        total: profileRecords[1693645129].objectives[0].completionValue,
        completed: profileRecords[1693645129].objectives[0].progress
      },
      1162218545: {
        text: 'Rivensbane',
        nodeHash: 1162218545,
        recordHash: 2182090828,
        total: profileRecords[2182090828].objectives[0].completionValue,
        completed: profileRecords[2182090828].objectives[0].progress
      },
      2039028930: {
        text: 'Blacksmith',
        nodeHash: 2039028930,
        recordHash: 2053985130,
        total: profileRecords[2053985130].objectives[0].completionValue,
        completed: profileRecords[2053985130].objectives[0].progress
      }
    };

    let parent = manifest.DestinyPresentationNodeDefinition[1024788583];
    let sealsParent = manifest.DestinyPresentationNodeDefinition[1652422747];

    let nodes = [];
    let sealNodes = [];
    let recordsStates = [];

    parent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.presentationNodes.forEach(nodeChild => {
        let nodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChild.presentationNodeHash];
        nodeChildNode.children.presentationNodes.forEach(nodeChildNodeChild => {
          let nodeChildNodeChildNode = manifest.DestinyPresentationNodeDefinition[nodeChildNodeChild.presentationNodeHash];
          if (nodeChildNodeChildNode.redacted) {
            return;
          }
          nodeChildNodeChildNode.children.records.forEach(record => {
            let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId][record.recordHash];
            if (scope) {
              states.push(scope.state);
              recordsStates.push(scope.state);
            } else {
              console.log(`93 Undefined state for ${record.recordHash}`);
            }
          });
        });
      });

      nodes.push(
        <div key={node.hash} className='node'>
          <Link to={`/triumphs/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
            {node.displayProperties.name}
          </Link>
          <div className='state'>
            <span>{states.filter(record => enumerateRecordState(record).recordRedeemed).length}</span> / {states.filter(record => !enumerateRecordState(record).invisible).length}
          </div>
        </div>
      );
    });

    sealsParent.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];
      let states = [];

      node.children.records.forEach(record => {
        let scope = profileRecords[record.recordHash] ? profileRecords[record.recordHash] : characterRecords[characterId][record.recordHash];
        if (scope) {
          states.push(scope.state);
          recordsStates.push(scope.state);
        } else {
          console.log(`122 Undefined state for ${record.recordHash}`);
        }
      });

      sealNodes.push(
        <div
          key={node.hash}
          className={cx('node', {
            completed: sealBars[node.hash].completed === sealBars[node.hash].total
          })}
        >
          <Link to={`/triumphs/seal/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.originalIcon}`} />
            {node.displayProperties.name}
          </Link>
          <div className='state'>
            <span>{sealBars[node.hash].completed}</span> / {sealBars[node.hash].total}
          </div>
        </div>
      );
    });

    return (
      <>
        <div className='nodes'>
          <div className='sub-header'>
            <div>Triumphs</div>
            <div>
              {recordsStates.filter(collectible => enumerateRecordState(collectible).recordRedeemed).length}/{recordsStates.filter(collectible => !enumerateRecordState(collectible).invisible).length}
            </div>
          </div>
          <div className='node'>
            <div className='parent'>{nodes}</div>
          </div>
          <div className='node'>
            <div className='sub-header'>
              <div>Seals</div>
            </div>
            <div className='parent seals'>{sealNodes}</div>
          </div>
        </div>
        <div className='sidebar'>
          <div className='sub-header'>
            <div>Total score</div>
          </div>
          <div className='total-score'>{this.props.response.profile.profileRecords.data.score}</div>
          <div className='sub-header'>
            <div>Almost complete &mdash; next 3</div>
          </div>
          <div className='almost-complete'>
            <RecordsAlmost {...this.props} limit='3' />
          </div>
        </div>
      </>
    );
  }
}

export default Root;
