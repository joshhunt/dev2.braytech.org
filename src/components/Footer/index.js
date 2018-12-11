import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import './styles.css';

class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const darkPaths = ['/character-select'];

    if (this.props.route.location.pathname !== '/') {
      return (
        <div id='footer' className={cx({ dark: darkPaths.includes(this.props.route.location.pathname) })}>
          <div>
            <Link to='/pride' className='pride'>
              Pride
            </Link>
            © 2018 Tom Chapman
          </div>
          <ul>
            <li>
              <a href='https://twitter.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
                Twitter
              </a>
            </li>
            <li>
              <a href='https://www.reddit.com/user/xhtmlvalid' target='_blank' rel='noopener noreferrer'>
                Reddit
              </a>
            </li>
            <li>
              <a href='https://github.com/justrealmilk/dev2.braytech.org/issues' target='_blank' rel='noopener noreferrer'>
                Issues?
              </a>
            </li>
            <li>
              {/* eslint-disable-next-line jsx-a11y/accessible-emoji */}
              <a href='https://www.ko-fi.com/justrealmilk' target='_blank' rel='noopener noreferrer'>
                Buy me a Ko-fi ❤️
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default Footer;
