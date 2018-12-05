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
import Equipment from './Equipment/Equipment';
import './PresentationNode.css';
import Triumphs from './Triumphs/Triumphs';
import Collections from './Collections/Collections';
import LoreBook from './LoreBook/LoreBook';

class DisplayProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.askBungie = this.askBungie.bind(this);
    this.goToProgression = this.goToProgression.bind(this);
  }

  askBungie = () => {
    let requests = [
      {
        name: 'profile',
        path: `https://www.bungie.net/Platform/Destiny2/${this.props.match.params.membershipType}/Profile/${this.props.match.params.membershipId}/?components=100,104,200,202,204,205,300,301,302,303,304,305,800,900`
      }
      // {
      //   name: 'milestones',
      //   path: `https://www.bungie.net/Platform/Destiny2/Milestones/`
      // }
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
        // else if (responses.milestones.ErrorCode !== 1) {
        //   throw new SyntaxError(responses.milestones.ErrorCode);
        // }
        else if (!responses.profile.Response.characterProgressions.data) {
          throw new SyntaxError('privacy');
        } else {
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

        let characterIds = responses.profile.Response.characters.data.map(character => character.characterId);
        if (characterIds.indexOf(route.match.params.characterId) < 0) {
          let breakApart = route.location.pathname.split(route.match.params.membershipId);
          let newRoute = `${breakApart[0]}${route.match.params.membershipId}/${characterId}${breakApart[1]}`;

          route.history.replace(newRoute);
        }

        this.setState({
          response: {
            profile: responses.profile.Response
            // milestones: responses.milestones.Response
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
          <div className='view' id='progression'>
            <Player {...this.props} {...this.state} goToProgression={this.goToProgression} />
            <Switch>
              <Route path='/progression/:membershipType/:membershipId/:characterId' exact render={() => <Summary {...this.props} {...this.state} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/this-week' exact render={() => <ThisWeek {...this.props} {...this.state} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/checklists' exact render={() => <Checklists {...this.props} {...this.state} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/equipment' exact render={() => <Equipment {...this.props} {...this.state} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/triumphs/:primary/:secondary/:tertiary/read/:recordHash?' render={(route) => <LoreBook {...this.props} {...this.state} {...route} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?' render={() => <Triumphs {...this.props} {...this.state} />} />
              <Route path='/progression/:membershipType/:membershipId/:characterId/collections/:primary?/:secondary?/:tertiary?/:quaternary?' render={() => <Collections {...this.props} {...this.state} />} />
            </Switch>
          </div>
          <Tooltip manifest={this.props.manifest} />
        </>
      );
    }
  }
}

export default DisplayProfile;
