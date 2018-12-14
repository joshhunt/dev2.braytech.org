/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import cx from 'classnames';
import assign from 'lodash/assign';
import Characters from '../../components/Characters';

import globals from '../../utils/globals';
import * as responseUtils from '../../utils/responseUtils';
import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import errorHandler from '../../utils/errorHandler';
import Spinner from '../../components/Spinner';

import './styles.css';

class CharacterSelect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      profile: false,
      loading: true,
      error: false
    };

    this.SearchDestinyPlayer = this.SearchDestinyPlayer.bind(this);
    this.CharacterSelectHandler = this.CharacterSelectHandler.bind(this);
    this.ProfileResponse = this.ProfileResponse.bind(this);
  }

  SearchDestinyPlayer = e => {
    let membershipType = '-1';
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {
      fetch(`https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`, {
        headers: {
          'X-API-Key': globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(SearchResponse => {
          this.setState({
            results: SearchResponse.Response
          });
        })
        .catch(error => {
          console.log(error);
        });
    }, 1000);
  };

  ProfileResponse = async (membershipType, membershipId) => {
    let requests = [
      {
        name: 'profile',
        path: `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${membershipId}/?components=100,104,200,202,204,205,300,301,302,303,304,305,800,900`
      },
      {
        name: 'milestones',
        path: `https://www.bungie.net/Platform/Destiny2/Milestones/`
      },
      {
        name: 'groups',
        path: `https://www.bungie.net/Platform/GroupV2/User/${membershipType}/${membershipId}/0/1/`
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
      return assign(...promises);
    } catch (error) {
      console.log(error);
    }
  };

  ResultHandler = async (membershipType, membershipId, characterId, displayName) => {
    this.setState({ loading: true });
    let response = await this.ProfileResponse(membershipType, membershipId);

    if (response.profile.ErrorCode !== 1) {
      console.log(response.profile.ErrorCode);
      this.setState({ loading: false, error: response.profile.ErrorCode });
      return;
    }
    if (!response.profile.Response.characterProgressions.data) {
      console.log('privacy');
      this.setState({ loading: false, error: 'privacy' });
      return;
    }

    if (displayName) {
      ls.update('history.profiles', { membershipType: membershipType, membershipId: membershipId, displayName: displayName }, true, 6);
    }

    response = responseUtils.profileScrubber(response);

    this.setState({
      profile: response,
      loading: false,
      error: false
    });
  };

  CharacterSelectHandler = characterId => {
    this.props.setUserReponse(this.state.profile.profile.profile.data.userInfo.membershipType, this.state.profile.profile.profile.data.userInfo.membershipId, characterId, this.state.profile);
  };

  componentDidMount() {
    this.props.setPageDefault('light');
    if (this.props.user.response) {
      this.setState({ profile: this.props.user.response, loading: false });
    } else if (this.props.user.membershipId && !this.state.profile) {
      this.ResultHandler(this.props.user.membershipType, this.props.user.membershipId, this.props.user.characterId);
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    let profileHistory = ls.get('history.profiles') ? ls.get('history.profiles') : [];
    let resultsElement = null;
    let profileElement = null;

    if (this.state.results) {
      resultsElement = (
        <div className='results'>
          <ul className='list'>
            {this.state.results.length > 0 ? (
              this.state.results.map(result => (
                <li className='linked' key={result.membershipId}>
                  <a
                    onClick={e => {
                      this.ResultHandler(result.membershipType, result.membershipId, false, result.displayName);
                    }}
                  >
                    <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
                    {result.displayName}
                  </a>
                </li>
              ))
            ) : (
              <li className='no-profiles'>No profiles found</li>
            )}
          </ul>
        </div>
      );
    } else {
      resultsElement = <div className='results' />;
    }

    const { from } = this.props.location.state || { from: { pathname: '/' } };

    if (this.state.profile) {
      let clan = null;
      if (this.state.profile.groups.results.length === 1) {
        clan = <div className='clan'>{this.state.profile.groups.results[0].group.name}</div>;
      }

      let timePlayed = (
        <div className='timePlayed'>
          {Math.floor(
            Object.keys(this.state.profile.profile.characters.data).reduce((sum, key) => {
              return sum + parseInt(this.state.profile.profile.characters.data[key].minutesPlayedTotal);
            }, 0) / 1440
          )}{' '}
          days on the grind
        </div>
      );

      profileElement = (
        <>
          <div className='user'>
            <div className='info'>
              <div className='displayName'>{this.state.profile.profile.profile.data.userInfo.displayName}</div>
              {clan}
              {timePlayed}
            </div>
            <Characters response={this.state.profile} manifest={this.props.manifest} location={{ ...from }} onCharacterSelect={this.CharacterSelectHandler} />
          </div>
        </>
      );
    }

    let reverse = false;
    if (this.props.viewport.width <= 500) {
      reverse = true;
    }

    let errorNotices = null;
    if (this.state.error) {
      errorNotices = errorHandler(this.state.error);
    }

    return (
      <div className={cx('view', { loading: this.state.loading })} id='get-profile'>
        {reverse ? (
          <div className='profile'>
            {this.state.loading ? <Spinner dark /> : null}
            {profileElement}
          </div>
        ) : null}
        <div className='search'>
          {errorNotices}
          <div className='sub-header'>
            <div>Search for player</div>
          </div>
          <div className='form'>
            <div className='field'>
              <input onInput={this.SearchDestinyPlayer} type='text' placeholder='insert gamertag' spellCheck='false' />
            </div>
          </div>
          <div className='results'>{resultsElement}</div>
          {profileHistory.length > 0 ? (
            <>
              <div className='sub-header'>
                <div>Previous</div>
              </div>
              <div className='results'>
                <ul className='list'>
                  {profileHistory.map(result => (
                    <li className='linked' key={result.membershipId}>
                      <a
                        onClick={e => {
                          this.ResultHandler(result.membershipType, result.membershipId, false, result.displayName);
                        }}
                      >
                        <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`} />
                        {result.displayName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : null}
        </div>
        {!reverse ? (
          <div className='profile'>
            {this.state.loading ? <Spinner dark /> : null}
            {profileElement}
          </div>
        ) : null}
      </div>
    );
  }
}

export default CharacterSelect;
