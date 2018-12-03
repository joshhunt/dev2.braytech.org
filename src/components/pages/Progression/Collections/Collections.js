import React from 'react';

import Root from './Root';
import BadgeNode from './BadgeNode';
import PresentationNode from './PresentationNode';

import './Collections.css';

class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

  }

  componentDidMount() {
    if (!this.props.match.params.quaternary) {
      window.scrollTo(0, 0);
    }
  }
  
  render() {

    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;
    
    if (!primaryHash) {
      return (
        <Root {...this.props} />
      )
    }
    else if (primaryHash === "badge") {
      return (
        <BadgeNode {...this.props} />
      )
    }
    else {
      return (
        <div className="presentation-node collections">
          <div className="sub-header">
            <div>Collections</div>
          </div>
          <PresentationNode {...this.props} primaryHash={primaryHash} />
        </div>
      )
    }

  }
  
}

export default Collections;