import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../Globals';

import * as destinyEnums from '../destinyEnums';
import * as ls from '../localStorage';


import './SearchPlayer.css';

class SearchPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: undefined
    }

    this.query = this.query.bind(this);
  }

  query = (e) => {
    
    let membershipType = "-1"
    let displayName = e.target.value;

    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(() => {

      fetch(
        `https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/${ membershipType }/${ encodeURIComponent(displayName) }/`,
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
      });




    }, 1000);
  }

  render() {

    let profileHistory = ls.get("profileHistory") ? ls.get("profileHistory") : [];

    let searchResults = null;

    if (this.state.results) {
      
      searchResults = <div className="results">
          <ul className="list">{ this.state.results.length > 0 ? this.state.results.map(result => <li 
            key={result.membershipId} >
              <Link 
                to={{
                  pathname: `${this.props.path}/${result.membershipType}/${result.membershipId}`,
                  state: {
                    
                  }
                }} 
                onClick={ (e) => { ls.update("profileHistory", e.currentTarget.dataset, true, 6); } } 
                data-membershiptype={result.membershipType} 
                data-membershipid={result.membershipId}
                data-displayname={result.displayName} >
                <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershipType].toLowerCase()}`}></span>{result.displayName}
              </Link>
            </li>) : <li>No profiles found</li> }</ul>
        </div>

    }
    else {

      searchResults = <div className="results"></div>

    }

    return (
      <div className="SearchPlayer">
        <div className="frame">
          <h4>Search for player</h4>
          <div className="form">
            <div className="field">
              <input onInput={this.query} type="text" placeholder="justrealmilk" spellCheck="false" />
            </div>
          </div>
          <div className="results">
            {searchResults}
          </div>
          { profileHistory.length > 0 ? 
            <>
              <h4>Previous searches</h4>
              <div className="results">
                <ul className="list">
                  { profileHistory.map(result => <li 
                  key={result.membershipid} >
                    <Link 
                      to={{
                        pathname: `${this.props.path}/${result.membershiptype}/${result.membershipid}`,
                        state: {
                          
                        }
                      }} 
                      onClick={ (e) => { ls.update("profileHistory", e.currentTarget.dataset, true, 6); } }
                      data-membershiptype={result.membershiptype} 
                      data-membershipid={result.membershipid}
                      data-displayname={result.displayname} >
                      <span className={`destiny-platform_${destinyEnums.PLATFORMS[result.membershiptype].toLowerCase()}`}></span>{result.displayname}
                    </Link>
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

export default SearchPlayer