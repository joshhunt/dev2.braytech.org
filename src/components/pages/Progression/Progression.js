import React from 'react';
import { withRouter } from "react-router";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as ls from '../../localStorage';

import Error from '../Error'
import './Progression.css'
import SearchPlayer from '../SearchPlayer';
import DisplayProfile from './DisplayProfile';


class Progression extends React.Component {
  constructor(props) {
    super(props);


    this.state = {

    }

    this.playerSelect = this.playerSelect.bind(this);
  }

  playerSelect = (e) => {
    ls.update("profileHistory", e.currentTarget.dataset, true, 6);
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
              <div className="view" id="search">
                <SearchPlayer {...this.props} {...route} playerSelect={this.playerSelect} />
              </div>
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