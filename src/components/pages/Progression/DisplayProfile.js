import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import assign from 'lodash/assign';
import Globals from '../../Globals';
import GA from '../../../GA';

import Tooltip from '../../Tooltip/Tooltip';
import ErrorHandler from '../ErrorHandler';
import './Progression.css';
import Player from './Player';
import Summary from './Summary/Summary';
import ThisWeek from './ThisWeek/ThisWeek';
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

  //

  askBungie = () => {
    let requests = [
      {
        name: 'profile',
        path: `https://www.bungie.net/Platform/Destiny2/${this.props.match.params.membershipType}/Profile/${this.props.match.params.membershipId}/?components=100,104,200,202,204,205,800,900`
      },
      {
        name: 'stats',
        path: `https://www.bungie.net/Platform/Destiny2/${this.props.match.params.membershipType}/Account/${this.props.match.params.membershipId}/Character/0/Stats/?groups=0&modes=4,7,63&periodType=0`
      }
    ];

    let fetches = requests.map(request => {
      return fetch(request.path, {
        headers: {
          'X-API-Key': Globals.key.bungie
        }
      })
        .then(response => {
          return response.json();
        })
        .then(fetch => {
          let object = {};
          object[request.name] = fetch;
          return object;
        });
    });

    return Promise.all(fetches)
      .then(promises => {
        return assign(...promises);
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.askBungie()
      .then(responses => {



        if (responses.profile.ErrorCode !== 1) {
          throw new SyntaxError(responses.profile.ErrorCode);
        }
        if (!responses.profile.Response.characterProgressions.data) {
          throw new SyntaxError('privacy');
        }

        // convert character response to an array
        responses.profile.Response.characters.data = Object.values(responses.profile.Response.characters.data).sort(function(a, b) {
          return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
        });

        // remove dud ghost scans
        delete responses.profile.Response.profileProgression.data.checklists[2360931290][1116662180];
        delete responses.profile.Response.profileProgression.data.checklists[2360931290][3856710545];
        delete responses.profile.Response.profileProgression.data.checklists[2360931290][508025838];

        // adjust adventures checklist state https://github.com/Bungie-net/api/issues/786
        let completed = false;
        // Signal Light
        Object.values(responses.profile.Response.characterProgressions.data).forEach(character => {
          if (character.checklists[4178338182][844419501]) {
            completed = true;
          }
        });
        Object.values(responses.profile.Response.characterProgressions.data).forEach(character => {
          if (completed) {
            character.checklists[4178338182][844419501] = true;
          }
        });
        completed = false;
        //Not Even the Darkness
        Object.values(responses.profile.Response.characterProgressions.data).forEach(character => {
          if (character.checklists[4178338182][1942564430]) {
            completed = true;
          }
        });
        Object.values(responses.profile.Response.characterProgressions.data).forEach(character => {
          if (completed) {
            character.checklists[4178338182][1942564430] = true;
          }
        });
        completed = false;

        let route = this.props;
        let characterId = responses.profile.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length === 1 ? route.match.params.characterId : responses.profile.Response.characters.data[0].characterId;

        let view = route.match.params.view;
        if (!route.match.params.characterId || responses.profile.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length < 1) {
          if (route.match.params.characterId) {
            view = route.match.params.characterId;
          }
        }

        let primary = route.match.params.primary;
        let secondary = route.match.params.secondary;
        let tertiary = route.match.params.tertiary;
        let quaternary = route.match.params.quaternary;

        // i hate this
        route.history.replace(`/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${characterId}${view ? `/${view}` : ``}${primary ? `/${primary}` : ``}${secondary ? `/${secondary}` : ``}${tertiary ? `/${tertiary}` : ``}${quaternary ? `/${quaternary}` : ``}`);

        this.setState({
          response: {
            profile: responses.profile,
            stats: responses.stats,
          }
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
    } else if (!this.state.response) {
      return (
        <div className='view' id='loading'>
          <h4>Asking Bungie</h4>
        </div>
      );
    } else {
      return (
        <>
          <GA.RouteTracker />
          <Route
            path='/progression/:membershipType/:membershipId/:characterId/:view?/:primary?/:secondary?/:tertiary?/:quaternary?'
            render={route => (
              <>
                <div className='view' id='progression'>
                  <Player data={this.state} manifest={this.props.manifest} route={route} goToProgression={this.goToProgression} />
                  <Route path='/progression/:membershipType/:membershipId/:characterId' exact render={() => <Summary state={this.state} manifest={this.props.manifest} route={route} />} />
                  <Route path='/progression/:membershipType/:membershipId/:characterId/this-week' exact render={() => <ThisWeek state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />} />
                  <Route
                    path='/progression/:membershipType/:membershipId/:characterId/checklists'
                    exact
                    render={() => (
                      <div className='checklists'>
                        <div className='sub-header'>
                          <div>Checklists</div>
                        </div>
                        <Checklists state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />
                      </div>
                    )}
                  />
                  <Route path='/progression/:membershipType/:membershipId/:characterId/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={() => <Triumphs state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />} />
                  <Route path='/progression/:membershipType/:membershipId/:characterId/collections/:primary?/:secondary?/:tertiary?/:quaternary?' render={() => <Collections state={this.state} manifest={this.props.manifest} viewport={this.props.viewport} route={route} />} />
                </div>
                <Tooltip manifest={this.props.manifest} route={route} />
              </>
            )}
          />
        </>
      );
    }
  }
}

export default DisplayProfile;
