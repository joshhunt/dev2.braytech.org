import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../../Globals';



class SearchPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: undefined
    }

    this.query = this.query.bind(this)
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


  render() {

    console.log(this.state)

    if (this.state.results) {
      return (
        <div className="view" id="search">
          <h4>Search for player</h4>
          <div className="form">
            <div className="field">
              <input onInput={this.query} type="text" placeholder="justrealmilk" spellCheck="false" />
            </div>
          </div>
          <div className="results">
            <ul>{ this.state.results.map(result => <li key={result.membershipId}>
                <Link to={`/progression/${result.membershipType}/${result.membershipId}/`}>{result.displayName}</Link>
              </li>) }</ul>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="view" id="search">
          <h4>Search for player</h4>
          <div className="form">
            <div className="field">
              <input onInput={this.query} type="text" placeholder="justrealmilk" spellCheck="false" />
            </div>
          </div>
          <div className="results">
            <ul></ul>
          </div>
        </div>
      )
    }

  }




}

export default SearchPlayer