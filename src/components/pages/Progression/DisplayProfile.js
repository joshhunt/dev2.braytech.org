import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from '../../Globals';
import * as ls from '../../localStorage';

import Error from '../Error'
import './Progression.css'
import Player from './Player';
import Summaries from './Summaries/Summaries';
import Checklists from './Checklists/Checklists';


class DisplayProfile extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }

    this.changeCharacterIdTo = this.changeCharacterIdTo.bind(this);
    this.setProfile = this.setProfile.bind(this);
  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.match.params.membershipType }/Profile/${ this.props.match.params.membershipId }/?components=100,104,200,202,204,205,800,900`,
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

        let route = this.props
        let characterId = ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length === 1 ? route.match.params.characterId : ProfileResponse.Response.characters.data[0].characterId
        
        let view = route.match.params.view
        if (!route.match.params.characterId || ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length < 1) {
          
          if (route.match.params.characterId) {
            view = route.match.params.characterId
          }
        }

        route.history.replace(`/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${characterId}${view ? `/${view}`:``}`);

        this.setState({
          activeCharacterId: characterId,
          ProfileResponse: ProfileResponse.Response
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  changeCharacterIdTo = (characterId, props) => {
    console.log(characterId, props);
    props.route.history.push(`/progression/${props.route.match.params.membershipType}/${props.route.match.params.membershipId}/${characterId}${props.route.match.params.view ? `/${props.route.match.params.view}`:``}`);
    this.setState({
      activeCharacterId: characterId
    });
  }

  setProfile = (x, y) => {
    this.setState({
      activeCharacterId: x,
      ProfileResponse: y
    });
  }

  render() {
    console.log(this);
    
    if (!this.state.ProfileResponse) {
      return (
        <div className="view" id="loading">
          <p>loading user</p>
        </div>        
      )
    }
    else {
      return (
        <BrowserRouter>
          <Switch>
            <Route 
              path="/progression/:membershipType/:membershipId/:characterId/:view?" 
              render={ (route) => 
                <div className="view" id="progression">
                  <Player data={this.state} route={route} changeCharacterIdTo={this.changeCharacterIdTo} setProfile={this.setProfile} />
                  <Route path="/progression/:membershipType/:membershipId/:characterId" exact render={ () => <Summaries state={this.state} manifest={this.props.manifest} route={route} /> } />
                  <Route path="/progression/:membershipType/:membershipId/:characterId/checklists" exact render={ () => <Checklists state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} /> } />
                </div>
              } />
            <Route render={ (route) => <Error /> } />
          </Switch>
        </BrowserRouter>
      )      
    }


  }
}

export default DisplayProfile;