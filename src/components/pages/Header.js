import React from 'react';
import { NavLink } from 'react-router-dom';

import packageJSON from '../../../package.json';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      display: false
    }

    this.navToggle = this.navToggle.bind(this);
    this.navHide = this.navHide.bind(this);
    this.headerEl = React.createRef();
    
  }

  navToggle = (e) => {
    e.preventDefault();
    if (this.state.display) {
      this.setState({
        display: false
      });
    }
    else {
      this.setState({
        display: true
      });
    }
  }

  navHide = (e) => {
    this.setState({
      display: false
    });
  }

  render() {

    const routes = [
      {
        name: "Progression",
        to: "/progression"
      },
      {
        name: "Clans",
        to: "/clans"
      }
    ];

    if (this.state.display) {
      return (
        <header ref={this.headerEl} className="display">
          <div className="logo">
            <NavLink to="/" exact onClick={this.navHide}>Braytech {packageJSON.version}</NavLink>
          </div>
          <div className="trigger" onClick={this.navToggle}></div>
          <ul>
            { routes.map(route => 
              <li key={route.name}>
                <NavLink to={route.to} onClick={this.navHide}>{route.name}</NavLink>
              </li>
            )}
          </ul>
        </header>
      )
    }
    else {
      return (
        <header ref={this.headerEl}>
          <div className="logo">
            <NavLink to="/" exact>Braytech</NavLink>
          </div>
          <div className="trigger" onClick={this.navToggle}></div>
          <ul>
            { routes.map(route => 
              <li key={route.name}>
                <NavLink to={route.to}>{route.name}</NavLink>
              </li>
            )}
          </ul>
        </header>
      )
    }
  }
}

export default Header;