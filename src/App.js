import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from './components/Globals';
import Dexie from 'dexie';


import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Error from './components/pages/Error';
import Progression from './components/pages/Progression/ProgressionRouter';



class App extends Component {

  constructor() {
    super();
    this.state = {
      init: false,
      manifest: null
    }
  }
  
  componentDidMount () {
    
    fetch(
      `https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyPresentationNodeDefinition,DestinyRecordDefinition,DestinyProgressionDefinition,DestinyCollectibleDefinition,DestinyChecklistDefinition`,
      {
        headers: {
          "X-API-Key": Globals.key.braytech,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(manifest => {
  
        this.setState({
          manifest,
          init: true
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

    if (!this.state.init) {
      return (
        <div className="view" id="loading">
          <p>loading app</p>
        </div>
      );
    }
    else {
      console.log(this.state.manifest);
      return (
        <BrowserRouter>
          <>
            <Switch>
              <Route path="/progression" render={()=> <Progression parentState={ this.state } />} />
              <Route component={ Error } />
            </Switch>
          </>
        </BrowserRouter>
      );
    }
  }
}

export default App;