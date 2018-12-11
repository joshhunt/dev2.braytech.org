import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import cx from 'classnames';
import assign from 'lodash/assign';
import GoogleAnalytics from './components/GoogleAnalytics';
import packageJSON from '../package.json';
import globals from './utils/globals';
import dexie from './utils/dexie';
import * as ls from './utils/localStorage';

import './Core.css';
import './App.css';

import Header from './components/Header';
import Tooltip from './components/Tooltip';
import Footer from './components/Footer';

import Index from './views/Index';
import CharacterSelect from './views/CharacterSelect';
import Clan from './views/Clan';
import Collections from './views/Collections';
import Triumphs from './views/Triumphs';
import Checklists from './views/Checklists';
import Overview from './views/Overview';
import ThisWeek from './views/ThisWeek';
import Vendors from './views/Vendors';
import Pride from './views/Pride';

class App extends Component {
  constructor() {
    super();
    let user = ls.get('setting.user') ? ls.get('setting.user') : false;
    this.state = {
      user: {
        membershipType: user ? user.membershipType : false,
        membershipId: user ? user.membershipId : false,
        characterId: false,
        response: false
      },
      manifest: {
        state: false,
        progress: {
          total: 0,
          completed: 0
        },
        version: false
      },
      pageDefaut: false
    };
    this.setPageDefault = this.setPageDefault.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
    this.setUserReponse = this.setUserReponse.bind(this);
    this.viewCharacters = this.viewCharacters.bind(this);
    this.getManifestVersion = this.getManifestVersion.bind(this);
    this.getManifest = this.getManifest.bind(this);
    this.manifest = null;
  }

  setPageDefault = className => {
    this.setState({
      pageDefaut: className
    });
  };

  updateViewport = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.setState({
      viewport: {
        width,
        height
      }
    });
  };

  setUserReponse = (membershipType, membershipId, characterId, response) => {
    ls.set('setting.user', {
      membershipType: membershipType,
      membershipId: membershipId,
      characterId: characterId
    });
    this.setState({
      user: {
        membershipType: membershipType,
        membershipId: membershipId,
        characterId: characterId,
        response: response
      }
    });
  };

  viewCharacters = () => {
    let state = this.state;
    state.user.characterId = false;
    this.setState(state);
  };

  getManifestVersion = async () => {
    let state = this.state;
    state.manifest.state = 'version';
    this.setState(state);

    const request = await fetch(`https://api.braytech.org/?request=manifest&get=version`, {
      headers: {
        'X-API-Key': globals.key.braytech
      }
    });
    const response = await request.json();
    return response.response.version;
  };

  getManifest = version => {
    const tables = ['DestinyDestinationDefinition', 'DestinyLoreDefinition', 'DestinyStatDefinition', 'DestinyInventoryBucketDefinition', 'DestinyPlaceDefinition', 'DestinyVendorDefinition', 'DestinyPresentationNodeDefinition', 'DestinyRecordDefinition', 'DestinyProgressionDefinition', 'DestinyCollectibleDefinition', 'DestinyChecklistDefinition', 'DestinyObjectiveDefinition', 'DestinyActivityDefinition', 'DestinyActivityModeDefinition', 'DestinySocketTypeDefinition', 'DestinyStatGroupDefinition', 'DestinySocketCategoryDefinition', 'DestinyInventoryItemDefinition', 'DestinySandboxPerkDefinition'];

    let state = this.state;
    state.manifest.state = 'fetching';
    state.manifest.progress.total = tables.length;
    this.setState(state);

    let fetches = tables.map(table => {
      return fetch(`https://api.braytech.org/cache/json/manifest/${table}.json`, {
        headers: {
          'X-API-Key': globals.key.braytech
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

        dexie
          .table('manifest')
          .clear()
          .then(() => {
            dexie.table('manifest').add({
              version: version,
              value: manifest
            });
          })
          .then(() => {
            dexie
              .table('manifest')
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

    dexie
      .table('manifest')
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
              this.getManifest(version);
            } else {
              dexie
                .table('manifest')
                .toArray()
                .then(manifest => {
                  if (!manifest[0].value.DestinyStatGroupDefinition) {
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
      GoogleAnalytics.init();
    }

    const PrivateRoute = ({ render: Component, ...rest }) => (
      <Route
        {...rest}
        render={props =>
          this.state.user.response && this.state.user.characterId ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: '/character-select',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );

    if (this.manifest === null) {
      if (this.state.manifest.state === 'version') {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>CHECKING DATA</div>
          </div>
        );
      } else if (this.state.manifest.state === 'fetching') {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>FETCHING {Math.ceil((this.state.manifest.progress.completed / this.state.manifest.progress.total) * 100)}%</div>
          </div>
        );
      } else if (this.state.manifest.state === 'almost') {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>SO CLOSE</div>
          </div>
        );
      } else {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>PREPARING</div>
          </div>
        );
      }
    } else {
      return (
        <Router>
          <div className={cx('wrapper', this.state.pageDefaut ? this.state.pageDefaut : null)}>
            <GoogleAnalytics.RouteTracker />
            <div className='main'>
              <Route path='/' render={route => <Header route={route} {...this.state} manifest={this.manifest} />} />
              <Switch>
                <Route path='/character-select' render={route => <CharacterSelect location={route.location} setPageDefault={this.setPageDefault} setUserReponse={this.setUserReponse} user={this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
                <PrivateRoute path='/overview' exact render={() => <Overview {...this.state.user} manifest={this.manifest} />} />
                <PrivateRoute path='/clan' exact render={() => <Clan {...this.state.user} manifest={this.manifest} />} />
                <PrivateRoute path='/checklists' exact render={() => <Checklists {...this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
                <PrivateRoute
                  path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                  render={route => (
                    <>
                      <Collections {...route} {...this.state.user} manifest={this.manifest} />
                      <Tooltip manifest={this.manifest} />
                    </>
                  )}
                />
                <PrivateRoute path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Triumphs {...route} {...this.state.user} manifest={this.manifest} />} />
                <PrivateRoute
                  path='/this-week'
                  exact
                  render={() => (
                    <>
                      <ThisWeek {...this.state.user} manifest={this.manifest} />
                      <Tooltip manifest={this.manifest} />
                    </>
                  )}
                />
                <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} {...this.state.user} manifest={this.manifest} />} />
                <Route path='/pride' exact render={() => <Pride />} />
                <Route path='/' exact render={() => <Index />} />
              </Switch>
            </div>
            <Route path='/' render={route => <Footer route={route} />} />
          </div>
        </Router>
      );
    }
  }
}

export default App;
