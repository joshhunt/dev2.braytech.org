import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from './components/Globals';


import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Error from './components/pages/Error';
import Progression from './components/pages/Progression/Progression';



class App extends Component {

  constructor() {
    super();
    this.state = {
      manifest: false
    }
    this.updateViewport = this.updateViewport.bind(this);
  }

  updateViewport() {
    let width  = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      viewport: {
        width,
        height
      }
    });
  }
  
  componentDidMount () {

    this.updateViewport();
    window.addEventListener("resize", this.updateViewport);
    
    fetch(
      `https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyPresentationNodeDefinition,DestinyRecordDefinition,DestinyProgressionDefinition,DestinyCollectibleDefinition,DestinyChecklistDefinition,DestinyObjectiveDefinition`,
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
          manifest
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateViewport);
  }

  render() {

    if (!this.state.manifest) {
      return (
        <div className="view" id="loading">
          <p>loading app</p>
        </div>
      );
    }
    else {
      return (
        <BrowserRouter>
          <>
            <Header />
            <Switch>
              <Route path="/progression" render={(route)=> <Progression route={ route } manifest={this.state.manifest} viewport={this.state.viewport} />} />} />
              <Route component={ Error } />
            </Switch>
          </>
        </BrowserRouter>
      );
    }
  }
}

export default App;