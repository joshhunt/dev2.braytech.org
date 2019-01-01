import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { withNamespaces } from 'react-i18next';

import ObservedImage from '../../components/ObservedImage';

import * as utils from '../../utils/destinyUtils';

import './styles.css';

class Characters extends React.Component {
  constructor(props) {
    super(props);
    this.manifest = props.manifest;
    this.state = {};
  }

  render() {
    const { t } = this.props;
    let characters = this.props.response.profile.characters.data;
    let characterProgressions = this.props.response.profile.characterProgressions.data;

    let charactersRender = [];

    characters.forEach(character => {
      let capped = characterProgressions[character.characterId].progressions[1716568313].level === characterProgressions[character.characterId].progressions[1716568313].levelCap ? true : false;

      let progress = capped ? characterProgressions[character.characterId].progressions[2030054750].progressToNextLevel / characterProgressions[character.characterId].progressions[2030054750].nextLevelAt : characterProgressions[character.characterId].progressions[1716568313].progressToNextLevel / characterProgressions[character.characterId].progressions[1716568313].nextLevelAt;

      charactersRender.push(
        <li key={character.characterId} className='linked'>
          <ObservedImage
            className={cx('image', 'emblem', {
              missing: !character.emblemBackgroundPath
            })}
            src={`https://www.bungie.net${character.emblemBackgroundPath ? character.emblemBackgroundPath : `/img/misc/missing_icon_d2.png`}`}
          />
          <div className='class'>{utils.classHashToString(character.classHash, this.manifest, character.genderType)}</div>
          <div className='species'>{utils.raceHashToString(character.raceHash, this.manifest, character.genderType)}</div>
          <div className='light'>{character.light}</div>
          <div className='level'>
            {t('Level')} {character.baseCharacterLevel}
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
            to={this.props.location.pathname !== '/' ? this.props.location.pathname : '/account'}
            onClick={e => {
              this.props.onCharacterSelect(character.characterId);
            }}
          />
        </li>
      );
    });

    return (
      <div className='characters-list'>
        <ul className='list'>{charactersRender}</ul>
      </div>
    );
  }
}

export default withNamespaces()(Characters);
