import React from 'react';
import { Link } from 'react-router-dom';

import packageJSON from '../../../package.json';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      
    }
    
  }

  render() {
    return (
      <footer>
        <div>© 2018 Tom Chapman / <Link to="/progression/1/4611686018449662397/">justrealmilk</Link>. This is a fan site. All content is owned by their respective owners.</div>
        <div>Braytech {packageJSON.version} / <a href="https://github.com/justrealmilk/dev2.braytech.org/issues" target="_blank" rel="noopener noreferrer">Issues?</a></div>
      </footer>
    )
  }
}

export default Footer;