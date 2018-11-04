import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import Error from '../Error'
import './Progression.css'
import SearchPlayer from './SearchPlayer';
import LoadPlayer from './LoadPlayer';
import Player from './Player';
import Summaries from './Summaries/Summaries';
import Checklists from './Checklists/Checklists';


class Progression extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }

    this.changeCharacterIdTo = this.changeCharacterIdTo.bind(this);
    this.setProfile = this.setProfile.bind(this);
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
    
    if (this.state.ProfileResponse) {
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
            <Route 
            path="/progression" 
            render={ (route) => 
              <SearchPlayer route={route} />
            } />
            <Route render={ (route) => <Error /> } />
          </Switch>
        </BrowserRouter>
      )
    }
    else {
      return (
        <BrowserRouter>
          <Switch>
            <Route 
              path="/progression" 
              exact
              render={ (route) => 
                <SearchPlayer route={route} />
              } />
            <Route 
              path="/progression/:membershipType/:membershipId/:characterId?" 
              render={ (route) => 
                <LoadPlayer data={route} set={this.setProfile} />
              } />
            <Route render={ (route) => <Error /> } />
          </Switch>
        </BrowserRouter>
      )
    }
  }
}

export default Progression;