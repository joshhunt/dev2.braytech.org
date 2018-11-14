import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';

import Globals from '../../Globals';

import * as destinyUtils from '../../destinyUtils';



class GroupMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      profiles: []
    }

  }

  componentDidMount () {
    
    this.props.members.forEach(member => {

      fetch(
        `https://www.bungie.net/Platform/Destiny2/${ member.destinyUserInfo.membershipType }/Profile/${ member.destinyUserInfo.membershipId }/?components=100,200,204,900`,
        {
          headers: {
            "X-API-Key": Globals.key.bungie,
          }
        }
      )
      .then(response => {
        return response.json();
      })
        .then(ProfileResponse => {
    
          if (ProfileResponse.ErrorCode != 1) {
            console.warn(member.destinyUserInfo.membershipType + "/" + member.destinyUserInfo.membershipId + " - " + ProfileResponse.Message);
            return;
          }
    
          var response = ProfileResponse.Response;
          response.characters.data = Object.values(response.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

          this.setState(prevState => ({
            profiles: [...prevState.profiles, response]
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
      let discovered = this.state.profiles.filter(el => el.profile.data.userInfo.membershipId === member.destinyUserInfo.membershipId);
      if (discovered.length > 0) {
        profile = discovered[0];
      }

      if (profile) {
              
        var currentActivity = ``;
        if (member.isOnline) {
          
          var activeCharacter = false;
          if (profile.characterActivities.data) {
            Object.keys(profile.characterActivities.data).forEach(key => {
              if (profile.characterActivities.data[key].currentActivityHash != 0) {
                activeCharacter = profile.characterActivities.data[key];
                return;
              }
            });
          }
          
          var modeDefinition = manifest.DestinyActivityModeDefinition[activeCharacter.currentActivityModeHash];
          var activityDefinition = manifest.DestinyActivityDefinition[activeCharacter.currentActivityHash];

          let activity = activityDefinition ? (activityDefinition.displayProperties.name ? activityDefinition.displayProperties.name : false) : false;
          activity = activity ? activity : activityDefinition ? (activityDefinition.placeHash == 2961497387 ? `Orbit` : false) : false;

          var mode = activity == "Orbit" ? false : modeDefinition ? modeDefinition.displayProperties.name : false;

          currentActivity = `${ mode ? mode : `` }${ mode ? `: ` : `` }${ activity ? activity : `Ghosting` }`;

        }

        let activity = <div>Last played <Moment fromNow>{ profile.profile.data.dateLastPlayed }</Moment></div>;
        let lastActive = new Date(profile.profile.data.dateLastPlayed).getTime();

        if (member.isOnline) {
          activity = currentActivity;
          lastActive = new Date().getTime() + 10000;
        }
       
        members.push(
          <li key={member.destinyUserInfo.membershipId} time={lastActive} alt={currentActivity} className={cx(
            {
              "online": member.isOnline
            }
          )}>
            <ul>
              <li className="displayName">{ member.destinyUserInfo.displayName }</li>
              <li className="light">{ profile.characters.data[0].light }</li>
              <li className="joinDate"><Moment fromNow>{ member.joinDate }</Moment></li>
              <li className="clanXp">{ profile.profileRecords.data ? profile.profileRecords.data.records[1738299320].objectives[0].progress : null }</li>
              <li className="primary">{ destinyUtils.classTypeToString(profile.characters.data[0].classType) }</li>
              <li className="activity">{ activity }</li>
            </ul>
          </li>
        )

      }
      else {
        let lastActive = new Date(member.joinDate).getTime();
        members.push(
          <li key={member.destinyUserInfo.membershipId} time={lastActive} alt={member.isOnline ? 1 : 0 } className={cx(
            {
              "online": member.isOnline
            }
          )}>
            <ul>
              <li>{ member.destinyUserInfo.displayName }</li>
              <li><Moment fromNow>{ member.joinDate }</Moment></li>
            </ul>
          </li>
        )
      }
    });

    // members.sort(function(b, a) {
    //   let timeA = a.props.time;
    //   let timeB = b.props.time;
    //   return (timeA < timeB) ? -1 : (timeA > timeB) ? 1 : 0;
    // });

    //console.log(members)

    

    return orderBy(members, [member => member.props.alt !== "" ? member.props.alt : "zzzzzzzzzzzzzzzzz", member => member.props.time], ['asc', 'desc']);

  }
}

export default GroupMembers;