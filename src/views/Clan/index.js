import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import globals from '../../utils/globals';
import assign from 'lodash/assign';
import ObservedImage from '../../components/ObservedImage';
import ClanBanner from '../../components/ClanBanner';
import Roster from '../../components/Roster';

import './styles.css';

class Clan extends React.Component {
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

    if (clan) {
      const clanLevel = clan.clanInfo.d2ClanProgressions[584850370];
      // const weeklyPersonalContribution = this.props.response.profile.profileRecords.data.records[1738299320]

      console.log(clan, this.state);

      const weeklyClanEngramsDefinition = manifest.DestinyMilestoneDefinition[4253138191].rewards[1064137897].rewardEntries;
      let rewardState = null;
      if (this.state.weeklyRewardState && this.state.weeklyRewardState.ErrorCode === 1) {
        rewardState = this.state.weeklyRewardState.Response.rewards.find(reward => reward.rewardCategoryHash === 1064137897).entries;
      }

      return (
        <div className='view' id='clan'>
          <div className='banner'>
            <ClanBanner bannerData={clan.clanInfo.clanBannerData} />
          </div>
          <div className='overview'>
            <div className='properties'>
              <div className='name'>
                {clan.name}
                <div className='tag'>[{clan.clanInfo.clanCallsign}]</div>
              </div>
              {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
              <div className='memberCount'>// {clan.memberCount} members</div>
              <div className='motto'>{clan.motto}</div>
              <div className='bio'>{clan.about}</div>
            </div>
            <div className='sub-header'>
              <div>Season 5</div>
            </div>
            <div className='progression'>
              <div className='clanLevel'>
                <div className='text'>Clan level</div>
                <div className='progress'>
                  <div className='title'>Level {clanLevel.level}</div>
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
                <div className='text'>Weekly Personal Contribution</div>
                <ul>
                  <li>
                    <div className='state' />
                    <div className='text'>
                      <p>0/5000</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className='sub-header'>
              <div>Clan details</div>
            </div>
            <div className='progression details'>
              <div className='weeklyRewardState'>
                <div className='text'>Weekly Clan Engrams</div>
                <ul>
                  {rewardState
                    ? rewardState.map(reward => (
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
                    : null}
                </ul>
              </div>
            </div>
          </div>
          <div className='roster'>
            <div className='sub-header'>
              <div>Views</div>
            </div>
            <div className='views'>
              <ul className='list'>
                <li className='linked'>
                  <NavLink to='/clan'>About</NavLink>
                </li>
                <li className='linked'>
                  <NavLink to='/clan/roster'>Roster</NavLink>
                </li>
                <li className='linked'>
                  <NavLink to='/clan/stats'>Stats</NavLink>
                </li>
              </ul>
            </div>
            <div className='sub-header'>
              <div>Clan roster</div>
              {this.state.membersResponse ? <div>{this.state.membersResponse.Response.results.filter(member => member.isOnline).length} online</div> : null}
            </div>
            {this.state.membersResponse ? <Roster mini members={this.state.membersResponse} manifest={manifest} /> : null}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Clan;
