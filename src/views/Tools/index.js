import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

class Tools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.setPageDefault('light');
    window.scrollTo(0, 0);
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    return (
      <div className='view' id='tools'>
        <div className='tool'>
          <div className='name'>
            <Link to='/tools/clan-banner-builder'>Clan Banner Builder</Link>
          </div>
          <div className='description'>
            <p>Collaborate with clan members on a new clan banner.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Tools;
