import React, { Component } from 'react';

import Container from './three/Container';

import './Equipped.css';

class Equipped extends Component {
  constructor() {
    super();
    this.state = {
      
    };
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <div className="view" id="equipped">
        <Container />
      </div>
    )
  }
}

export default Equipped;
