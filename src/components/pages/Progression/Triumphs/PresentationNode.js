import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';
import * as ls from '../../../localStorage';

import Records from './Records';
import '../RecordItems.css';

class PresentationNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false
    };

    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  toggleCompleted = () => {
    let currentSetting = ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false;

    ls.set('setting.hideCompletedRecords', currentSetting ? false : true);

    this.setState({
      hideCompleted: ls.get('setting.hideCompletedRecords')
    });
  };

  render() {
    let primaryHash = this.props.primaryHash;

    let manifest = this.props.manifest;

    let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];

    let secondaryHash = this.props.match.params.secondary ? this.props.match.params.secondary : primaryDefinition.children.presentationNodes[0].presentationNodeHash; // crucible -> lifetime
    let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    let tertiaryHash = this.props.match.params.tertiary ? this.props.match.params.tertiary : secondaryDefinition.children.presentationNodes[0].presentationNodeHash; // crucible -> lifetime -> combat record
    let quaternaryHash = this.props.match.params.quaternary ? this.props.match.params.quaternary : false;

    let primaryChildren = [];
    primaryDefinition.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      let isActive = (match, location) => {
        if (this.props.match.params.secondary === undefined && primaryDefinition.children.presentationNodes.indexOf(child) === 0) {
          return true;
        } else if (match) {
          return true;
        } else {
          return false;
        }
      };

      primaryChildren.push(
        <li key={node.hash} className='linked'>
          <NavLink isActive={isActive} to={`/progression/${this.props.match.params.membershipType}/${this.props.match.params.membershipId}/${this.props.match.params.characterId}/triumphs/${primaryHash}/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.displayProperties.icon}`} />
          </NavLink>
        </li>
      );
    });

    let secondaryChildren = [];
    secondaryDefinition.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

      if (node.redacted) {
        return;
      }

      let isActive = (match, location) => {
        if (this.props.match.params.tertiary === undefined && secondaryDefinition.children.presentationNodes.indexOf(child) === 0) {
          return true;
        } else if (match) {
          return true;
        } else {
          return false;
        }
      };

      secondaryChildren.push(
        <li key={node.hash} className='linked'>
          <NavLink isActive={isActive} to={`/progression/${this.props.match.params.membershipType}/${this.props.match.params.membershipId}/${this.props.match.params.characterId}/triumphs/${primaryHash}/${secondaryHash}/${node.hash}`}>
            {node.displayProperties.name}
          </NavLink>
        </li>
      );
    });

    return (
      <div className="node">
        <div className="header">
          <div className="options">
            <ul>
              <li>
                <Link to={`/progression/${this.props.match.params.membershipType}/${this.props.match.params.membershipId}/${this.props.match.params.characterId}/triumphs`}>Contents</Link>
              </li>
              <li>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={this.toggleCompleted}>{this.state.hideCompleted ? <>Show redeemed</> : <>Hide redeemed</>}</a>
              </li>
            </ul>
          </div>
          <div className="name">
            {primaryDefinition.displayProperties.name} <span>{primaryDefinition.children.presentationNodes.length !== 1 ? secondaryDefinition.displayProperties.name : null}</span>
          </div>
        </div>
        <div className="children">
          <ul
            className={cx('list', 'primary', {
              'single-primary': primaryDefinition.children.presentationNodes.length === 1
            })}
          >
            {primaryChildren}
          </ul>
          <ul className="list secondary">{secondaryChildren}</ul>
        </div>
        <div className="records">
          <ul className="list tertiary record-items">
            <Records {...this.props} {...this.state} tertiaryHash={tertiaryHash} quaternaryHash={quaternaryHash} />
          </ul>
        </div>
      </div>
    );
  }
}

export default PresentationNode;
