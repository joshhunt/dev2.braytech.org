import React from 'react';
import { Link } from 'react-router-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Globals from '../../Globals';


class Progression extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playerResponse: undefined
    }
  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.membershipType }/Profile/${ this.props.membershipId }/?components=100,104,200,202,204,205,800,900`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(playerResponse => {
  
        this.setState({
          playerResponse
        });

      })
    .catch(error => {
      console.log(error);
    })

  }

  render() {

    console.log(this.props, this.state)

    if (!this.state.playerResponse) {
      return (
        <div className="view" id="loading">
          <p>loading user</p>
        </div>
      );
    }
    else {
      return (
        <div className="view" id="progression">
          lol
        </div>
      );
    }
  }
}

export default Progression;