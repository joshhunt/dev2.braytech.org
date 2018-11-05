import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from './components/Globals';


import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Error from './components/pages/Error';
import Index from './components/pages/Index/Index';
import Progression from './components/pages/Progression/Progression';
import Clans from './components/pages/Clans/Clans';
import Xur from './components/pages/Xur/Xur';



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
      `https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyPresentationNodeDefinition,DestinyRecordDefinition,DestinyProgressionDefinition,DestinyCollectibleDefinition,DestinyChecklistDefinition,DestinyObjectiveDefinition,DestinyActivityDefinition,DestinyActivityModeDefinition`,
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
              <Route path="/" exact render={(route)=> <Index appRoute={ route } manifest={this.state.manifest} viewport={this.state.viewport} />} />} />
              <Route path="/progression" render={(route)=> <Progression appRoute={ route } manifest={this.state.manifest} viewport={this.state.viewport} />} />} />
              <Route path="/clans" render={(route)=> <Clans appRoute={ route } manifest={this.state.manifest} viewport={this.state.viewport} />} />} />
              <Route path="/xur" render={(route)=> <Xur appRoute={ route } manifest={this.state.manifest} viewport={this.state.viewport} />} />} />
              <Route component={ Error } />
            </Switch>
          </>
        </BrowserRouter>
      );
    }
  }
}

export default App;