import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
import assign from 'lodash/assign';
import cx from 'classnames';
import Moment from 'react-moment';
import orderBy from 'lodash/orderBy';
import globals from '../../utils/globals';
import rgbToHsl from '../../utils/rgbToHsl';
import Spinner from '../../components/Spinner';
import ObservedImage from '../../components/ObservedImage';

import './styles.css';

class Roster extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      members: []
    };
  
    this.ProfileResponse = this.ProfileResponse.bind(this);
  }

  ProfileResponse = async (member) => {
    let requests = [
      {
        name: 'profile',
        path: `https://www.bungie.net/Platform/Destiny2/${member.destinyUserInfo.membershipType}/Profile/${member.destinyUserInfo.membershipId}/?components=100,200,204,900`
      }
    ];

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

            if (response.profile.ErrorCode !== 1) {
              console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.profile.Message);
              return;
            }
            // if (response.stats.ErrorCode !== 1) {
            //   console.warn(member.destinyUserInfo.membershipType + '/' + member.destinyUserInfo.membershipId + ' - ' + response.stats.Message);
            //   return;
            // }
  
            response.profile.Response.characters.data = Object.values(response.profile.Response.characters.data).sort(function(a, b) {
              return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
            });
  
            response = {
              member: response.member,
              profile: response.profile.Response,
              // stats: response.stats.Response
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
  }

  render() {
    const manifest = this.props.manifest;
    const mini = this.props.mini;

    console.log(this)

    let members = [];
    if (this.state.members.length > 0) {

      let results = this.state.members.filter(result => result.member.isOnline);

      results.forEach(member => {

        if (!member.profile.characterActivities.data) {
          console.warn(member.member.destinyUserInfo.membershipType + '/' + member.member.destinyUserInfo.membershipId + ' - private profile data');
          return;
        }

        let lastCharacterId = Object.entries(member.profile.characterActivities.data).filter(character => character[1].currentActivityHash !== 0 ? character[0] : member.profile.characterActivities.data[0])[0];

        let lastCharacter = member.profile.characters.data.find(character => character.characterId === lastCharacterId[0]);

        let hsl = rgbToHsl(lastCharacter.emblemColor.red, lastCharacter.emblemColor.green, lastCharacter.emblemColor.blue);

        members.push({
          element: <li key={member.member.destinyUserInfo.membershipId} className='linked' style={{ backgroundColor: `hsl(${hsl.h*360}deg,30%,50%)` }}>
            <ObservedImage className={cx('image', 'icon')} src={`https://www.bungie.net${lastCharacter.emblemPath}`} />
            <div className='displayName'>{member.member.destinyUserInfo.displayName}</div>
          </li>
        });

      });

      members.push({
        element: <li key='i_am_unqiue' className='linked view-all'>
          View all members
        </li>
      });

      return <ul className='list roster'>{members.map(member => member.element)}</ul>;
    }
    else {
      return <Spinner />;
    }

    
  }
}

export default Roster;
