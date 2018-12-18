import React from 'react';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';
import _filter from 'lodash/filter';
import globals from '../../utils/globals';
import rgbToHsl from '../../utils/rgbToHsl';
import Spinner from '../../components/Spinner';
import ObservedImage from '../../components/ObservedImage';

import { classTypeToString } from '../../utils/destinyUtils';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: []
    };

    this.ProfileResponse = this.ProfileResponse.bind(this);
  }

  ProfileResponse = async member => {
    let requests;
    if (this.props.mini) {
      requests = [
        {
          name: 'profile',
          path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Profile/${member.destinyUserInfo.membershipId}/?components=100,200,204`
        }
      ];
    } else {
      requests = [
        {
          name: 'profile',
          path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Profile/${member.destinyUserInfo.membershipId}/?components=100,200,202,204,900`
        },
        {
          name: 'stats',
          path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Account/${member.destinyUserInfo.membershipId}/Character/0/Stats/?groups=0,0&modes=3,4,5,6,16,19,63&periodType=0`
        }
      ];
    }

    let fetches = requests.map(async request => {
      const get = await fetch(request.path, {
        headers: {
          'X-API-Key': globals.key.bungie
        }
      });
      const response = await get.json();
      let object = {};
      object[request.name] = response;
      return object;
    });

    try {
      const promises = await Promise.all(fetches);
      let result = assign(...promises);
      result.member = member;
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    const members = this.props.members;
    if (members) {
      members.Response.results.forEach(member => {
        this.ProfileResponse(member)
          .then(response => {
            if (response.profile && response.profile.ErrorCode !== 1) {
              console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.profile.Message);
              return;
            }
            if (response.stats && response.stats.ErrorCode !== 1) {
              console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.stats.Message);
              return;
            }

            if (response.profile) {
              response.profile.Response.characters.data = Object.values(response.profile.Response.characters.data).sort(function(a, b) {
                return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
              });
            }

            if (response.stats) {
              response = {
                member: response.member,
                profile: response.profile.Response,
                stats: response.stats.Response
              };
            } else {
              response = {
                member: response.member,
                profile: response.profile.Response
              };
            }

            this.setState(prevState => ({
              members: [...prevState.members, response]
            }));
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }

  render() {
    const manifest = this.props.manifest;
    const mini = this.props.mini;
    const linked = this.props.linked;
    const isOnline = this.props.isOnline;

    let members = [];
    if (this.state.members.length > 0) {
      let results = isOnline ? this.state.members.filter(result => result.member.isOnline) : this.state.members;

      results.forEach(member => {
        let blueberry = new Date().getTime() - new Date(member.member.joinDate).getTime() < 1209600000 ? true : false;

        if (!member.profile.characterActivities.data) {
          members.push({
            isOnline: member.member.isOnline,
            lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
            lastActivity: 0,
            element: (
              <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character', 'error')}>
                <div className='icon black' />
                <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                <div className='error'>Private profile</div>
                <div className='activity'>
                  <Moment fromNow>{member.profile.profile.data.dateLastPlayed}</Moment>
                </div>
                <div className='historicalStats'></div>
              </li>
            )
          });
          return;
        }

        let lastCharacterActivity = Object.entries(member.profile.characterActivities.data);
        lastCharacterActivity = orderBy(
          lastCharacterActivity, 
          [
            character => character[1].dateActivityStarted, 
          ], 
          ['desc']
        );
        // lastCharacterActivity = _filter(
        //   lastCharacterActivity, 
        //   [
        //     character => character.currentActivityHash !== 0
        //   ]
        // );

        lastCharacterActivity = lastCharacterActivity.length > 0 ? lastCharacterActivity[0] : false;

        let lastCharacterTime = Object.entries(member.profile.characterActivities.data);
        lastCharacterTime = orderBy(
          lastCharacterTime, 
          [
            character => character[1].dateActivityStarted, 
          ], 
          ['desc']
        );

        // console.log(lastCharacterActivity, lastCharacterTime)

        // console.log(lastCharacterTime, member.profile.characterActivities.data);

        // console.log(member,, lastCharacterActivity);

        if (lastCharacterActivity || lastCharacterTime) {
          let lastCharacterId = lastCharacterActivity ? lastCharacterActivity[0] : lastCharacterTime[0];
          let lastActivity = lastCharacterActivity ? lastCharacterActivity[1] : false;

          let lastCharacter = member.profile.characters.data.find(character => character.characterId === lastCharacterId);

          // let hsl = rgbToHsl(lastCharacter.emblemColor.red, lastCharacter.emblemColor.green, lastCharacter.emblemColor.blue);
          //  style={{ backgroundColor: `hsl(${hsl.h * 360}deg,${Math.max(hsl.s, 0.20) * 100}%,${Math.max(hsl.l, 0.30) * 100}%)` }}

          if (mini) {
            members.push({
              isOnline: member.member.isOnline,
              lastActive: lastActivity && member.member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
              lastActivity: lastActivity && member.member.isOnline ? lastActivity.currentActivityHash : 0,
              element: (
                <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry })}>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                  <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                </li>
              )
            });
          } else {
            // console.log(lastActivity);

            let activityDisplay = null;
            let stats = null;
            if (lastActivity && member.member.isOnline) {
              let activity = manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
              let mode = activity ? activity.placeHash === 2961497387 ? false : manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash] : false;
              
              // console.log(lastActivity);

              activityDisplay = mode ? (
                <>
                  {mode.displayProperties.name}: {activity.displayProperties.name}
                </>
              ) : activity.placeHash === 2961497387 ? (
                'Orbit'
              ) : (
                activity.displayProperties.name
              );

              let collated = {
                patrol: {
                  kills: member.stats.patrol.allTime ? member.stats.patrol.allTime.kills.basic.displayValue : null
                },
                crucible: {
                  secondsPlayed: member.stats.allPvP.allTime ? member.stats.allPvP.allTime.secondsPlayed.basic.displayValue : null,
                  efficiency: member.stats.allPvP.allTime ? member.stats.allPvP.allTime.efficiency.basic.displayValue : null
                },
                ironBanner: {
                  secondsPlayed: member.stats.ironBanner.allTime ? member.stats.ironBanner.allTime.secondsPlayed.basic.displayValue : null,
                  efficiency: member.stats.ironBanner.allTime ? member.stats.ironBanner.allTime.efficiency.basic.displayValue : null
                },
                raids: {
                  secondsPlayed: member.stats.raid.allTime ? member.stats.raid.allTime.secondsPlayed.basic.displayValue : null,
                  activitiesCleared: member.stats.raid.allTime ? member.stats.raid.allTime.activitiesCleared.basic.displayValue : null
                },
                strikes: {
                  secondsPlayed: member.stats.strike.allTime ? member.stats.strike.allTime.secondsPlayed.basic.displayValue : null,
                  activitiesCleared: member.stats.strike.allTime ? member.stats.strike.allTime.activitiesCleared.basic.displayValue : null,
                  longestKillSpree: member.stats.strike.allTime ? member.stats.strike.allTime.longestKillSpree.basic.displayValue : null
                },
                nightfalls: {
                  secondsPlayed: member.stats.nightfall.allTime ? member.stats.nightfall.allTime.secondsPlayed.basic.displayValue : null,
                  activitiesCleared: member.stats.nightfall.allTime ? member.stats.nightfall.allTime.activitiesCleared.basic.displayValue : null,
                  longestKillSpree: member.stats.nightfall.allTime ? member.stats.nightfall.allTime.longestKillSpree.basic.displayValue : null
                },
                gambit: {
                  secondsPlayed: member.stats.pvecomp_gambit.allTime ? member.stats.pvecomp_gambit.allTime.secondsPlayed.basic.displayValue : null,
                  efficiency: member.stats.pvecomp_gambit.allTime ? member.stats.pvecomp_gambit.allTime.efficiency.basic.displayValue : null
                }
              }

              // console.log(member, collated)
              
              if (activity.directActivityModeType) {
                switch (activity.directActivityModeType) {

                  case 3: // strikes
                    stats = <>{collated.strikes.activitiesCleared} strikes cleared</>;
                    break;

                  case 16: // nightfalls
                    stats = <>{collated.nightfalls.activitiesCleared} nightfalls cleared</>;
                    break;

                  case 5: // gambit
                    stats = <>{collated.gambit.efficiency} efficiency</>;
                    break;

                  case 48: // quickplay
                    stats = <>{collated.crucible.efficiency} efficiency</>;
                    break;

                  case 10: // comp
                    stats = <>{collated.crucible.efficiency} efficiency</>;
                    break;

                  case 6: // patrol
                    stats = <>{collated.patrol.kills} kills on patrol</>;
                    break;

                  default: 
                    stats = null;
                }
              }

            }

            let character = (
              <>
                <span className='light'>{lastCharacter.light}</span>
                <span className={`destiny-class_${classTypeToString(lastCharacter.classType).toLowerCase()}`} />
              </>
            );

            members.push({
              isOnline: member.member.isOnline,
              lastActive: lastActivity && member.member.isOnline ? new Date(lastActivity.dateActivityStarted).getTime() : new Date(member.profile.profile.data.dateLastPlayed).getTime(),
              lastActivity: lastActivity && member.member.isOnline ? lastActivity.currentActivityHash : 0,
              element: (
                <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry, thisIsYou: member.member.destinyUserInfo.membershipId == this.props.membershipId })}>
                  <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
                  <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                  <div className='triumphScore'>{member.profile.profileRecords.data.score}</div>
                  <div className='clanXp'>
                    <span>{member.profile.characterProgressions.data[lastCharacterId].progressions[540048094].weeklyProgress}</span> / 5000
                  </div>
                  <div className='character'>{character}</div>
                  <div className='activity'>
                    {activityDisplay}
                    <Moment fromNow>{lastActivity && member.member.isOnline ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed}</Moment>
                  </div>
                  <div className='historicalStats'>{stats}</div>
                </li>
              )
            });
          }
        } else {
          if (mini) {
            members.push({
              isOnline: member.member.isOnline,
              lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
              lastActivity: 0,
              element: (
                <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character')}>
                  <div className='icon black' />
                  <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                </li>
              )
            });
          } else {
            members.push({
              isOnline: member.member.isOnline,
              lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
              lastActivity: 0,
              element: (
                <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character')}>
                  <div className='icon black' />
                  <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                </li>
              )
            });
          }
        }
      });

      members = orderBy(
        members, 
        [
          member => member.isOnline, 
          member => (member.lastActivity !== 0 ? member.lastActivity : member.lastActive),
          member => (member.lastActivity !== 0 ? member.lastActive : false)
        ], 
        ['desc', 'desc', 'desc']
      );

      if (this.props.mini) {
        members.push({
          isOnline: false,
          lastActive: 0,
          lastActivity: 0,
          element: (
            <li key='i_am_unqiue' className='linked view-all'>
              <Link to='/clan/roster'>View full roster</Link>
            </li>
          )
        });
      } else {
        members.unshift({
          isOnline: false,
          lastActive: 0,
          lastActivity: 0,
          element: (
            <li key='i_am_unqiue' className='grid-header'>
              <div className='icon' />
              <div className='displayName' />
              <div className='triumphScore'>Triumph score</div>
              <div className='clanXp'>Clan XP weekly</div>
              <div className='character'>Character</div>
              <div className='activity'>Activity</div>
              <div className='historicalStats'>Historical stats</div>
            </li>
          )
        });
      }

      return <ul className={cx('list', 'roster', { mini: mini })}>{members.map(member => member.element)}</ul>;
    } else {
      return <Spinner />;
    }
  }
}

export default Roster;
