import React from 'react';

import './styles.css';
import AboutView from './about.js';
import RosterView from './roster.js';
import StatsView from './stats.js';

class Clan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  render() {
    if (this.props.view === 'roster') {
      return <RosterView {...this.props} />;
    } else if (this.props.view === 'stats') {
      return <StatsView {...this.props} />;
    } else {
      return <AboutView {...this.props} />;
    }
  }
}

export default Clan;
