import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';

import Globals from '../../Globals';

import * as destinyUtils from '../../destinyUtils';

import './Clans.css';
import GroupMembers from './GroupMembers';


class DisplayGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    }

  }

  componentDidMount () {
    
    let groupFetch = fetch(
      `https://www.bungie.net/Platform/GroupV2/${ this.props.match.params.groupId }/`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    });

    let groupMembersFetch = fetch(
      `https://www.bungie.net/Platform/GroupV2/${ this.props.match.params.groupId }/Members/`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    });

    Promise.all([groupFetch, groupMembersFetch]).then(responses => {
  
      this.setState({
        data: {
          GroupResponse: responses[0],
          GroupMembersResponse: responses[1]
        }
      });

    })
    .catch(error => {
      console.log(error);
    })

  }

  render() {
    console.log(this);
    
    if (!this.state.data) {
      return (
        <div className="view" id="loading">
          <p>loading group</p>
        </div>        
      )
    }
    else {

      let group = this.state.data.GroupResponse.Response;
      let members = this.state.data.GroupMembersResponse.Response;

      let platforms = {
        1: 0,
        2: 0,
        4: 0
      }

      members.results.forEach(member => {
        platforms[member.destinyUserInfo.membershipType]++;
      });

      var commonPlatform = Object.keys(platforms).reduce((a, b) => platforms[a] > platforms[b] ? a : b);

      return (
        <div className="view" id="clans">
          <div className="group">
            <h2>{ group.detail.name }</h2>
            <div className="motto">{ group.detail.motto }</div>
            <div className="meta">
              <div>
                <h4>About</h4>
                <ReactMarkdown className="text" escapeHtml disallowedTypes={["link","linkReference","image","imageReference"]} source={group.detail.about} />
              </div>
              <div>
                <h4>Founded</h4>
                <div><Moment fromNow>{ group.detail.creationDate }</Moment></div>
              </div>
              <div>
                <h4>Platform</h4>
                <div>{ Math.ceil(platforms[commonPlatform] / Object.values(platforms).reduce( (accumulator, currentValue) => accumulator + currentValue) * 100) }% { destinyUtils.membershipTypeToString(parseInt(commonPlatform)) }</div>
              </div>
              <div>
                <h4>Members</h4>
                <div>{ group.detail.memberCount }/{ group.detail.features.maximumMembers }</div>
              </div>
            </div>
          </div>
          <ul className="roster">
            <li className="header">
              <ul>
                <li>Gamertag</li>
                <li>Date joined</li>
                <li>Triumph score</li>
                <li>Current light</li>
                <li>Class</li>
                <li>Current activity</li>
              </ul>
            </li>
            <GroupMembers members={members.results} manifest={this.props.manifest} />
          </ul>
        </div>  
      )      
    }


  }
}

export default DisplayGroup;