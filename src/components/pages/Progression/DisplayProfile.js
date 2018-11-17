import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from '../../Globals';
import GA from '../../../GA';
import * as ls from '../../localStorage';

import ErrorHandler from '../ErrorHandler';
import './Progression.css';
import Player from './Player';
import { Almost, Checklists as ChecklistsSummary, Seals, Ranks } from './Summaries/Summaries';
import Checklists from './Checklists/Checklists';
import './PresentationNode.css';
import Triumphs from './Triumphs/Triumphs';
import Collections from './Collections/Collections';

class DisplayProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.askBungie = this.askBungie.bind(this);
    this.goToProgression = this.goToProgression.bind(this);
  }

  askBungie = () => {
    return fetch(`https://www.bungie.net/Platform/Destiny2/${this.props.match.params.membershipType}/Profile/${this.props.match.params.membershipId}/?components=100,104,200,202,204,205,800,900`, {
      headers: {
        'X-API-Key': Globals.key.bungie
      }
    })
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {

    this.askBungie()
      .then(ProfileResponse => {
        if (!ProfileResponse.Response.characterProgressions.data) {
          throw new SyntaxError('privacy');
        }

        ProfileResponse.Response.characters.data = Object.values(ProfileResponse.Response.characters.data).sort(function(a, b) {
          return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
        });

        let route = this.props;
        let characterId = ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length === 1 ? route.match.params.characterId : ProfileResponse.Response.characters.data[0].characterId;

        let view = route.match.params.view;
        if (!route.match.params.characterId || ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length < 1) {
          if (route.match.params.characterId) {
            view = route.match.params.characterId;
          }
        }

        let primary = route.match.params.primary;
        let secondary = route.match.params.secondary;
        let tertiary = route.match.params.tertiary;

        route.history.replace(`/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${characterId}${view ? `/${view}` : ``}${primary ? `/${primary}` : ``}${secondary ? `/${secondary}` : ``}${tertiary ? `/${tertiary}` : ``}`);

        this.setState({
          ProfileResponse: ProfileResponse.Response
        });
      })
      .catch(error => {
        this.setState({
          error: error.message
        });
      });
  }

  goToProgression = () => {
    this.props.history.push('/progression');
  };

  render() {
    if (this.state.error) {
      return <ErrorHandler kind={this.state.error} />;
    } else if (!this.state.ProfileResponse) {
      return (
        <div className="view" id="loading">
          <h4>Asking Bungie</h4>
        </div>
      );
    } else {
      return (
        <BrowserRouter>
          <>
            {<GA.RouteTracker />}
            <Switch>
              <Route
                path="/progression/:membershipType/:membershipId/:characterId/:view?/:primary?/:secondary?/:tertiary?"
                render={route => (
                  <div className="view" id="progression">
                    <Player data={this.state} manifest={this.props.manifest} route={route} goToProgression={this.goToProgression} />
                    <Route
                      path="/progression/:membershipType/:membershipId/:characterId"
                      exact
                      render={() => (
                        <>
                          <div className="sub-header">
                            <div>Summaries</div>
                          </div>
                          <div className="summaries">
                            <div className="c2">
                              <div className="c2">
                                <ChecklistsSummary state={this.state} manifest={this.props.manifest} route={route} />
                              </div>
                              <div className="c2">
                                <Seals state={this.state} manifest={this.props.manifest} route={route} />
                              </div>
                              <div className="c1">
                                <Ranks state={this.state} manifest={this.props.manifest} route={route} />
                              </div>
                            </div>
                            <div className="c2">
                              <Almost state={this.state} manifest={this.props.manifest} route={route} />
                            </div>
                          </div>
                        </>
                      )}
                    />
                    <Route
                      path="/progression/:membershipType/:membershipId/:characterId/checklists"
                      exact
                      render={() => (
                        <>
                          <div className="sub-header">
                            <div>Checklists</div>
                          </div>
                          <div className="checklists">
                            <Checklists state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />
                          </div>
                        </>
                      )}
                    />
                    <Route path="/progression/:membershipType/:membershipId/:characterId/triumphs/:primary?/:secondary?/:tertiary?" render={() => <Triumphs state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />} />
                    <Route path="/progression/:membershipType/:membershipId/:characterId/collections/:primary?/:secondary?/:tertiary?" render={() => <Collections state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />} />
                  </div>
                )}
              />
              <Route render={route => <ErrorHandler />} />
            </Switch>
          </>
        </BrowserRouter>
      );
    }
  }
}

export default DisplayProfile;
