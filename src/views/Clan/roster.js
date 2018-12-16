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

import './roster.css';

class RosterView extends React.Component {
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
      return (
        <div className='view' id='clan'>
          <div className='roster'>
            <div className='summary'>
              <div className='clan-properties'>
                <div className='name'>
                  {clan.name}
                  <div className='tag'>[{clan.clanInfo.clanCallsign}]</div>
                </div>
                {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
                <div className='memberCount'>// {clan.memberCount} members {this.state.membersResponse ? <>/ {this.state.membersResponse.Response.results.filter(member => member.isOnline).length} online</> : null}</div>
                <div className='motto'>{clan.motto}</div>
              </div>
              <div className='views'>
                <ul className='list'>
                  <li className='linked'>
                    <NavLink to='/clan' exact>
                      About
                    </NavLink>
                  </li>
                  <li className='linked'>
                    <NavLink to='/clan/roster'>Roster</NavLink>
                  </li>
                  <li className='linked'>
                    <NavLink to='/clan/stats'>Stats</NavLink>
                  </li>
                </ul>
              </div>
            </div>
            <div className='members'>{this.state.membersResponse ? <Roster members={this.state.membersResponse} manifest={manifest} /> : <Spinner />}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='view' id='clan'>
          <div className='no-clan'>
            <div className='properties'>
              <div className='name'>No clan affiliation</div>
              <div className='description'>
                <p>Clans are optional groups of friends that enhance your online gaming experience. Coordinate with your clanmates to take on co-op challenges or just simply represent them in your solo play to earn extra rewards.</p>
                <p>Join your friend's clan, meet some new friends, or create your own on the companion app or at bungie.net.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default RosterView;
