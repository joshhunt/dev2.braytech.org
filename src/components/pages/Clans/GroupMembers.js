import React from 'react';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Globals from '../../Globals';

import * as destinyUtils from '../../destinyUtils';

class GroupMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: []
    };

    this.askBungie = this.askBungie.bind(this);
  }

  askBungie = member => {
    let requests = [
      {
        name: 'profile',
        path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Profile/${member.destinyUserInfo.membershipId}/?components=100,200,204,900`
      },
      {
        name: 'stats',
        path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Account/${member.destinyUserInfo.membershipId}/Character/0/Stats/?groups=0,0&modes=4,5,16,19,63&periodType=0`
      }
    ];

    let fetches = requests.map(request => {
      return fetch(request.path, {
        headers: {
          'X-API-Key': Globals.key.bungie
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
    this.props.members.forEach(member => {
      this.askBungie(member)
        .then(response => {
          if (response.profile.ErrorCode !== 1) {
            console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.profile.Message);
            return;
          }
          if (response.stats.ErrorCode !== 1) {
            console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.stats.Message);
            return;
          }

          response.profile.Response.characters.data = Object.values(response.profile.Response.characters.data).sort(function(a, b) {
            return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
          });

          response = {
            profile: response.profile.Response,
            stats: response.stats.Response
          };

          this.setState(prevState => ({
            members: [...prevState.members, response]
          }));
        })
        .catch(error => {
          console.log(error);
        });
    });
  }

  render() {
    const manifest = this.props.manifest;

    let members = [];

    this.props.members.forEach(member => {
      let profile = false;
      let stats = false;
      // eslint-disable-next-line eqeqeq
      let discovered = this.state.members.filter(el => el.profile.profile.data.userInfo.membershipId == member.destinyUserInfo.membershipId);
      if (discovered.length > 0) {
        profile = discovered[0].profile;
        stats = discovered[0].stats;
      }

      if (profile) {
        if (profile.profile.data.userInfo.membershipId == 4611686018449662397) {
          console.log(profile, stats);
        }

        let currentActivity = false;
        let lastActive = profile.profile.data.dateLastPlayed;

        if (member.isOnline) {
          var activeCharacter = false;
          if (profile.characterActivities.data) {
            Object.keys(profile.characterActivities.data).forEach(key => {
              if (profile.characterActivities.data[key].currentActivityHash !== 0) {
                activeCharacter = profile.characterActivities.data[key];
                return;
              }
            });
          }

          let activityModeDefinition = manifest.DestinyActivityModeDefinition[activeCharacter.currentActivityModeHash];
          let activityDefinition = manifest.DestinyActivityDefinition[activeCharacter.currentActivityHash];

          let activity;
          activity = activityDefinition ? (activityDefinition.displayProperties.name ? activityDefinition.displayProperties.name : false) : false;
          activity = activity ? activity : activityDefinition ? (activityDefinition.placeHash === 2961497387 ? `Orbit` : false) : false;

          let mode = activity === 'Orbit' ? false : activityModeDefinition ? activityModeDefinition.displayProperties.name : false;

          currentActivity = `${mode ? mode : ``}${mode ? `: ` : ``}${activity ? activity : `Classified`}`;
        }

        let collated = {
          crucible: {
            efficiency: stats.allPvP.allTime ? stats.allPvP.allTime.efficiency.basic.displayValue : ''
          },
          ironBanner: {
            efficiency: stats.ironBanner.allTime ? stats.ironBanner.allTime.efficiency.basic.displayValue : ''
          },
          raid: {
            activitiesCleared: stats.raid.allTime ? stats.raid.allTime.activitiesCleared.basic.displayValue : ''
          },
          nightfall: {
            activitiesCleared: stats.nightfall.allTime ? stats.nightfall.allTime.activitiesCleared.basic.displayValue : ''
          },
          gambit: {
            efficiency: stats.pvecomp_gambit.allTime ? stats.pvecomp_gambit.allTime.efficiency.basic.displayValue : ''
          }
        }

        members.push({
          online: member.isOnline,
          lastActive: new Date(lastActive).getTime(),
          currentActivity: currentActivity,
          element: (
            <div
              className={cx('member', {
                online: member.isOnline
              })}
            >
              <div className='m displayName'>{member.destinyUserInfo.displayName}</div>
              <div className='m light'>{profile.characters.data.reduce((max, p) => (p.light > max ? p.light : max), profile.characters.data[0].light)}</div>
              <div className='m activity'>{currentActivity ? currentActivity : <>Last active <Moment fromNow>{lastActive}</Moment></> }</div>
              <div className='joinDate'>
                <Moment fromNow>{member.joinDate}</Moment>
              </div>
              <div className='crucible'>{collated.crucible.efficiency}</div>
              <div className='ironBanner'>{collated.ironBanner.efficiency}</div>
              <div className='gambit'>{collated.gambit.efficiency}</div>
              <div className='nightfall'>{collated.nightfall.activitiesCleared}</div>
              <div className='raid'>{collated.raid.activitiesCleared}</div>
            </div>
          )
        });
      } else {
        members.push({
          online: member.isOnline,
          lastActive: new Date(member.joinDate).getTime(),
          element: (
            <div
              className={cx('member', {
                online: member.isOnline
              })}
            >
              <div className='m displayName'>{member.destinyUserInfo.displayName}</div>
              <div></div>
              <div></div>
              <div className='m joinDate'>
                <Moment fromNow>{member.joinDate}</Moment>
              </div>
            </div>
          )
        });
      }
    });

    return orderBy(members, [member => member.online, member => member.currentActivity ? member.currentActivity : member.lastActive], ['desc', 'desc']).map(obj => obj.element);
  }
}

export default GroupMembers;
