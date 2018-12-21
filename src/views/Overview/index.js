import React from 'react';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import globals from '../../utils/globals';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';

import RecordsAlmost from '../../components/RecordsAlmost';

import './styles.css';
import { withNamespaces } from 'react-i18next';

class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {t} = this.props;
    const manifest = this.props.manifest;
    const characterId = this.props.characterId;

    const profileRecords = this.props.response.profile.profileRecords.data.records;
    const characterProgressions = this.props.response.profile.characterProgressions.data;
    const profileProgressions = this.props.response.profile.profileProgression.data;
    
    const Checklists = () => {
      let progression = {
        checklists: {
          text: t('Checklists'),
          noInteraction: true,
          values: {
            regionChests: {
              text: t('Region chests opened'),
              total: Object.keys(characterProgressions[characterId].checklists[1697465175]).length,
              completed: Object.values(characterProgressions[characterId].checklists[1697465175]).filter(value => value === true).length
            },
            lostSectors: {
              text: t('Lost sectors discovered'),
              total: Object.keys(characterProgressions[characterId].checklists[3142056444]).length,
              completed: Object.values(characterProgressions[characterId].checklists[3142056444]).filter(value => value === true).length
            },
            adventures: {
              text: t('Adventures undertaken'),
              total: Object.keys(characterProgressions[characterId].checklists[4178338182]).length,
              completed: Object.values(characterProgressions[characterId].checklists[4178338182]).filter(value => value === true).length
            },
            corruptedEggs: {
              text: t('Corrupted eggs destroyed'),
              total: Object.keys(profileProgressions.checklists[2609997025]).length,
              completed: Object.values(profileProgressions.checklists[2609997025]).filter(value => value === true).length
            },
            ahamkaraBones: {
              text: t('Ahamkara bones found'),
              total: Object.keys(profileProgressions.checklists[1297424116]).length,
              completed: Object.values(profileProgressions.checklists[1297424116]).filter(value => value === true).length
            },
            catStatues: {
              text: t('Feline friends satisfied'),
              total: Object.keys(profileProgressions.checklists[2726513366]).length,
              completed: Object.values(profileProgressions.checklists[2726513366]).filter(value => value === true).length
            },
            sleeperNodes: {
              text: t('Sleeper nodes hacked'),
              total: Object.keys(profileProgressions.checklists[365218222]).length,
              completed: Object.values(profileProgressions.checklists[365218222]).filter(value => value === true).length
            },
            ghostScans: {
              text: t('Ghost scans performed'),
              total: Object.keys(profileProgressions.checklists[2360931290]).length,
              completed: Object.values(profileProgressions.checklists[2360931290]).filter(value => value === true).length
            },
            latentMemories: {
              text: t('Lost memory fragments destroyed'),
              total: Object.keys(profileProgressions.checklists[2955980198]).length,
              completed: Object.values(profileProgressions.checklists[2955980198]).filter(value => value === true).length
            },
            caydesJorunals: {
              text: t("Cayde's journals recovered"),
              total: 4,
              completed: Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length
            }
          }
        },
        seals: {
          text: t('Triumph Seals'),
          noInteraction: false,
          values: {
            destinations: {
              text: t('Wayfarer'),
              nodeHash: 2588182977,
              recordHash: 2757681677,
              total: profileRecords[2757681677].objectives[0].completionValue,
              completed: profileRecords[2757681677].objectives[0].progress
            },
            gambit: {
              text: t('Dredgen'),
              nodeHash: 3481101973,
              recordHash: 3798931976,
              total: profileRecords[3798931976].objectives[0].completionValue,
              completed: profileRecords[3798931976].objectives[0].progress
            },
            crucible: {
              text: t('Unbroken'),
              nodeHash: 147928983,
              recordHash: 3369119720,
              total: profileRecords[3369119720].objectives[0].completionValue,
              completed: profileRecords[3369119720].objectives[0].progress
            },
            lore: {
              text: t('Chronicler'),
              nodeHash: 2693736750,
              recordHash: 1754983323,
              total: profileRecords[1754983323].objectives[0].completionValue,
              completed: profileRecords[1754983323].objectives[0].progress
            },
            dreamingCity: {
              text: t('Cursebreaker'),
              nodeHash: 2516503814,
              recordHash: 1693645129,
              total: profileRecords[1693645129].objectives[0].completionValue,
              completed: profileRecords[1693645129].objectives[0].progress
            },
            raids: {
              text: t('Rivensbane'),
              nodeHash: 1162218545,
              recordHash: 2182090828,
              total: profileRecords[2182090828].objectives[0].completionValue,
              completed: profileRecords[2182090828].objectives[0].progress
            }
          }
        }
      };

      let list = [];

      for (const [key, value] of Object.entries(progression.checklists.values)) {
        if (key === 'caydesJorunals' && Object.values(profileProgressions.checklists[2448912219]).filter(value => value === true).length !== 4) {
          continue;
        }
        list.push(
          <li key={key}>
            <div className='progress'>
              <div className='title'>{value.text}</div>
              <div className='fraction'>
                {value.completed}/{value.total}
              </div>
              <div
                className='bar'
                style={{
                  width: `${(value.completed / value.total) * 100}%`,
                  backgroundColor: value.color ? value.color : ``
                }}
              />
            </div>
          </li>
        );
      }

      return (
        <ul
          className={cx('list', {
            'no-interaction': progression.checklists.noInteraction
          })}
        >
          {list}
        </ul>
      );
    };

    const Seals = () => {
      let progression = {
        seals: {
          text: t('Triumph Seals'),
          noInteraction: false,
          values: {
            destinations: {
              text: t('Wayfarer'),
              nodeHash: 2588182977,
              recordHash: 2757681677,
              total: profileRecords[2757681677].objectives[0].completionValue,
              completed: profileRecords[2757681677].objectives[0].progress
            },
            gambit: {
              text: t('Dredgen'),
              nodeHash: 3481101973,
              recordHash: 3798931976,
              total: profileRecords[3798931976].objectives[0].completionValue,
              completed: profileRecords[3798931976].objectives[0].progress
            },
            crucible: {
              text: t('Unbroken'),
              nodeHash: 147928983,
              recordHash: 3369119720,
              total: profileRecords[3369119720].objectives[0].completionValue,
              completed: profileRecords[3369119720].objectives[0].progress
            },
            lore: {
              text: t('Chronicler'),
              nodeHash: 2693736750,
              recordHash: 1754983323,
              total: profileRecords[1754983323].objectives[0].completionValue,
              completed: profileRecords[1754983323].objectives[0].progress
            },
            dreamingCity: {
              text: t('Cursebreaker'),
              nodeHash: 2516503814,
              recordHash: 1693645129,
              total: profileRecords[1693645129].objectives[0].completionValue,
              completed: profileRecords[1693645129].objectives[0].progress
            },
            raids: {
              text: t('Rivensbane'),
              nodeHash: 1162218545,
              recordHash: 2182090828,
              total: profileRecords[2182090828].objectives[0].completionValue,
              completed: profileRecords[2182090828].objectives[0].progress
            },
            armoury: {
              text: t('Blacksmith'),
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
            <div className='progress'>
              <div className='title'>{value.text}</div>
              <div className='fraction'>
                {value.completed}/{value.total}
              </div>
              <div
                className='bar'
                style={{
                  width: `${(value.completed / value.total) * 100}%`,
                  backgroundColor: value.color ? value.color : ``
                }}
              />
            </div>
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
              <ReactMarkdown className='description' source={value.definition.displayProperties.description} />
              <div
                className={cx('progress', {
                  disabled: value.step.currentProgress === value.total && key === 'glory'
                })}
              >
                <div className='title'>Next rank: {value.step.currentProgress === value.total && value.step.stepIndex === value.definition.steps.length ? value.definition.steps[0].stepName : value.definition.steps[(value.step.stepIndex + 1) % value.definition.steps.length].stepName}</div>
                <div className='fraction'>
                  {value.step.progressToNextLevel}/{value.step.nextLevelAt}
                </div>
                <div
                  className='bar'
                  style={{
                    width: `${(value.step.progressToNextLevel / value.step.nextLevelAt) * 100}%`
                  }}
                />
              </div>
              <div className='progress'>
                <div className='title'>{value.text}</div>
                <div className='fraction'>
                  {value.step.currentProgress}/{value.total}
                </div>
                <div
                  className='bar'
                  style={{
                    width: `${(value.step.currentProgress / value.total) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        );
      }

      return ranks;
    };

    console.log(this)

    return (
      <div className='view' id='overview'>
        <div className='module activity-checklists-seals'>
          <div className='sub-header'>
            <div>{t('Checklists')}</div>
          </div>
          <div className='content'>{Checklists()}</div>
          <div className='sub-header'>
            <div>{t('Seals')}</div>
          </div>
          <div className='content'>{Seals()}</div>
        </div>
        <div className='module ranks'>
          <div className='sub-header'>
            <div>{t('Ranks')}</div>
          </div>
          <div className='content'>{Ranks()}</div>
        </div>
        <div className='module almost'>
          <div className='sub-header'>
            <div>{t('Almost complete triumphs')}</div>
          </div>
          <div className='content'>
            <RecordsAlmost {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Overview);
