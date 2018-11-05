import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../Globals';
import ReactMarkdown from 'react-markdown';

import * as destinyEnums from '../destinyEnums';
import * as ls from '../localStorage';


import './SearchPlayer.css';
import './SearchGroups.css';

class SearchGroups extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      results: undefined
    }
  }

  componentDidMount () {

    fetch(
      `https://www.bungie.net/Platform/GroupV2/User/${ this.props.match.params.membershipType }/${ this.props.match.params.membershipId }/0/1/`,
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
          results: SearchResponse.Response.results
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

    console.log(this)

    if (this.state.results) {
      return (
        <div className="SearchGroups">
          <h4>Associations</h4>
          <div className="results">
            <ul className="list">
              { this.state.results.map(result => <li 
              key={result.group.groupId} >
                <Link 
                  to={{
                    pathname: `/clans/${result.group.groupId}`
                  }} >
                  <div className="header" data-members={`${ result.group.memberCount }/${ result.group.features.maximumMembers }`}>
                    <p>{ result.group.name }</p>
                    <p>{ result.group.motto }</p>
                  </div>
                  <ReactMarkdown className="about" source={result.group.about} />
                </Link>
              </li> ) }
            </ul>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="SearchGroups">loading groups</div>
      )
    }

  }




}

export default SearchGroups