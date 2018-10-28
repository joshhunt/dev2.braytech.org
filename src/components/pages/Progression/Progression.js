import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import Characters from './Characters';


class Progression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ProfileResponse: undefined
    }
  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.membershipType }/Profile/${ this.props.membershipId }/?components=100,104,200,202,204,205,800,900`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(ProfileResponse => {
  
        ProfileResponse.Response.characters.data = Object.values(ProfileResponse.Response.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

        this.setState({
          ProfileResponse: ProfileResponse.Response
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

    console.log(this.props, this.state)

    if (!this.state.ProfileResponse) {
      return (
        <div className="view" id="loading">
          <p>loading user</p>
        </div>
      );
    }
    else {
      return (
        <div className="view" id="progression">
          <Characters data={this.state} />
        </div>
      );
    }
  }
}

export default Progression;