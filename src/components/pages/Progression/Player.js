import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames'

import { classFromType } from '../../destinyUtils'
import Globals from '../../Globals';

import './Characters.css'
import './Player.css'
import ObservedImage from '../../ObservedImage';
// import EmblemLoader from './EmblemLoader';




class Player extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expandCharacters: false,
      emblemsLoaded: false
    }

    this.expandCharacters = this.expandCharacters.bind(this);

    this.emblemBackgrounds = null;

  }

  expandCharacters = (e) => {

    if (this.state.expandCharacters) {
      this.charactersUI.classList.remove("expanded");
      this.backgroundsUI.childNodes.forEach(element => {
        element.classList.remove("active");
        if (element.dataset.id === e.currentTarget.dataset.id) {
          element.classList.add("active");
        }
      });
      this.setState({
        expandCharacters: false
      });
      this.props.changeCharacterIdTo(e.currentTarget.dataset.id, this.props);
    }
    else {
      this.charactersUI.classList.toggle("expanded");
      this.setState({
        expandCharacters: true
      });
    }
  }

  getEmblems = (hashes) => {
    fetch(
      `https://api.braytech.org/?request=manifest&table=DestinyInventoryItemDefinition&hash=${ hashes.map(obj => { return obj.hash }).join(",") }`,
      {
        headers: {
          "X-API-Key": Globals.key.braytech,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(response => {

        let emblems = [];
        response.response.data.items.forEach(item => {

          let characterId = hashes.filter(obj => obj.hash === item.hash)[0].character;

          emblems.push(
            <ObservedImage key={characterId} data-id={characterId} className={cx(
                  "image",
                  "emblem",
                  {
                    "missing": item.redacted,
                    "active": this.props.data.activeCharacterId === characterId ? true : false
                  }
                )}
              src={ `https://www.bungie.net${ item.secondarySpecial ? item.secondarySpecial : `/img/misc/missing_icon_d2.png` }` } />
          )
        });

        this.emblemBackgrounds = emblems;

        this.setState({
          emblemsLoaded: response.response.data.items
        });

      })
    .catch(error => {
      console.log(error);
    })
  }

  render() {

    let props = this.props;

    let profile = props.data.ProfileResponse.profile.data;
    let characters = props.data.ProfileResponse.characters.data;
    let characterProgressions = props.data.ProfileResponse.characterProgressions.data;

    let activeCharacter;
    let charactersRender = [];
    let emblemHashes = [];

    characters.forEach(character => {

      if (character.characterId === props.data.activeCharacterId) {
        activeCharacter = character
      }

      let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap 
      ? true : false;

      emblemHashes.push({
        character: character.characterId,
        hash: character.emblemHash
      })

      let progress = capped ? 
      characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt 
      : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

      charactersRender.push(
        <li key={character.characterId} 
          onClick={this.expandCharacters} 
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

    if (!this.state.emblemsLoaded) {
      this.getEmblems(emblemHashes);
    }

    const views = [
      {
        name: "Summary",
        slug: ""
      },
      {
        name: "Checklists",
        slug: "/checklists"
      }
    ]

    return (
      <div id="player">
        <div className="backgrounds" ref={(backgrounds)=>{this.backgroundsUI = backgrounds}}>{this.emblemBackgrounds}</div>
        <div className="characters" ref={(characters)=>{this.charactersUI = characters}}>
          <ul className="list">{charactersRender}</ul>
        </div>
        <div className="views">
          <ul>
            { views.map(view => {
              let route = this.props.route;
              let to = `/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${route.match.params.characterId}${view.slug}`;
              return (
                <li key={view.slug}><NavLink to={to} exact>{view.name}</NavLink></li>
              )
            }) }
          </ul>
        </div>
      </div>
    )

  }
}

export default Player;