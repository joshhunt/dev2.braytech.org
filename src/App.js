import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import cx from 'classnames';
import assign from 'lodash/assign';
import GoogleAnalytics from './components/GoogleAnalytics';
import globals from './utils/globals';
import dexie from './utils/dexie';
import * as ls from './utils/localStorage';
import { withNamespaces } from 'react-i18next';
import './utils/i18n';

import './Core.css';
import './App.css';

import Loading from './components/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import Notifications from './components/Notifications';

import CharacterRoutes from './CharacterRoutes';

import Index from './views/Index';
import CharacterSelect from './views/CharacterSelect';
import Settings from './views/Settings';
import Pride from './views/Pride';
import Credits from './views/Credits';
import Tools from './views/Tools';
import ClanBannerBuilder from './views/Tools/ClanBannerBuilder';

import UserContext from './UserContext';

class App extends Component {
  constructor(props) {
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
        version: false,
        settings: false
      },
      pageDefaut: false
    };

    this.setPageDefault = this.setPageDefault.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
    this.setUserReponse = this.setUserReponse.bind(this);
    this.viewCharacters = this.viewCharacters.bind(this);
    this.getVersionAndSettings = this.getVersionAndSettings.bind(this);
    this.getManifest = this.getManifest.bind(this);
    this.manifest = {};
    this.bungieSettings = {};
    this.currentLanguage = props.i18n.getCurrentLanguage();
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
        response: response,
        urlPrefix: `/u/${membershipType}/${membershipId}/${characterId}`
      }
    });
  };

  viewCharacters = () => {
    let state = this.state;
    state.user.characterId = false;
    this.setState(state);
  };

  getVersionAndSettings = () => {
    const paths = [
      {
        name: 'manifest',
        url: 'https://www.bungie.net/Platform/Destiny2/Manifest/'
      },
      {
        name: 'settings',
        url: 'https://www.bungie.net/Platform/Settings/'
      }
    ];

    let requests = paths.map(path => {
      return fetch(path.url, {
        headers: {
          'X-API-Key': globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(response => {
          if (response.ErrorCode === 1) {
            let object = {};
            object[path.name] = response.Response;
            return object;
          }
        });
    });

    return Promise.all(requests)
      .then(responses => {
        const response = assign(...responses);
        this.bungieSettings = response.settings;

        let availableLanguages = [];
        for (var i in response.manifest.jsonWorldContentPaths) {
          availableLanguages.push(i);
        }
        this.availableLanguages = availableLanguages;
        return response.manifest.jsonWorldContentPaths[this.currentLanguage];
      })
      .catch(error => {
        console.log(error);
      });
  };

  getManifest = version => {
    let state = this.state;
    state.manifest.version = version;
    state.manifest.state = 'fetching';
    this.setState(state);

    let manifest = async () => {
      const request = await fetch(`https://www.bungie.net${version}`);
      const response = await request.json();
      return response;
    };

    manifest()
      .then(manifest => {
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
                this.manifest.settings = this.bungieSettings;
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
        this.getVersionAndSettings()
          .then(version => {
            if (version !== this.state.manifest.version) {
              this.getManifest(version);
            } else {
              dexie
                .table('manifest')
                .toArray()
                .then(manifest => {
                  if (manifest.length > 0) {
                    this.manifest = manifest[0].value;
                    this.manifest.settings = this.bungieSettings;
                    this.setState({
                      manifest: {
                        ...this.state.manifest,
                        state: 'ready'
                      }
                    });
                  } else {
                    console.log('something is wrong');
                    let state = this.state;
                    state.manifest.state = 'error';
                    this.setState(state);
                  }
                });
            }
          })
          .catch(error => {
            console.log(error);
            let state = this.state;
            state.manifest.state = 'error';
            this.setState(state);
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

    if (this.state.manifest.state !== 'ready') {
      return <Loading state={this.state.manifest.state} />;
    }

    return (
      <UserContext.Provider value={this.state.user}>
        <Router>
          <div className={cx('wrapper', this.state.pageDefaut ? this.state.pageDefaut : null)}>
            <Route path='/' render={route => <Notifications updateAvailable={this.props.updateAvailable} />} />

            <div className='main'>
              <Route path='/' render={route => <Header route={route} {...this.state} manifest={this.manifest} />} />

              <Route path='/' exact render={() => <Index setPageDefault={this.setPageDefault} />} />
              <Route path='/character-select' render={route => <CharacterSelect route={route} setPageDefault={this.setPageDefault} setUserReponse={this.setUserReponse} user={this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
              <Route path='/settings' exact render={() => <Settings {...this.state.user} manifest={this.manifest} availableLanguages={this.availableLanguages} setPageDefault={this.setPageDefault} />} />
              <Route path='/pride' exact render={() => <Pride setPageDefault={this.setPageDefault} />} />
              <Route path='/credits' exact render={() => <Credits setPageDefault={this.setPageDefault} />} />
              <Route path='/tools' exact render={() => <Tools setPageDefault={this.setPageDefault} />} />
              <Route path='/tools/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} setPageDefault={this.setPageDefault} />} />

              <Route path='/u/:membershipType/:membershipId/:characterId' render={route => <CharacterRoutes route={route} user={this.state.user} setUserReponse={this.setUserReponse} viewport={this.state.viewport} manifest={this.manifest} />} />
            </div>

            <Route path='/' render={route => <Footer route={route} />} />
          </div>
        </Router>
      </UserContext.Provider>
    );
  }
}

export default withNamespaces()(App);
