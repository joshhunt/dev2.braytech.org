import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import Error from '../Error'
import './Progression.css'
import SearchPlayer from './SearchPlayer';
import LoadPlayer from './LoadPlayer';
import Player from './Player';
import Summaries from './Summaries';
import Checklists from './Checklists';


class Progression extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }

    this.setProfile = this.setProfile.bind(this)
  }

  setProfile = (x, y) => {
    this.setState({
      activeCharacterId: x,
      ProfileResponse: y
    })
    console.log(this.state)
  }

  render() {

    console.log(this.props, this.state)
    
    if (this.state.ProfileResponse) {
      return (
        <BrowserRouter>
          <Switch>
            <Route 
              path="/progression/:membershipType/:membershipId/:characterId?" 
              render={ (route) => 
                <div className="view" id="progression">
                { console.log(route) }
                  <Player data={this.state} route={route} />
                  <Route path={route.match.path} exact render={ () => <Summaries data={this.state} route={route} /> } />
                  <Route path={`${route.match.path}/checklists`} exact render={ () => <Checklists data={this.state} route={route} /> } />
                </div>
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
                <SearchPlayer />
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