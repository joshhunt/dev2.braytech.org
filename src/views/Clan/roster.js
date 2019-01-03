import React from 'react';
import cx from 'classnames';
import globals from '../../utils/globals';
import assign from 'lodash/assign';
import Roster from '../../components/Roster';
import Spinner from '../../components/Spinner';
import { withNamespaces } from 'react-i18next';
import ClanNav from './ClanNav';

import './roster.css';

class RosterView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      membersResponse: false,
      rosterKeepFresh: false
    };
    this.groupFetch = this.groupFetch.bind(this);
    this.turnOnKeepFresh = this.turnOnKeepFresh.bind(this);
  }

  turnOnKeepFresh = () => {
    this.setState({
      rosterKeepFresh: !this.state.rosterKeepFresh
    });
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
    const groups = this.props.response.groups;
    const clan = groups.results.length > 0 ? groups.results[0].group : false;

    window.scrollTo(0, 0);

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
    const { t } = this.props;
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
                <div className='memberCount'>
                  // {clan.memberCount} {t('members')}
                </div>
                <div className='motto'>{clan.motto}</div>
              </div>
              <div className='views'>
                <ClanNav />
              </div>
              <div className='info'>
                <p>{t('Pulsing blueberries are freshly acquired members from the last 2 weeks.')}</p>
              </div>
              <div className='freshness'>
                <ul className='list'>
                  <li
                    className={cx('linked', {
                      selected: this.state.rosterKeepFresh
                    })}
                    onClick={this.turnOnKeepFresh}
                  >
                    <div className='bg' />
                    <div className='name'>{this.state.rosterKeepFresh ? <>{t('Auto-update on')}</> : <>{t('Auto-update off')}</>}</div>
                  </li>
                </ul>
              </div>
            </div>
            <div className='members'>{this.state.membersResponse ? <Roster {...this.props} members={this.state.membersResponse} keepFresh={this.state.rosterKeepFresh} /> : <Spinner />}</div>
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

export default withNamespaces()(RosterView);
