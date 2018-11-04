import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../../Globals';

import * as destinyEnums from '../../destinyEnums';
import * as ls from '../../localStorage';


import './SearchPlayer.css';

class SearchPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: undefined
    }

    this.query = this.query.bind(this);
    this.playerSelect = this.playerSelect.bind(this);
  }

  query = (e) => {
    
    let membershipType = "-1"
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {

      fetch(
        `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${ membershipType }/${ displayName }/`,
        {
          headers: {
            "X-API-Key": Globals.key.bungie,
          }
        }
      )
      .then(response => {
        return response.json();
      })
        .then(SearchResponse => {
    
          this.setState({
            results: SearchResponse.Response
          })
  
        })
      .catch(error => {
        console.log(error);
      })




    }, 1000);
  }

  playerSelect = (e) => {
    ls.update("profileHistory", e.currentTarget.dataset, true, 6);
    this.props.route.history.push(`/progression/${e.currentTarget.dataset.membershiptype}/${e.currentTarget.dataset.membershipid}`);
  }

  render() {

    let profileHistory = ls.get("profileHistory") ? ls.get("profileHistory") : [];

    if (this.state.results) {
      return (
        <div className="view" id="search">
          <div className="frame">
            <h4>Search for player</h4>
            <div className="form">
              <div className="field">
                <input onInput={this.query} type="text" placeholder="justrealmilk" spellCheck="false" />
              </div>
            </div>
            <div className="results">
              <ul className="list">{ this.state.results.length > 0 ? this.state.results.map(result => <li 
                key={result.membershipId} 
                data-membershiptype={result.membershipType} 
                data-membershipid={result.membershipId}
                data-displayname={result.displayName} 
                onClick={this.playerSelect}>
                  <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`}></span>{result.displayName}
                </li>) : <li>No profiles found</li> }</ul>
            </div>
            { profileHistory.length > 0 ? 
              <>
                <h4>Previous searches</h4>
                <div className="results">
                  <ul className="list">
                    { profileHistory.map(result => <li 
                key={result.membershipid} 
                data-membershiptype={result.membershiptype} 
                data-membershipid={result.membershipid}
                data-displayname={result.displayname} 
                onClick={this.playerSelect}>
                      <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershiptype].toLowerCase()}`}></span>{result.displayname}
                    </li> ) }
                  </ul>
                </div>
              </>
             : ``}
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="view" id="search">
          <div className="frame">
            <h4>Search for player</h4>
            <div className="form">
              <div className="field">
                <input onInput={this.query} type="text" placeholder="justrealmilk" spellCheck="false" />
              </div>
            </div>
            <div className="results"></div>
            { profileHistory.length > 0 ? 
              <>
                <h4>Previous searches</h4>
                <div className="results">
                  <ul className="list">
                    { profileHistory.map(result => <li 
                key={result.membershipid} 
                data-membershiptype={result.membershiptype} 
                data-membershipid={result.membershipid}
                data-displayname={result.displayname} 
                onClick={this.playerSelect}>
                      <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershiptype].toLowerCase()}`}></span>{result.displayname}
                    </li> ) }
                  </ul>
                </div>
              </>
             : ``}
          </div>
        </div>
      )
    }

  }




}

export default SearchPlayer