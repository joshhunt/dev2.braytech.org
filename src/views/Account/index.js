import React from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import orderBy from 'lodash/orderBy';
import { withNamespaces } from 'react-i18next';

import ObservedImage from '../../components/ObservedImage';
import Collectibles from '../../components/Collectibles';
import RecordsAlmost from '../../components/RecordsAlmost';
import ProgressBar from '../../components/ProgressBar';

import * as utils from '../../utils/destinyUtils';

import './styles.css';

class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const characters = this.props.response.profile.characters.data;
    const characterProgressions = this.props.response.profile.characterProgressions.data;
    const profileRecords = this.props.response.profile.profileRecords.data.records;
    const characterRecords = this.props.response.profile.characterRecords.data;
    const genderHash = characters.filter(character => character.characterId == characterId)[0].genderHash;

    const Characters = () => {
      let charactersEl = [];
      characters.forEach(character => {
        charactersEl.push(
          <div key={character.characterId} className='character'>
            <ul className='list'>
              <li>
                <ObservedImage
                  className={cx('image', 'emblem', {
                    missing: !character.emblemPath
                  })}
                  src={`https://www.bungie.net${character.emblemPath ? character.emblemPath : `/img/misc/missing_icon_d2.png`}`}
                />
                <div className='level'>
                  {t('Level')} {character.baseCharacterLevel}
                </div>
                <div className='light'>{character.light}</div>
                <div className='class'>{utils.classHashToString(character.classHash, manifest, character.genderType)}</div>
              </li>
            </ul>
            <div className='timePlayed'>
              {Math.floor(parseInt(character.minutesPlayedTotal) / 1440) < 2 ? (
                <>
                  {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('day played')}
                </>
              ) : (
                <>
                  {Math.floor(parseInt(character.minutesPlayedTotal) / 1440)} {t('days played')}
                </>
              )}
            </div>
          </div>
        );
      });
      return charactersEl;
    };

    const Seals = () => {
      let progression = {
        seals: {
          text: t('Triumph Seals'),
          noInteraction: false,
          values: {
            destinations: {
              text: manifest.DestinyRecordDefinition[2757681677].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 2588182977,
              recordHash: 2757681677,
              total: profileRecords[2757681677].objectives[0].completionValue,
              completed: profileRecords[2757681677].objectives[0].progress
            },
            gambit: {
              text: manifest.DestinyRecordDefinition[3798931976].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 3481101973,
              recordHash: 3798931976,
              total: profileRecords[3798931976].objectives[0].completionValue,
              completed: profileRecords[3798931976].objectives[0].progress
            },
            crucible: {
              text: manifest.DestinyRecordDefinition[3369119720].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 147928983,
              recordHash: 3369119720,
              total: profileRecords[3369119720].objectives[0].completionValue,
              completed: profileRecords[3369119720].objectives[0].progress
            },
            lore: {
              text: manifest.DestinyRecordDefinition[1754983323].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 2693736750,
              recordHash: 1754983323,
              total: profileRecords[1754983323].objectives[0].completionValue,
              completed: profileRecords[1754983323].objectives[0].progress
            },
            dreamingCity: {
              text: manifest.DestinyRecordDefinition[1693645129].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 2516503814,
              recordHash: 1693645129,
              total: profileRecords[1693645129].objectives[0].completionValue,
              completed: profileRecords[1693645129].objectives[0].progress
            },
            raids: {
              text: manifest.DestinyRecordDefinition[2182090828].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 1162218545,
              recordHash: 2182090828,
              total: profileRecords[2182090828].objectives[0].completionValue,
              completed: profileRecords[2182090828].objectives[0].progress
            },
            armoury: {
              text: manifest.DestinyRecordDefinition[2053985130].titleInfo.titlesByGenderHash[genderHash],
              nodeHash: 2039028930,
              recordHash: 2053985130,
              total: profileRecords[2053985130].objectives[0].completionValue,
              completed: profileRecords[2053985130].objectives[0].progress
            }
          }
        }
      };

      let list = [];

      for (const [key, value] of Object.entries(progression.seals.values)) {
        list.push(
          <li key={key}>
            <ProgressBar
              objectiveDefinition={{
                progressDescription: value.text,
                completionValue: value.total
              }}
              playerProgress={{
                progress: value.completed,
                objectiveHash: value.recordHash
              }}
              hideCheck
              chunky
            />
            {/* <Link to={`/progression/${props.match.params.membershipType}/${props.match.params.membershipId}/${props.match.params.characterId}/triumphs/seal/${value.nodeHash}`} /> */}
          </li>
        );
      }

      return (
        <ul
          className={cx('list', {
            'no-interaction': true // progression.seals.noInteraction
          })}
        >
          {list}
        </ul>
      );
    };

    const RareCollectibles = () => {
      let checks = [
        4274523516, // Redrix's Claymore
        1111219481, // Redrix's Broadsword
        3260604718, // Luna's Howl
        3260604717, // Not Forgotten
        4047371119, // The Mountaintop

        1660030045, // Malfeasance
        1666039008, // Breakneck

        3810740723, // Loaded Question

        1660030044, // Wish-Ender

        199171386, // Sleeper Simulant
        199171387 // Worldline Zero
      ];

      return (
        <ul className='list collection-items'>
          <Collectibles selfLink {...this.props} hashes={checks} />
        </ul>
      );
    };

    const Strikes = () => {

      let strikes = [
        { hash: 3749730895, score: 1039797865 },
        { hash: 2737678546, score: 165166474 },
        { hash: 3054774873, score: 2692332187 },
        { hash: 1707190649, score: 3399168111 },
        { hash: 56596211, score: 1526865549 },
        { hash: 3145627334, score: 3951275509 },
        { hash: 1336344009, score: 2836924866 },
        { hash: 2782139949, score: 3340846443 },
        { hash: 256005845, score: 2099501667 },
        { hash: 319759693, score: 1060780635 },
        { hash: 141268704, score: 1329556468 },
        { hash: 794103965, score: 3450793480 },
        { hash: 1889144800, score: 2282894388 },
        { hash: 20431832, score: 3973165904 }
      ];

      let list = strikes.map(strike => {
        let scoreDefinition = manifest.DestinyRecordDefinition[strike.score];
        let scoreRecord = characterRecords[characterId].records[strike.score];
        let strikeRecord = profileRecords[strike.hash];

        let score = scoreRecord.objectives.length === 1 ? scoreRecord.objectives[0].progress : 0;
        let completions = strikeRecord.objectives.length === 1 ? strikeRecord.objectives[0].progress : 0;

        return {
          value: score,
          element: (
            <li key={strike.hash} className={cx({ lowScore: score < 100000 })}>
              <div className='name'>{scoreDefinition.displayProperties.name}</div>
              <div className='completions'>{completions.toLocaleString()}</div>
              <div className='score'>{score.toLocaleString()}</div>
            </li>
          )
        };
      });

      list = orderBy(list, [score => score.value], ['desc']);

      return <ul className='list'>{list.map(item => item.element)}</ul>;
    };

    const Ranks = () => {
      let infamyDefinition = manifest.DestinyProgressionDefinition[2772425241];
      let infamyProgression = characterProgressions[characterId].progressions[2772425241];
      let infamyProgressTotal = Object.keys(infamyDefinition.steps).reduce((sum, key) => {
        return sum + infamyDefinition.steps[key].progressTotal;
      }, 0);
      let infamyResets = profileRecords[3901785488] ? profileRecords[3901785488].objectives[0].progress : 0;

      let valorDefinition = manifest.DestinyProgressionDefinition[3882308435];
      let valorProgression = characterProgressions[characterId].progressions[3882308435];
      let valorProgressTotal = Object.keys(valorDefinition.steps).reduce((sum, key) => {
        return sum + valorDefinition.steps[key].progressTotal;
      }, 0);
      let valorResets = profileRecords[559943871] ? profileRecords[559943871].objectives[0].progress : 0;

      let gloryDefinition = manifest.DestinyProgressionDefinition[2679551909];
      let gloryProgression = characterProgressions[characterId].progressions[2679551909];
      let gloryProgressTotal = Object.keys(gloryDefinition.steps).reduce((sum, key) => {
        return sum + gloryDefinition.steps[key].progressTotal;
      }, 0);

      let progression = {
        ranks: {
          text: t('Ranks'),
          noInteraction: true,
          values: {
            infamy: {
              definition: infamyDefinition,
              mode: 'Gambit',
              icon: 'destiny-gambit',
              text: t('Infamy'),
              color: '#25986e',
              total: infamyProgressTotal,
              step: infamyProgression,
              resets: infamyResets
            },
            valor: {
              definition: valorDefinition,
              mode: 'Quickplay',
              icon: 'destiny-faction_crucible_valor',
              text: t('Valor'),
              color: '#ed792c',
              total: valorProgressTotal,
              step: valorProgression,
              resets: valorResets
            },
            glory: {
              definition: gloryDefinition,
              mode: 'Competitive',
              icon: 'destiny-faction_crucible_glory',
              text: t('Glory'),
              color: '#b52422',
              total: gloryProgressTotal,
              step: gloryProgression,
              resets: false
            }
          }
        }
      };

      let ranks = [];

      for (const [key, value] of Object.entries(progression.ranks.values)) {
        ranks.push(
          <div className={cx('rank', key)} key={key}>
            <div className='mode'>
              <div className='icon'>
                <span className={value.icon} />
              </div>
              <div className='name'>{value.mode}</div>
              {value.resets ? <div className='resets'>{value.resets}x</div> : null}
            </div>
            <div className='shallow'>
              <ReactMarkdown className='description rank' source={value.definition.displayProperties.description} />
              <ProgressBar
                classNames={{
                  disabled: value.step.currentProgress === value.total && key === 'glory'
                }}
                objectiveDefinition={{
                  progressDescription: `Next rank: ${value.step.currentProgress === value.total && value.step.stepIndex === value.definition.steps.length ? value.definition.steps[0].stepName : value.definition.steps[(value.step.stepIndex + 1) % value.definition.steps.length].stepName}`,
                  completionValue: value.step.nextLevelAt
                }}
                playerProgress={{
                  progress: value.step.progressToNextLevel,
                  objectiveHash: value.mode
                }}
                hideCheck
                chunky
              />
              <ProgressBar
                objectiveDefinition={{
                  progressDescription: value.text,
                  completionValue: value.total
                }}
                playerProgress={{
                  progress: value.step.currentProgress,
                  objectiveHash: value.mode
                }}
                hideCheck
                chunky
              />
            </div>
          </div>
        );
      }

      return ranks;
    };

    console.log(this);

    return (
      <div className='view' id='account'>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Rare collectibles')}</div>
          </div>
          <div className='content collectibles'>{RareCollectibles()}</div>
          <div className='sub-header sub'>
            <div>{t('Strike high-scores')}</div>
            <div>{t('Season')} 4+</div>
          </div>
          <div className='content strikes'>{Strikes()}</div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Seals')}</div>
          </div>
          <div className='content seals'>{Seals()}</div>
          <div className='sub-header sub'>
            <div>{t('Almost complete triumphs')}</div>
          </div>
          <div className='content almost'>
            <RecordsAlmost {...this.props} />
          </div>
        </div>
        <div className='module'>
          <div className='sub-header sub'>
            <div>{t('Ranks')}</div>
          </div>
          <div className='content ranks'>{Ranks()}</div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Account);
