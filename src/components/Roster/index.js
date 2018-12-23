import React from 'react';
import { Link } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';
import globals from '../../utils/globals';
import rgbToHsl from '../../utils/rgbToHsl';
import Spinner from '../../components/Spinner';
import ObservedImage from '../../components/ObservedImage';

import { classTypeToString } from '../../utils/destinyUtils';

import './styles.css';
import { withNamespaces } from 'react-i18next';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      membersFetched: 0,
      freshnessCycles: 0,
      freshnessTimeout: false
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
        }
        // {
        //   name: 'stats',
        //   path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Account/${member.destinyUserInfo.membershipId}/Character/0/Stats/?groups=0,0&modes=3,4,5,6,16,19,63&periodType=0`
        // }
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

  rollCall = (members = this.props.members, updateOnly = false) => {
    if (members) {
      members.Response.results.forEach(member => {
        if ((updateOnly && !member.isOnline) || (this.props.mini && !member.isOnline)) {
          this.setState(prevState => ({
            membersFetched: this.state.membersFetched + 1,
            freshnessTimeout: this.props.members.Response.results.length === this.state.membersFetched + 1 ? false : this.state.freshnessTimeout
          }));
          return;
        }
        this.ProfileResponse(member)
          .then(response => {
            if (response.profile && response.profile.ErrorCode !== 1) {
              console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.profile.Message);
              this.setState(prevState => ({
                membersFetched: this.state.membersFetched + 1,
                freshnessTimeout: this.props.members.Response.results.length === this.state.membersFetched + 1 ? false : this.state.freshnessTimeout
              }));
              return;
            }
            if (response.stats && response.stats.ErrorCode !== 1) {
              console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.stats.Message);
              this.setState(prevState => ({
                membersFetched: this.state.membersFetched + 1,
                freshnessTimeout: this.props.members.Response.results.length === this.state.membersFetched + 1 ? false : this.state.freshnessTimeout
              }));
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

            this.setState(prevState => {
              let updatedMembers = [...prevState.members];

              let index = updatedMembers.length > 0 ? updatedMembers.findIndex(prevMember => prevMember.member.destinyUserInfo.membershipId === member.destinyUserInfo.membershipId) : -1;
              if (index > -1) {
                updatedMembers[index] = response;
                // console.log(`${member.destinyUserInfo.displayName} updated`);
              } else {
                updatedMembers.push(response);
              }

              return {
                members: updatedMembers,
                membersFetched: this.state.membersFetched + 1,
                freshnessTimeout: this.props.members.Response.results.length === this.state.membersFetched + 1 ? false : this.state.freshnessTimeout
              };
            });
          })
          .catch(error => {
            console.log(error);
            this.setState(prevState => ({
              membersFetched: this.state.membersFetched + 1,
              freshnessTimeout: this.props.members.Response.results.length === this.state.membersFetched + 1 ? false : this.state.freshnessTimeout
            }));
          });
      });
    }
  };

  groupFetch = async groupId => {
    let requests = [
      {
        name: 'members',
        path: `https://www.bungie.net/Platform/GroupV2/${groupId}/Members/`
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
    this.rollCall();
  }

  componentWillUnmount() {
    clearTimeout(this.state.freshnessTimeout);
  }

  increaseFreshness = () => {
    // console.log(`Shibuya Roll Call: ${this.state.freshnessCycles + 1}`);
    let groups = this.props.response.groups;
    let clan = groups.results.length > 0 ? groups.results[0].group : false;
    this.groupFetch(clan.groupId)
      .then(response => {
        this.setState({ freshnessCycles: this.state.freshnessCycles + 1 });
        this.rollCall(response.members, true);
      })
      .catch(error => {
        console.log(error);
        this.setState(prevState => ({
          membersFetched: this.props.members.Response.results.length,
          freshnessTimeout: false
        }));
      });
  };

  componentDidUpdate() {
    if (this.props.keepFresh && !this.state.freshnessTimeout && this.props.members.Response.results.length === this.state.membersFetched) {
      // console.log('See you in 30s');
      let timeout = setTimeout(this.increaseFreshness, 30000);
      this.setState({ freshnessTimeout: timeout, membersFetched: 0 });
    }
  }

  render() {
    const { t } = this.props;
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
          if (!mini) {
            members.push({
              isOnline: member.member.isOnline,
              lastActive: new Date(member.profile.profile.data.dateLastPlayed).getTime(),
              lastActivity: 0,
              element: (
                <li key={member.member.destinyUserInfo.membershipId} className={cx({ linked: linked, isOnline: member.member.isOnline, blueberry: blueberry }, 'no-character', 'error')}>
                  <div className='icon black' />
                  <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
                  <div className='error'>{t('Private profile')}</div>
                  <div className='activity'>
                    <Moment fromNow>{member.profile.profile.data.dateLastPlayed}</Moment>
                  </div>
                </li>
              )
            });
          }
          return;
        }

        let lastCharacterActivity = Object.entries(member.profile.characterActivities.data);
        lastCharacterActivity = orderBy(lastCharacterActivity, [character => character[1].dateActivityStarted], ['desc']);

        lastCharacterActivity = lastCharacterActivity.length > 0 ? lastCharacterActivity[0] : false;

        let lastCharacterTime = Object.entries(member.profile.characterActivities.data);
        lastCharacterTime = orderBy(lastCharacterTime, [character => character[1].dateActivityStarted], ['desc']);

        // console.log(member, lastCharacterActivity, lastCharacterTime)
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
            if (lastActivity && member.member.isOnline) {
              let activity = manifest.DestinyActivityDefinition[lastActivity.currentActivityHash];
              let mode = activity ? (activity.placeHash === 2961497387 ? false : manifest.DestinyActivityModeDefinition[lastActivity.currentActivityModeHash]) : false;

              // console.log(lastActivity);

              activityDisplay = mode ? (
                <>
                  {mode.displayProperties.name}: {activity.displayProperties.name}
                </>
              ) : activity ? (
                activity.placeHash === 2961497387 ? (
                  'Orbit'
                ) : (
                  activity.displayProperties.name
                )
              ) : null;
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
                    <span>{Object.values(member.profile.characterProgressions.data).reduce((sum, member) => { return sum + member.progressions[540048094].weeklyProgress }, 0)}</span> / {Object.values(member.profile.characterProgressions.data).reduce((sum, member) => { return sum + 5000 }, 0)}
                  </div>
                  <div className='character'>{character}</div>
                  <div className='activity'>
                    {activityDisplay ? <div className='name'>{activityDisplay}</div> : null}
                    <Moment fromNow>{lastActivity && member.member.isOnline ? lastActivity.dateActivityStarted : member.profile.profile.data.dateLastPlayed}</Moment>
                  </div>
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

      members = orderBy(members, [member => member.isOnline, member => member.lastActivity, member => member.lastActive], ['desc', 'desc', 'desc']);

      if (this.props.mini) {
        members.push({
          isOnline: false,
          lastActive: 0,
          lastActivity: 0,
          element: (
            <li key='i_am_unqiue' className='linked view-all'>
              <Link to='/clan/roster'>{t('View full roster')}</Link>
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
              <div className='triumphScore'>{t('Triumph score')}</div>
              <div className='clanXp'>{t('Clan XP weekly')}</div>
              <div className='character'>{t('Character')}</div>
              <div className='activity'>{t('Activity')}</div>
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

export default withNamespaces()(Roster);
