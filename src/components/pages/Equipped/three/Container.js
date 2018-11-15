import React, { Component } from 'react';
import EntryPoint from './EntryPoint';

export default class ThreeContainer extends Component {
  componentDidMount() {
    EntryPoint(this.threeRootElement);
  }
  render() {
    return <div className="renderer" ref={element => (this.threeRootElement = element)} />;
  }
}