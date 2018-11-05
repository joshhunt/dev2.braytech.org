import React from 'react';
import { withRouter } from "react-router";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Globals from '../../Globals';
import * as ls from '../../localStorage';

import Error from '../Error'
import './Progression.css'
import SearchPlayer from '../SearchPlayer';
import DisplayProfile from './DisplayProfile';
import Player from './Player';
import Summaries from './Summaries/Summaries';
import Checklists from './Checklists/Checklists';


class Progression extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }

    this.playerSelect = this.playerSelect.bind(this);
  }

  playerSelect = (e) => {
    ls.update("profileHistory", e.currentTarget.dataset, true, 6);
    this.props.history.push(`/progression/${e.currentTarget.dataset.membershiptype}/${e.currentTarget.dataset.membershipid}`);
    // this.setState({
    //   playerSelect: true
    // });
  }

  render() {
    console.log(this);
    return (
      <BrowserRouter>
        <Switch>
          <Route 
            path="/progression" 
            exact
            render={ (route) => 
              <SearchPlayer route={route} playerSelect={this.playerSelect} />
            } />
          <Route 
            path="/progression/:membershipType/:membershipId/:characterId?/:view?" 
            render={ (route) => 
              <DisplayProfile {...this.props} {...route} /> } />
            } />
          <Route render={ (route) => <Error /> } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default withRouter(Progression);