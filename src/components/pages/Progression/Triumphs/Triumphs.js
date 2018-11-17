import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cx from 'classnames';

import ObservedImage from '../../../ObservedImage';

import { enumerateRecordState } from '../../../destinyEnums';

import Root from './Root';
import SealNode from './SealNode';
import PresentationNode from './PresentationNode';

import './Triumphs.css';

class Triumphs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

  }
  
  render() {

    let primaryHash = this.props.route.match.params.primary ? this.props.route.match.params.primary : false;
    
    if (!primaryHash) {
      return (
        <Root {...this.props} />
      )
    }
    else if (primaryHash === "seal") {
      return (
        <SealNode {...this.props} />
      )
    }
    else {
      return (
        <div className="presentation-node triumphs">
          <div className="sub-header">
            <div>Triumphs</div>
          </div>
          <PresentationNode {...this.props} primaryHash={primaryHash} />
        </div>
      )
    }

  }
  
}

export default Triumphs;