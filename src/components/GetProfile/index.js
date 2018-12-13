/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import assign from 'lodash/assign';
import Characters from '../Characters';

import globals from '../../utils/globals';
import * as responseUtils from '../../utils/responseUtils';
import * as destinyEnums from '../../utils/destinyEnums';
import * as ls from '../../utils/localStorage';
import errorHandler from '../../utils/errorHandler';

import './styles.css';

class GetProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: false,
      profile: false,
      loading: true
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
      this.setState({ loading: false });
      return;
    }
    if (!response.profile.Response.characterProgressions.data) {
      console.log('privacy');
      this.setState({ loading: false });
      return;
    }

    if (displayName) {
      ls.update('history.profiles', { membershipType: membershipType, membershipId: membershipId, displayName: displayName }, true, 6);
    }

    response = responseUtils.profileScrubber(response);

    this.setState({
      profile: response
    });

    this.setState({ loading: false });

    //this.props.setUserReponse(membershipType, membershipId, characterId, response);
  };

  CharacterSelectHandler = characterId => {
    console.log(characterId);
    this.props.setUserReponse(this.state.profile.profile.profile.data.userInfo.membershipType, this.state.profile.profile.profile.data.userInfo.membershipId, characterId, this.state.profile);
  };

  componentDidMount() {
    if (this.props.user.response) {
      this.setState({ profile: this.props.user.response, loading: false });
    } else if (this.props.user && !this.state.profile) {
      this.ResultHandler(this.props.user.membershipType, this.props.user.membershipId, this.props.user.characterId);
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    let profileHistory = ls.get('history.profiles') ? ls.get('history.profiles') : [];
    let resultsElement = null;
    let profileElement = null;

    console.log(this);

    if (this.state.loading) {
      return <>loading lol</>;
    } else {
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
                <li>No profiles found</li>
              )}
            </ul>
          </div>
        );
      } else {
        resultsElement = <div className='results' />;
      }

      if (this.state.profile) {
        profileElement = <Characters response={this.state.profile} manifest={this.props.manifest} onCharacterSelect={this.CharacterSelectHandler} />;
      }

      return (
        <div className='view' id='get-profile'>
          <div className='background' />
          <div className='search'>
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
            ) : (
              ``
            )}
          </div>
          <div className='profile'>{profileElement}</div>
        </div>
      );
    }
  }
}

export default GetProfile;
