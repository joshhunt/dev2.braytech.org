import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames'

import { classFromType } from '../../destinyUtils'

import './Characters.css'
import './Player.css'
import ObservedImage from '../../ObservedImage';
import EmblemLoader from '../../EmblemLoader';




const Player = (props) => {
  console.log(props)

  let profile = props.data.ProfileResponse.profile.data
  let characters = props.data.ProfileResponse.characters.data;
  let characterProgressions = props.data.ProfileResponse.characterProgressions.data;

  let activeCharacter
  let charactersRender = [];

  characters.forEach(character => {

    if (character.characterId === props.data.activeCharacterId) {
      activeCharacter = character
    }

    let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap 
    ? true : false;

    let progress = capped ? 
    characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt 
    : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

    charactersRender.push(
      <li key={character.characterId} 
        onClick={props.changeCharacterIdTo} 
        data-id={character.characterId}
        className={cx(
          {
            "active": character.characterId === props.data.activeCharacterId ? true : false
          }
        )}>
        <ObservedImage className={cx(
              "image",
              "emblem",
              {
                "missing": !character.emblemBackgroundPath
              }
            )}
          src={ `https://www.bungie.net${ character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png` }` } />
        <div className="displayName">{ profile.userInfo.displayName }</div>
        <div className="class">{ classFromType(character.classType) }</div>
        <div className="light">{ character.light }</div>
        <div className="level">Level { character.baseCharacterLevel }</div>
        <div className="progress">
          <div className={cx(
              "bar",
              {
                "capped": capped
              }
            )}
            style={
              {
                width: `${ progress * 100 }%`
              }
            } ></div>
        </div>
      </li>
    )
  });

  return (
    <div id="player">
      <EmblemLoader hash={activeCharacter.emblemHash} />
      <div className="characters">
        <ul className="list">{charactersRender}</ul>
      </div>
      <ul>
        <li><NavLink to={props.route.match.url} exact>Summary</NavLink></li>
        <li><NavLink to={`${props.route.match.url}/checklists`} exact>Checklists</NavLink></li>
      </ul>
    </div>
  )
}

export default Player;