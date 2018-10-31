import React from 'react';
import { Redirect } from 'react-router-dom'
import Globals from '../../Globals';



class LoadPlayer extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeCharacterId: this.props.characterId,
      ProfileResponse: undefined
    }

  }

  componentDidMount () {
    
    fetch(
      `https://www.bungie.net/Platform/Destiny2/${ this.props.data.match.params.membershipType }/Profile/${ this.props.data.match.params.membershipId }/?components=100,104,200,202,204,205,800,900`,
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

        this.props.set(this.state.activeCharacterId ? this.state.activeCharacterId : ProfileResponse.Response.characters.data[0].characterId, 
          ProfileResponse.Response)

        this.setState({
          activeCharacterId: this.state.activeCharacterId ? this.state.activeCharacterId : ProfileResponse.Response.characters.data[0].characterId,
          ProfileResponse: ProfileResponse.Response
        });

        console.log(this.state)

      })
    .catch(error => {
      console.log(error);
    })

  }


  render() {

    if (this.state.ProfileResponse) {
      return (
        <Redirect to={`/progression/${ this.state.ProfileResponse.profile.data.userInfo.membershipType }/${ this.state.ProfileResponse.profile.data.userInfo.membershipId }/${ this.state.activeCharacterId }/`} />
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