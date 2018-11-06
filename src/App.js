import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from './components/Globals';

import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Error from './components/pages/Error';

// index - placeholder
import Index from './components/pages/Index/Index';

// progression
import './components/pages/Progression/Progression.css';
import SearchPlayer from './components/pages/SearchPlayer';
import DisplayProfile from './components/pages/Progression/DisplayProfile';

// clans
import './components/pages/Clans/Clans.css';
import SearchGroups from './components/pages/SearchGroups';
import DisplayGroup from './components/pages/Clans/DisplayGroup';

// xur - placeholder
import Xur from './components/pages/Xur/Xur';

class App extends Component {
  constructor() {
    super();
    this.state = {
      manifest: false
    };
    this.updateViewport = this.updateViewport.bind(this);
  }

  updateViewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      viewport: {
        width,
        height
      }
    });
  }

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);

    fetch(`https://api.braytech.org/?request=manifest&table=DestinyDestinationDefinition,DestinyPlaceDefinition,DestinyPresentationNodeDefinition,DestinyRecordDefinition,DestinyProgressionDefinition,DestinyCollectibleDefinition,DestinyChecklistDefinition,DestinyObjectiveDefinition,DestinyActivityDefinition,DestinyActivityModeDefinition`, {
      headers: {
        'X-API-Key': Globals.key.braytech
      }
    })
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
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {
    if (!this.state.manifest) {
      return (
        <div className="view" id="loading">
          <p>loading app</p>
        </div>
      );
    } else {
      return (
        <BrowserRouter>
          <>
            <Header />
            <Switch>
              <Route path="/" exact render={route => <Index appRoute={route} manifest={this.state.manifest} viewport={this.state.viewport} />} />
              <Route
                path="/progression"
                exact
                render={route => (
                  <div className="view" id="search">
                    <SearchPlayer {...this.props} {...route} />
                  </div>
                )}
              />
              <Route path="/progression/:membershipType/:membershipId/:characterId?/:view?" render={route => <DisplayProfile {...this.props} {...route} manifest={this.state.manifest} viewport={this.state.viewport} />} />
              <Route
                path="/clans/:membershipType/:membershipId"
                render={route => (
                  <div className="view" id="clans">
                    <SearchPlayer {...this.props} {...route} />
                    <SearchGroups {...this.props} {...route} />
                  </div>
                )}
              />
              <Route path="/clans/:groupId" render={route => <DisplayGroup {...this.props} {...route} manifest={this.state.manifest} />} />
              <Route
                path="/clans"
                exact
                render={route => (
                  <div className="view" id="clans">
                    <SearchPlayer {...this.props} {...route} playerSelect={this.playerSelect} />
                  </div>
                )}
              />
              <Route path="/xur" render={route => <Xur appRoute={route} manifest={this.state.manifest} viewport={this.state.viewport} />} />
              <Route component={Error} />
            </Switch>
          </>
        </BrowserRouter>
      );
    }
  }
}

export default App;
