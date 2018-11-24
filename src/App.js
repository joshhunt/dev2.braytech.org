import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import cx from 'classnames';
import assign from 'lodash/assign';

import Globals from './components/Globals';
import db from './components/db';
import ObservedImage from './components/ObservedImage';
import GA from './GA';

import './Core.css';
import './App.css';

import Header from './components/pages/Header';
import Footer from './components/pages/Footer';
import ErrorHandler from './components/pages/ErrorHandler';

// index
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
      manifest: {
        state: false,
        progress: {
          total: 0,
          completed: 0
        },
        version: undefined
      }
    };
    this.updateViewport = this.updateViewport.bind(this);
    this.getManifestVersion = this.getManifestVersion.bind(this);
    this.getManifest = this.getManifest.bind(this);
    this.manifest = null;
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

  getManifestVersion = async () => {
    let state = this.state;
    state.manifest.state = 'version';
    this.setState(state);

    const request = await fetch(`https://api.braytech.org/?request=manifest&get=version`, {
      headers: {
        'X-API-Key': Globals.key.braytech
      }
    });
    const response = await request.json();
    return response.response.version;
  };

  getManifest = () => {
    const tables = ['DestinyDestinationDefinition', 'DestinyPlaceDefinition', 'DestinyPresentationNodeDefinition', 'DestinyRecordDefinition', 'DestinyProgressionDefinition', 'DestinyCollectibleDefinition', 'DestinyChecklistDefinition', 'DestinyObjectiveDefinition', 'DestinyActivityDefinition', 'DestinyActivityModeDefinition', 'DestinySocketTypeDefinition', 'DestinySocketCategoryDefinition', 'DestinyInventoryItemDefinition', 'DestinySandboxPerkDefinition'];

    let state = this.state;
    state.manifest.state = 'fetching';
    state.manifest.progress.total = tables.length;
    this.setState(state);

    let fetches = tables.map(table => {
      return fetch(`https://api.braytech.org/cache/json/manifest/${table}.json`, {
        headers: {
          'X-API-Key': Globals.key.braytech
        }
      })
        .then(response => {
          return response.json();
        })
        .then(fetch => {
          let state = this.state;
          state.manifest.progress.completed += 1;
          this.setState(state);

          let object = {};
          object[table] = fetch;
          return object;
        });
    });

    Promise.all(fetches)
      .then(promises => {
        const manifest = assign(...promises);

        console.log(manifest);

        let state = this.state;
        state.manifest.state = 'almost';
        this.setState(state);

        db.table('manifest')
          .clear()
          .then(() => {
            db.table('manifest').add({
              version: this.state.manifest.version,
              value: manifest
            });
          })
          .then(() => {
            db.table('manifest')
              .toArray()
              .then(manifest => {
                this.manifest = manifest[0].value;
                let state = this.state;
                state.manifest.state = 'ready';
                this.setState(state);
              });
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.updateViewport();
    window.addEventListener('resize', this.updateViewport);

    db.table('manifest')
      .toArray()
      .then(manifest => {
        if (manifest.length > 0) {
          let state = this.state;
          state.manifest.version = manifest[0].version;
          this.setState(state);
        }
      })
      .then(() => {
        this.getManifestVersion()
          .then(version => {
            if (version !== this.state.manifest.version) {
              let state = this.state;
              state.manifest.version = version;
              this.setState(state);
              this.getManifest();
            } else {
              db.table('manifest')
                .toArray()
                .then(manifest => {
                  if (!manifest[0].value.DestinySandboxPerkDefinition) {
                    console.log('missing table! lol.');
                    this.getManifest();
                  } else {
                    this.manifest = manifest[0].value;
                    let state = this.state;
                    state.manifest.state = 'ready';
                    this.setState(state);
                  }
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {
    if (!window.ga) {
      GA.init();
    }

    if (this.state.manifest.state === 'version') {
      return (
        <div className="view" id="loading">
          <ObservedImage className={cx('image')} src="/static/images/braytech.png" />
          <h4>Braytech</h4>
          <div className="download">CHECKING DATA</div>
        </div>
      );
    } else if (this.state.manifest.state === 'fetching') {
      return (
        <div className="view" id="loading">
          <ObservedImage className={cx('image')} src="/static/images/braytech.png" />
          <h4>Braytech</h4>
          <div className="download">FETCHING {Math.ceil((this.state.manifest.progress.completed / this.state.manifest.progress.total) * 100)}%</div>
        </div>
      );
    } else if (this.state.manifest.state === 'almost') {
      return (
        <div className="view" id="loading">
          <ObservedImage className={cx('image')} src="/static/images/braytech.png" />
          <h4>Braytech</h4>
          <div className="download">SO CLOSE</div>
        </div>
      );
    } else if (this.manifest !== null) {
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
                    <Index appRoute={route} manifest={this.manifest} viewport={this.state.viewport} />
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
              <Route path="/progression/:membershipType/:membershipId/:characterId?/:view?/:primary?/:secondary?/:tertiary?/:quaternary?" render={route => <DisplayProfile {...this.props} {...route} manifest={this.manifest} viewport={this.state.viewport} />} />
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
                    <DisplayGroup {...this.props} {...route} manifest={this.manifest} />
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
              {/* <Route
                path="/xur"
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <Xur appRoute={route} manifest={this.manifest} viewport={this.state.viewport} />
                  </>
                )}
              /> */}
              <Route
                path="/checklists"
                render={route => (
                  <>
                    <GA.RouteTracker />
                    <Redirect to="/progression" />
                  </>
                )}
              />
              <Route component={ErrorHandler} />
            </Switch>
            <Footer />
          </>
        </BrowserRouter>
      );
    } else {
      return (
        <div className="view" id="loading">
          <ObservedImage className={cx('image')} src="/static/images/braytech.png" />
          <h4>Braytech</h4>
          <div className="download">PREPARING</div>
        </div>
      );
    }
  }
}

export default App;
