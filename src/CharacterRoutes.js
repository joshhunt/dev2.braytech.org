import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Triumphs from './views/Triumphs';
import Account from './views/Account';
import Clan from './views/Clan';
import Character from './views/Character';
import Checklists from './views/Checklists';
import Collections from './views/Collections';
import ThisWeek from './views/ThisWeek';
import Vendors from './views/Vendors';

import Tooltip from './components/Tooltip';
import Loading from './components/Loading';

import { fetchAndWhatever } from './utils/getProfile';

export default class CharacterRoutes extends Component {
  fetchProfile = () => {
    fetchAndWhatever(this.props.route.match.params.membershipType, this.props.route.match.params.membershipId, this.stateCb, this.recieveUserCb);
  };

  stateCb = newState => {
    this.setState({ newState });
  };

  recieveUserCb = userResponse => {
    this.props.setUserReponse(this.props.route.match.params.membershipType, this.props.route.match.params.membershipId, this.props.route.match.params.characterId, userResponse);
  };

  componentDidMount() {
    // TODO:
    //  - don't fetch if we already have a user response in props that matches the route params
    //  - refetch is route params changes
    this.fetchProfile();
  }

  render() {
    const { route, user, manifest, viewport } = this.props;
    const userLoaded = user && user.characterId; // TODO: do we need character ID?

    if (!userLoaded) {
      return <Loading state='fetchingProfile' />;
    }

    return (
      <Switch>
        <Route path={route.match.path} exact render={() => <Redirect to={`${route.match.url}/account`} />} />
        <Route path={`${route.match.path}/triumphs/:primary?/:secondary?/:tertiary?/:quaternary?`} render={route => <Triumphs {...route} {...user} manifest={manifest} />} />

        <Route
          path={`${route.match.path}/account`}
          exact
          render={() => (
            <>
              <Account {...user} manifest={manifest} />
              <Tooltip manifest={this.manifest} />
            </>
          )}
        />
        <Route path={`${route.match.path}/clan/:view?/:subView?`} exact render={route => <Clan {...user} manifest={manifest} view={route.match.params.view} subView={route.match.params.subView} />} />
        <Route path={`${route.match.path}/character`} exact render={() => <Character {...user} viewport={viewport} manifest={manifest} />} />
        <Route path={`${route.match.path}/checklists`} exact render={() => <Checklists {...user} viewport={viewport} manifest={manifest} />} />
        <Route
          path={`${route.match.path}/collections/:primary?/:secondary?/:tertiary?/:quaternary?`}
          render={route => (
            <>
              <Collections {...route} {...user} manifest={manifest} />
              <Tooltip manifest={manifest} />
            </>
          )}
        />

        <Route
          path={`${route.match.path}/this-week`}
          exact
          render={() => (
            <>
              <ThisWeek {...user} manifest={manifest} />
              <Tooltip manifest={manifest} />
            </>
          )}
        />
        <Route path={`${route.match.path}/vendors/:hash?`} exact render={route => <Vendors vendorHash={route.match.params.hash} {...user} setPageDefault={this.setPageDefault} manifest={manifest} />} />
      </Switch>
    );
  }
}
