import React from 'react';

import { Link } from 'react-router-dom';
import Root from './Root';
import BadgeNode from './BadgeNode';
import PresentationNode from './PresentationNode';

import './styles.css';
import { withNamespaces } from 'react-i18next';

class Collections extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps.location.pathname !== this.props.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    if (!primaryHash) {
      return (
        <div className='view presentation-node' id='collections'>
          <Root {...this.props} />
        </div>
      );
    } else if (primaryHash === 'badge') {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <BadgeNode {...this.props} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <Link to='/collections'>
                  <i className='uniE742' />
                  Collections
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='view presentation-node' id='collections'>
            <PresentationNode {...this.props} primaryHash={primaryHash} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <Link to='/collections'>
                  <i className='uniE742' />
                  {t('Collections')}
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

export default withNamespaces()(Collections);
