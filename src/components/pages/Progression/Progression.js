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
            path="/progression/:membershipType/:membershipId" 
            exact
            render={ (route) => 
              <LoadPlayer data={route} set={this.setProfile} />
            } />
          <Route 
            path="/progression/:membershipType/:membershipId/:characterId/checklists" 
            render={ (route) => 
              <div className="view" id="progression">
                <Player data={this.state} />
                <Checklists data={this.state} />
              </div>
            } />
          <Route 
            path="/progression/:membershipType/:membershipId/:characterId" 
            render={ (route) => 
              <div className="view" id="progression">
                <Player data={this.state} />
                <Summaries data={this.state} />
              </div>
            } />
          <Route render={ (route) => <Error /> } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Progression;