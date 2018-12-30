import React from 'react';
import cx from 'classnames';
import ReactMarkdown from 'react-markdown';
import { withNamespaces } from 'react-i18next';

import RecordsAlmost from '../../components/RecordsAlmost';
import ProgressBar from '../../components/ProgressBar';

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

    const profileRecords = this.props.response.profile.profileRecords.data.records;
    const characterProgressions = this.props.response.profile.characterProgressions.data;

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
        <div className='module activity-checklists-seals'>
          <div className='sub-header sub'>
            <div>{t('Suggestions box')}</div>
          </div>
          <div className='content feedback'>
            <p>This view is developing into an account-centric overview. If you have any suggestions about content you'd like to be displayed here, please tweet @justrealmilk.</p>
            <p>My first idea is a breakdown of time played on each character.</p>
          </div>
          <div className='sub-header sub'>
            <div>{t('Seals')}</div>
          </div>
          <div className='content'>{Seals()}</div>
        </div>
        <div className='module ranks'>
          <div className='sub-header sub'>
            <div>{t('Ranks')}</div>
          </div>
          <div className='content'>{Ranks()}</div>
        </div>
        <div className='module almost'>
          <div className='sub-header sub'>
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

export default withNamespaces()(Account);
