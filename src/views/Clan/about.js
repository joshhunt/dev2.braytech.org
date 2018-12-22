import React from 'react';
import { NavLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import cx from 'classnames';
import Moment from 'react-moment';
import globals from '../../utils/globals';
import assign from 'lodash/assign';
import ClanBanner from '../../components/ClanBanner';
import Roster from '../../components/Roster';
import Spinner from '../../components/Spinner';

import './about.css';
import { withNamespaces } from 'react-i18next';

class AboutView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      membersResponse: false
    };
    this.groupFetch = this.groupFetch.bind(this);
  }

  groupFetch = async groupId => {
    let requests = [
      {
        name: 'members',
        path: `https://www.bungie.net/Platform/GroupV2/${groupId}/Members/`
      },
      {
        name: 'weeklyRewardState',
        path: `https://www.bungie.net/Platform/Destiny2/Clan/${groupId}/WeeklyRewardState/`
      }
    ];

    let fetches = requests.map(request => {
      return fetch(request.path, {
        headers: {
          'X-API-Key': globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(fetch => {
          let object = {};
          object[request.name] = fetch;
          return object;
        });
    });

    return Promise.all(fetches)
      .then(promises => {
        return assign(...promises);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    const groups = this.props.response.groups;
    const clan = groups.results.length > 0 ? groups.results[0].group : false;

    if (clan) {
      this.groupFetch(clan.groupId).then(response => {
        this.setState({
          membersResponse: response.members,
          weeklyRewardState: response.weeklyRewardState
        });
      });
    }
  }

  render() {
    const manifest = this.props.manifest;
    const groups = this.props.response.groups;
    const clan = groups.results.length > 0 ? groups.results[0].group : false;
    const {t} = this.props;

    if (clan) {
      const clanLevel = clan.clanInfo.d2ClanProgressions[584850370];
      const weeklyPersonalContribution = this.props.response.profile.characterProgressions.data[this.props.characterId].progressions[540048094];

      const weeklyClanEngramsDefinition = manifest.DestinyMilestoneDefinition[4253138191].rewards[1064137897].rewardEntries;
      let rewardState = null;
      if (this.state.weeklyRewardState && this.state.weeklyRewardState.ErrorCode === 1) {
        rewardState = this.state.weeklyRewardState.Response.rewards.find(reward => reward.rewardCategoryHash === 1064137897).entries;
      }

      return (
        <div className='view' id='clan'>
          <div className='about'>
            <div className='banner'>
              <ClanBanner bannerData={clan.clanInfo.clanBannerData} />
            </div>
            <div className='overview'>
              <div className='clan-properties'>
                <div className='name'>
                  {clan.name}
                  <div className='tag'>[{clan.clanInfo.clanCallsign}]</div>
                </div>
                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                <div className='memberCount'>// {clan.memberCount} {t('members')}</div>
                <div className='motto'>{clan.motto}</div>
                <ReactMarkdown className='bio' escapeHtml disallowedTypes={['image', 'imageReference']} source={clan.about} />
              </div>
              <div className='sub-header'>
                <div>{t('Season')} 5</div>
              </div>
              <div className='progression'>
                <div className='clanLevel'>
                  <div className='text'>{t('Clan level')}</div>
                  <div className='progress'>
                    <div className='title'>{t('Level')} {clanLevel.level}</div>
                    <div className='fraction'>
                      {clanLevel.progressToNextLevel}/{clanLevel.nextLevelAt}
                    </div>
                    <div
                      className='bar'
                      style={{
                        width: `${(clanLevel.progressToNextLevel / clanLevel.nextLevelAt) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className='personalContribution'>
                  <div className='text'>{t('Weekly Personal Contribution')}</div>
                  <ul>
                    <li>
                      <div className={cx('state', { completed: weeklyPersonalContribution.weeklyProgress === 5000 })} />
                      <div className='text'>
                        <p>
                          <span>{weeklyPersonalContribution.weeklyProgress}</span> / 5000
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='sub-header'>
                <div>{t('Clan details')}</div>
              </div>
              <div className='progression details'>
                <div className='weeklyRewardState'>
                  <div className='text'>{t('Weekly Clan Engrams')}</div>
                  <ul>
                    {rewardState ? (
                      rewardState.map(reward => (
                        <li key={reward.rewardEntryHash}>
                          <div
                            className={cx('state', {
                              completed: reward.earned
                            })}
                          />
                          <div className='text'>
                            <p>{weeklyClanEngramsDefinition[reward.rewardEntryHash].displayProperties.name}</p>
                          </div>
                        </li>
                      ))
                    ) : (
                      <Spinner />
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className='roster'>
              <div className='sub-header'>
                <div>{t('Views')}</div>
              </div>
              <div className='views'>
                <ul className='list'>
                  <li className='linked'>
                    <NavLink to='/clan' exact>
                      {t('About')}
                    </NavLink>
                  </li>
                  <li className='linked'>
                    <NavLink to='/clan/roster'>{t('Roster')}</NavLink>
                  </li>
                  <li className='linked'>
                    <NavLink to='/clan/stats'>{t('Stats')}</NavLink>
                  </li>
                </ul>
              </div>
              <div className='sub-header'>
                <div>{t('Clan roster')}</div>
                {this.state.membersResponse ? <div>{this.state.membersResponse.Response.results.filter(member => member.isOnline).length} online</div> : null}
              </div>
              {this.state.membersResponse ? <Roster mini linked isOnline members={this.state.membersResponse} manifest={manifest} /> : <Spinner />}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='view' id='clan'>
          <div className='no-clan'>
            <div className='properties'>
              <div className='name'>{t('No clan affiliation')}</div>
              <div className='description'>
                <p>{t('Clans are optional groups of friends that enhance your online gaming experience. Coordinate with your clanmates to take on co-op challenges or just simply represent them in your solo play to earn extra rewards.')}</p>
                <p>{t("Join your friend's clan, meet some new friends, or create your own on the companion app or at bungie.net.")}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withNamespaces()(AboutView);
