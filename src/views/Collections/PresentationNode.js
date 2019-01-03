import React from 'react';
import cx from 'classnames';

import ObservedImage from '../../components/ObservedImage';
import * as ls from '../../utils/localStorage';
import { ProfileNavLink } from '../../components/ProfileLink';

import Collectibles from '../../components/Collectibles';

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
    const manifest = this.props.manifest;

    let primaryHash = this.props.primaryHash;

    let primaryDefinition = manifest.DestinyPresentationNodeDefinition[primaryHash];

    let secondaryHash = this.props.match.params.secondary ? this.props.match.params.secondary : primaryDefinition.children.presentationNodes[0].presentationNodeHash;
    let secondaryDefinition = manifest.DestinyPresentationNodeDefinition[secondaryHash];

    let tertiaryHash = this.props.match.params.tertiary ? this.props.match.params.tertiary : secondaryDefinition.children.presentationNodes[0].presentationNodeHash;
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
          <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${node.hash}`}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${node.displayProperties.icon}`} />
          </ProfileNavLink>
        </li>
      );
    });

    let secondaryChildren = [];
    secondaryDefinition.children.presentationNodes.forEach(child => {
      let node = manifest.DestinyPresentationNodeDefinition[child.presentationNodeHash];

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
          <ProfileNavLink isActive={isActive} to={`/collections/${primaryHash}/${secondaryHash}/${node.hash}`}>
            {node.displayProperties.name}
          </ProfileNavLink>
        </li>
      );
    });

    return (
      <div className='node'>
        <div className='header'>
          <div className='name'>
            {primaryDefinition.displayProperties.name}{' '}
            <span>
              {primaryDefinition.children.presentationNodes.length !== 1 ? (
                <>
                  {'//'} {secondaryDefinition.displayProperties.name}
                </>
              ) : null}
            </span>
          </div>
        </div>
        <div className='children'>
          <ul
            className={cx('list', 'primary', {
              'single-primary': primaryDefinition.children.presentationNodes.length === 1
            })}
          >
            {primaryChildren}
          </ul>
          <ul className='list secondary'>{secondaryChildren}</ul>
        </div>
        <div className='collectibles'>
          <ul className='list tertiary collection-items'>
            <Collectibles {...this.props} {...this.state} node={tertiaryHash} highlight={quaternaryHash} />
          </ul>
        </div>
      </div>
    );
  }
}

export default PresentationNode;
