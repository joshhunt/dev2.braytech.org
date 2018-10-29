import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import './Progression.css'
import Characters from './Characters';
import Summaries from './Summaries';
import Checklists from './Checklists';


class Progression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progressionProps: this.props,
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
          activeCharacterId: this.state.activeCharacterId ? this.state.activeCharacterId : ProfileResponse.Response.characters.data[0].characterId,
          ProfileResponse: ProfileResponse.Response
        });

        console.log(this.state)

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

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
          <BrowserRouter>
            <Switch>
              <Route 
                path="/progression/:membershipType/:membershipId/:characterId/checklists/:list?" 
                render={ (route) => 
                  <>
                    <Characters data={this.state} changeCharacterIdTo={this.changeCharacterIdTo} />
                    <Checklists data={this.state} list={route.match.params.list} />
                  </>
                } />
              <Route 
                path="/progression/:membershipType/:membershipId/:characterId?" 
                render={ (route) => 
                  <>
                    <Characters data={this.state} changeCharacterIdTo={this.changeCharacterIdTo} />
                    <Summaries data={this.state} />
                  </>
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