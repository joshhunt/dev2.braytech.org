import React from 'react';
import { Link } from 'react-router-dom';
import { withNamespaces } from 'react-i18next';

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
    const { t } = this.props;
    return (
      <div className='view' id='tools'>
        <div className='tool'>
          <div className='name'>
            <Link to='/tools/clan-banner-builder'>{t('Clan Banner Builder')}</Link>
          </div>
          <div className='description'>
            <p>{t('Collaborate with clan members on a new clan banner.')}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Tools);
