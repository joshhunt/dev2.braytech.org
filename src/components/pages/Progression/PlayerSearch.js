import React from 'react';
import { Link } from 'react-router-dom'
import Globals from '../../Globals';


class PlayerSearch extends React.Component {
  constructor(props) {
    super(props);

    
  }

  render() {

    return (
      <div className="view" id="index">
        <h4>Search for player</h4>
        <div className="form">
        <div className="field">
            <input type="text" placeholder="justrealmilk" spellCheck="false" />
          </div>
        </div>
        <div className="results">
          <ul></ul>
        </div>
      </div>
    )
  }
}

export default PlayerSearch;