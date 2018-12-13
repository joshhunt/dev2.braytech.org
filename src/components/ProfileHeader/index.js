import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';
import packageJSON from '../../../package.json';
import ObservedImage from '../../components/ObservedImage';

import { classTypeToString } from '../../utils/destinyUtils';

import './styles.css';

class ProfileHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileNavOpen: false
    };

    this.TriggerClickHandler = this.TriggerClickHandler.bind(this);
    this.NavlinkClickHandler = this.NavlinkClickHandler.bind(this);
  }

  TriggerClickHandler = () => {
    if (!this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: true });
    } else {
      this.setState({ mobileNavOpen: false });
    }
  };

  NavlinkClickHandler = () => {
    if (this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: false });
    }
  };

  render() {
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    let profile = this.props.response.profile.profile.data;
    let characters = this.props.response.profile.characters.data;
    let characterProgressions = this.props.response.profile.characterProgressions.data;

    let character = characters.find(character => character.characterId === characterId);

    let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

    let emblemDefinition = manifest.DestinyInventoryItemDefinition[character.emblemHash];

    let progress = capped ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

    let viewsRender = (
      <div className='views'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                {view.dev ? (
                  `${view.name}`
                ) : (
                  <>
                    <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                      {view.name}
                    </NavLink>
                    <div className='description'>{view.desc}</div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );

    let viewsInline = false;
    if (this.props.viewport.width > 1200) {
      viewsInline = true;
    }

    let mobileNav = (
      <div className='nav'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                {view.dev ? (
                  `${view.name}`
                ) : (
                  <>
                    <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                      {view.name}
                    </NavLink>
                    <div className='description'>{view.desc}</div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <div id='header' className={cx('profile-header', { navOpen: this.state.mobileNavOpen })}>
        <div className='braytech'>
          <div className='logo'>
            <Link to='/'>
              <span className='destiny-clovis_bray_device' />
              Braytech {packageJSON.version}
            </Link>
          </div>
          {!viewsInline ? (
            this.state.mobileNavOpen ? (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniE106' />
                Exit
              </div>
            ) : (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniEA55' />
                Views
              </div>
            )
          ) : null}
        </div>
        <div className='profile'>
          <div className='background'>
            <ObservedImage
              className={cx('image', 'emblem', {
                missing: emblemDefinition.redacted
              })}
              src={`https://www.bungie.net${emblemDefinition.secondarySpecial ? emblemDefinition.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
            />
          </div>
          <div className='ui'>
            <div className='characters'>
              <ul className='list'>
                <li>
                  <ObservedImage
                    className={cx('image', 'secondaryOverlay', {
                      missing: emblemDefinition.redacted
                    })}
                    src={`https://www.bungie.net${!emblemDefinition.redacted ? emblemDefinition.secondaryOverlay : `/img/misc/missing_icon_d2.png`}`}
                  />
                  <div className='displayName'>{profile.userInfo.displayName}</div>
                  <div className='basics'>
                    {character.baseCharacterLevel} / {classTypeToString(character.classType)} / <span className='light'>{character.light}</span>
                  </div>
                  <div className='progress'>
                    <div
                      className={cx('bar', {
                        capped: capped
                      })}
                      style={{
                        width: `${progress * 100}%`
                      }}
                    />
                  </div>
                  <Link
                    to={{
                      pathname: '/character-select',
                      state: { from: this.props.location }
                    }}
                  />
                </li>
              </ul>
            </div>
            {viewsInline ? viewsRender : null}
          </div>
        </div>
        {this.state.mobileNavOpen ? mobileNav : null}
      </div>
    );
  }
}

export default ProfileHeader;
