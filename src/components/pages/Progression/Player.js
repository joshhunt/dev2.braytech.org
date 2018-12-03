import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';
import Moment from 'react-moment';

import ObservedImage from '../../ObservedImage';
import { classTypeToString } from '../../destinyUtils';
import Globals from '../../Globals';

import './Characters.css';
import './Player.css';

class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandCharacters: false,
      activeCharacterId: this.props.match.params.characterId
    };

    this.expandCharacters = this.expandCharacters.bind(this);
  }

  expandCharacters = e => {
    if (this.state.expandCharacters) {
      this.setState({
        expandCharacters: false
      });
    } else {
      e.preventDefault();
      this.setState({
        expandCharacters: true
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.characterId !== this.props.match.params.characterId) {
      this.setState({
        activeCharacterId: this.props.match.params.characterId
      });
    }
  }

  render() {
    let props = this.props;

    const manifest = props.manifest;

    let profile = props.response.profile.profile.data;
    let characters = props.response.profile.characters.data;
    let characterActivities = props.response.profile.characterActivities.data;
    let characterProgressions = props.response.profile.characterProgressions.data;

    let activeCharacter;
    let charactersRender = [];
    let emblemBackgrounds = [];

    characters.forEach(character => {
      if (character.characterId === this.state.activeCharacterId) {
        activeCharacter = character;
      }

      let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

      let emblemDefinition = manifest.DestinyInventoryItemDefinition[character.emblemHash];
      emblemBackgrounds.push(
        <ObservedImage
          key={character.characterId}
          data-id={character.characterId}
          className={cx('image', 'emblem', {
            missing: emblemDefinition.redacted,
            active: this.state.activeCharacterId === character.characterId ? true : false
          })}
          src={`https://www.bungie.net${emblemDefinition.secondarySpecial ? emblemDefinition.secondarySpecial : `/img/misc/missing_icon_d2.png`}`}
        />
      );

      let progress = capped ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

      charactersRender.push(
        <li
          key={character.characterId}
          data-id={character.characterId}
          className={cx({
            active: character.characterId === this.state.activeCharacterId ? true : false
          })}
        >
          <ObservedImage
            className={cx('image', 'emblem', {
              missing: !character.emblemBackgroundPath
            })}
            src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
          />
          <div className='displayName'>{profile.userInfo.displayName}</div>
          <div className='class'>{classTypeToString(character.classType)}</div>
          <div className='light'>{character.light}</div>
          <div className='level'>Level {character.baseCharacterLevel}</div>
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
          <Link onClick={this.expandCharacters} to={`/progression/${props.match.params.membershipType}/${props.match.params.membershipId}/${character.characterId}${props.match.params.view ? `/${props.match.params.view}` : ``}${props.match.params.primary ? `/${props.match.params.primary}` : ``}${props.match.params.secondary ? `/${props.match.params.secondary}` : ``}${props.match.params.tertiary ? `/${props.match.params.tertiary}` : ``}`} />
        </li>
      );
    });

    charactersRender.push(
      <li key='profileChange' className='change' onClick={this.props.goToProgression}>
        <div className='text'>
          <h4>Change profile</h4>
        </div>
      </li>
    );

    const views = [
      {
        name: 'Overview',
        slug: '',
        exact: true
      },
      {
        name: 'This Week',
        slug: '/this-week',
        exact: true
      },
      {
        name: 'Checklists',
        slug: '/checklists',
        exact: true
      },
      {
        name: 'Triumphs',
        slug: '/triumphs',
        exact: false
      },
      {
        name: 'Collections',
        slug: '/collections',
        exact: false
      }
    ];

    let activity;
    if (characterActivities[activeCharacter.characterId].currentActivityHash !== 0) {
      var modeDefinition = manifest.DestinyActivityModeDefinition[characterActivities[activeCharacter.characterId].currentActivityModeHash];
      var activityDefinition = manifest.DestinyActivityDefinition[characterActivities[activeCharacter.characterId].currentActivityHash];

      activity = activityDefinition ? (activityDefinition.displayProperties.name ? activityDefinition.displayProperties.name : false) : false;
      activity = activity ? activity : activityDefinition ? (activityDefinition.placeHash === 2961497387 ? `Orbit` : false) : false;

      var mode = activity === 'Orbit' ? false : modeDefinition ? modeDefinition.displayProperties.name : false;

      activity = `${mode ? mode : ``}${mode ? `: ` : ``}${activity ? activity : `Ghosting`}`;
    } else {
      activity = (
        <>
          Last played <Moment fromNow>{activeCharacter.dateLastPlayed}</Moment>
        </>
      );
    }

    return (
      <div id='player'>
        <div className='backgrounds'>{emblemBackgrounds}</div>
        <div
          className={cx('characters', {
            expanded: this.state.expandCharacters
          })}
          ref={characters => {
            this.charactersUI = characters;
          }}
        >
          <ul className='list'>{charactersRender}</ul>
        </div>
        <div className='views'>
          <ul>
            {views.map(view => {
              let route = this.props;
              let to = `/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${route.match.params.characterId}${view.slug}`;
              return (
                <li key={view.slug}>
                  {view.dev ? (
                    `${view.name}`
                  ) : (
                    <NavLink to={to} exact={view.exact}>
                      {view.name}
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default Player;
