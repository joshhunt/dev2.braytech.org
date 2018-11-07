import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Globals from './components/Globals';

import GA from './GA';

import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Footer from './components/pages/Footer';
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
    
    if (!window.ga) {
      GA.init();
    }

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
              <Route
                path="/"
                exact
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <Index appRoute={route} manifest={this.state.manifest} viewport={this.state.viewport} />
                  </>
                )}
              />
              <Route
                path="/progression"
                exact
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <div className="view progression-search" id="SearchPlayer">
                      <SearchPlayer {...this.props} {...route} path="/progression" />
                    </div>
                  </>
                )}
              />
              <Route path="/progression/:membershipType/:membershipId/:characterId?/:view?" render={route => <DisplayProfile {...this.props} {...route} manifest={this.state.manifest} viewport={this.state.viewport} />} />
              <Route
                path="/clans/:membershipType/:membershipId"
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <div className="view clan-search" id="SearchPlayer">
                      <SearchPlayer {...this.props} {...route} path="/clans" />
                      <SearchGroups {...this.props} {...route} />
                    </div>
                  </>
                )}
              />
              <Route
                path="/clans/:groupId"
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <DisplayGroup {...this.props} {...route} manifest={this.state.manifest} />
                  </>
                )}
              />
              <Route
                path="/clans"
                exact
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <div className="view clan-search" id="SearchPlayer">
                      <SearchPlayer {...this.props} {...route} path="/clans" />
                    </div>
                  </>
                )}
              />
              <Route
                path="/xur"
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <Xur appRoute={route} manifest={this.state.manifest} viewport={this.state.viewport} />
                  </>
                )}
              />
              <Route component={Error} />
            </Switch>
            <Footer />
          </>
        </BrowserRouter>
      );
    }
  }
}

export default App;
