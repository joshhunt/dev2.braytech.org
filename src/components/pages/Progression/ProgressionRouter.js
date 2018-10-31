import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';

import Progression from './Progression';


class ProgressionRouter extends React.Component {
  constructor(props) {
    super(props);

    
  }

  render() {

    return (
      <BrowserRouter>
        <Switch>
          <Route path="/progression" render={()=> "search" } exact />
          <Route 
            path="/progression/:membershipType/:membershipId/:characterId?/:section?" 
            render={ (route) => 
              <Progression route={route} />
            } />
          <Route component={ Error } />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default ProgressionRouter;