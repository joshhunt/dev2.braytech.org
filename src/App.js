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
import Settings from './views/Settings';
import Pride from './views/Pride';
import Credits from './views/Credits';
import Tools from './views/Tools';
import ClanBannerBuilder from './views/Tools/ClanBannerBuilder';
import i18n from './utils/i18n';
import { withNamespaces } from 'react-i18next';

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
        response: response
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

        // console.log(response)

        // let state = this.state;
        // state.manifest.settings = response.settings;
        // this.setState(state);
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
                    let state = this.state;
                    state.manifest.state = 'ready';
                    this.setState(state);
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
    const { t } = this.props;
    if (!window.ga) {
      GoogleAnalytics.init();
    }

    // const ProfileRoute = ({ render: Component, ...rest }) => (
    //   <Route
    //     {...rest}
    //     render={props =>
    //       this.state.user.response && this.state.user.characterId ? (
    //         <Component {...props} />
    //       ) : (
    //         <Redirect
    //           to={{
    //             pathname: '/character-select',
    //             state: { from: props.location }
    //           }}
    //         />
    //       )
    //     }
    //   />
    // );

    if (this.state.manifest.state !== 'ready') {
      if (this.state.manifest.state === 'error') {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>{t('ERROR')}</div>
          </div>
        );
      } else if (this.state.manifest.state === 'version') {
        return (
          <div className='view' id='loading'>
            <div className='logo-feature'>
              <div className='device'>
                <span className='destiny-clovis_bray_device' />
              </div>
            </div>
            <h4>Braytech {packageJSON.version}</h4>
            <div className='download'>{t('CHECKING DATA')}</div>
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
            <div className='download'>{t('DOWNLOADING MANIFEST DATA')}</div>
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
            <div className='download'>{t('SO CLOSE')}</div>
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
            <div className='download'>{t('PREPARING')}</div>
          </div>
        );
      }
    } else {
      if (this.state.user.response && this.state.user.characterId) {
        return (
          <Router>
            <div className={cx('wrapper', this.state.pageDefaut ? this.state.pageDefaut : null)}>
              <GoogleAnalytics.RouteTracker />
              <div className='main'>
                <Route path='/' render={route => <Header route={route} {...this.state} manifest={this.manifest} />} />
                <Switch>
                  <Route path='/character-select' render={route => <CharacterSelect location={route.location} setPageDefault={this.setPageDefault} setUserReponse={this.setUserReponse} user={this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
                  <Route path='/overview' exact render={() => <Overview {...this.state.user} manifest={this.manifest} />} />
                  <Route path='/clan/:view?/:subView?' exact render={route => <Clan {...this.state.user} manifest={this.manifest} view={route.match.params.view} subView={route.match.params.subView} />} />
                  <Route path='/checklists' exact render={() => <Checklists {...this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
                  <Route
                    path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                    render={route => (
                      <>
                        <Collections {...route} {...this.state.user} manifest={this.manifest} />
                        <Tooltip manifest={this.manifest} />
                      </>
                    )}
                  />
                  <Route path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={route => <Triumphs {...route} {...this.state.user} manifest={this.manifest} />} />
                  <Route
                    path='/this-week'
                    exact
                    render={() => (
                      <>
                        <ThisWeek {...this.state.user} manifest={this.manifest} />
                        <Tooltip manifest={this.manifest} />
                      </>
                    )}
                  />
                  <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} {...this.state.user} setPageDefault={this.setPageDefault} manifest={this.manifest} />} />
                  <Route path='/settings' exact render={() => <Settings {...this.state.user} manifest={this.manifest} availableLanguages={this.availableLanguages} setPageDefault={this.setPageDefault} />} />
                  <Route path='/pride' exact render={() => <Pride setPageDefault={this.setPageDefault} />} />
                  <Route path='/credits' exact render={() => <Credits setPageDefault={this.setPageDefault} />} />
                  <Route path='/tools' exact render={() => <Tools setPageDefault={this.setPageDefault} />} />
                  <Route path='/tools/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} setPageDefault={this.setPageDefault} />} />
                  <Route path='/' exact render={() => <Index setPageDefault={this.setPageDefault} />} />
                </Switch>
              </div>
              <Route path='/' render={route => <Footer route={route} />} />
            </div>
          </Router>
        );
      } else {
        return (
          <Router>
            <div className={cx('wrapper', this.state.pageDefaut ? this.state.pageDefaut : null)}>
              <GoogleAnalytics.RouteTracker />
              <div className='main'>
                <Route path='/' render={route => <Header route={route} {...this.state} manifest={this.manifest} />} />
                <Switch>
                  <Route path='/character-select' render={route => <CharacterSelect location={route.location} setPageDefault={this.setPageDefault} setUserReponse={this.setUserReponse} user={this.state.user} viewport={this.state.viewport} manifest={this.manifest} />} />
                  <Route
                    path='/overview'
                    exact
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route
                    path='/clan/:view?/:subView?'
                    exact
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route
                    path='/checklists'
                    exact
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route
                    path='/collections/:primary?/:secondary?/:tertiary?/:quaternary?'
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route
                    path='/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?'
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route
                    path='/this-week'
                    exact
                    render={route => (
                      <Redirect
                        to={{
                          pathname: '/character-select',
                          state: { from: route.location }
                        }}
                      />
                    )}
                  />
                  <Route path='/vendors/:hash?' exact render={route => <Vendors vendorHash={route.match.params.hash} setPageDefault={this.setPageDefault} manifest={this.manifest} />} />
                  <Route path='/settings' exact render={() => <Settings {...this.state.user} manifest={this.manifest} availableLanguages={this.availableLanguages} setPageDefault={this.setPageDefault} />} />
                  <Route path='/pride' exact render={() => <Pride setPageDefault={this.setPageDefault} />} />
                  <Route path='/credits' exact render={() => <Credits setPageDefault={this.setPageDefault} />} />
                  <Route path='/tools' exact render={() => <Tools setPageDefault={this.setPageDefault} />} />
                  <Route path='/tools/clan-banner-builder/:decalBackgroundColorId?/:decalColorId?/:decalId?/:gonfalonColorId?/:gonfalonDetailColorId?/:gonfalonDetailId?/:gonfalonId?/' exact render={route => <ClanBannerBuilder {...route} setPageDefault={this.setPageDefault} />} />
                  <Route path='/' exact render={() => <Index setPageDefault={this.setPageDefault} />} />
                </Switch>
              </div>
              <Route path='/' render={route => <Footer route={route} />} />
            </div>
          </Router>
        );
      }
    }
  }
}

export default withNamespaces()(App);
