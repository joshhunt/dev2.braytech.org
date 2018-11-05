import React from 'react';
import { Redirect } from 'react-router-dom'
import Globals from '../../Globals';



class LoadPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ProfileResponse: null
    }
  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.match.params.membershipType }/Profile/${ this.props.match.params.membershipId }/?components=100,104,200,202,204,205,800,900`,
      {
        headers: {
          "X-API-Key": Globals.key.bungie,
        }
      }
    )
    .then(response => {
      return response.json();
    })
      .then(ProfileResponse => {
  
        ProfileResponse.Response.characters.data = Object.values(ProfileResponse.Response.characters.data).sort(function(a, b) { return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal) });

        let route = this.props
        let characterId = ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length === 1 ? route.match.params.characterId : ProfileResponse.Response.characters.data[0].characterId
        
        let view
        if (!route.match.params.characterId || ProfileResponse.Response.characters.data.filter(character => character.characterId === route.match.params.characterId).length < 1) {
          
          if (route.match.params.characterId) {
            view = route.match.params.characterId
          }
        }

        this.setState({
          activeCharacterId: characterId,
          ProfileResponse: ProfileResponse.Response,
          pathname: `/progression/${route.match.params.membershipType}/${route.match.params.membershipId}/${characterId}${view ? `/${view}`:``}`
        });

        console.log(ProfileResponse, this.state);

        //this.props.set(characterId, ProfileResponse.Response)

      })
    .catch(error => {
      console.log(error);
    })

  }


  render() {

    console.log(this)

    if (this.state.ProfileResponse) {
      return (
        <Redirect
          to={{
            pathname: this.state.pathname,
            state: {
              activeCharacterId: this.state.characterId,
              ProfileResponse: this.state.ProfileResponse
            }
          }}
        />
      )
    }
    else {
      return (
        <div className="view" id="loading">
          <p>loading user</p>
        </div>
      )      
    }


  }




}

export default LoadPlayer