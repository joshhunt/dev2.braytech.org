import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import './Progression.css'
import Player from './Player';
import Summaries from './Summaries';
import Checklists from './Checklists';


class Progression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCharacterId: this.props.characterId,
      ProfileResponse: undefined
    }

    this.changeCharacterIdTo = this.changeCharacterIdTo.bind(this)
  }

  changeCharacterIdTo = (e) => {
    this.setState({
      activeCharacterId: e.currentTarget.dataset.id
    })
  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.route.match.params.membershipType }/Profile/${ this.props.route.match.params.membershipId }/?components=100,104,200,202,204,205,800,900`,
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
          activeCharacterId: this.state.activeCharacterId ? this.state.activeCharacterId : ProfileResponse.Response.characters.data[0].characterId,
          ProfileResponse: ProfileResponse.Response
        });

        this.props.route.history.push(`/progression/${ this.state.ProfileResponse.profile.data.userInfo.membershipType }/${ this.state.ProfileResponse.profile.data.userInfo.membershipId }/${ this.state.activeCharacterId }/`);

        console.log(this.state)

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

    console.log(this.props)

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
          <Player data={this.state} />
          <BrowserRouter>
            <Switch>
              <Route 
                path="/progression/:membershipType/:membershipId/:characterId/checklists" 
                render={ (route) => 
                  <Checklists data={this.state} />
                } />
              <Route 
                path="/progression/:membershipType/:membershipId/:characterId" 
                render={ (route) => 
                  <Summaries data={this.state} />
                } />
              <Route component={ Error } />
            </Switch>
          </BrowserRouter>
        </div>
      );
    }
  }
}

export default Progression;