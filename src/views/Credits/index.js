import React from 'react';

import './styles.css';

class Credits extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.props.setPageDefault('light');
  }

  componentWillUnmount() {
    this.props.setPageDefault(false);
  }

  render() {
    
    // <a href='https://github.com/justrealmilk/dev2.braytech.org/issues' target='_blank' rel='noopener noreferrer'>
    //         Issues?
    //       </a>

    return (
      <div className='view' id='credits'>
        <div className='content'>
          <div className='name'>Credits</div>
          <div className='description'>
            <p>Thanks to Bungie in general for a great game and a great API. Thanks to vthornheart, the boys in the DIM Slack, and for everyone who's excitement motivates me.</p>
            <p>The repo is at <a href='https://github.com/justrealmilk/dev2.braytech.org' target='_blank' rel='noopener noreferrer'>justrealmilk/dev2.braytech.org</a> and issues can be filed <a href='https://github.com/justrealmilk/dev2.braytech.org/issues' target='_blank' rel='noopener noreferrer'>here.</a></p>
            <ul>
              <li>
                <strong>Index</strong>
                <ul>
                  <li><a href='https://www.artstation.com/artwork/m9q01' target='_blank' rel='noopener noreferrer'>Image</a> by Andrew Averkin / Blur</li>
                </ul>
              </li>
              <li>
                <strong>This Week</strong>
                <ul>
                  <li><a href='https://github.com/delphiactual' target='_blank' rel='noopener noreferrer'>Rob Jones</a></li>
                  <li><a href='https://github.com/koenigderluegner' target='_blank' rel='noopener noreferrer'>Alex Niersmann</a></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Credits;
