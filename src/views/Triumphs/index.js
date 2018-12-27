import React from 'react';
import { Link } from 'react-router-dom';
import * as ls from '../../utils/localStorage';
import Root from './Root';
import SealNode from './SealNode';
import PresentationNode from './PresentationNode';
import { ProfileLink } from '../../components/ProfileLink';

import './styles.css';
import { withNamespaces } from 'react-i18next';

class Triumphs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false
    };

    this.toggleCompleted = this.toggleCompleted.bind(this);
  }

  toggleCompleted = () => {
    let currentSetting = ls.get('setting.hideCompletedRecords') ? ls.get('setting.hideCompletedRecords') : false;

    ls.set('setting.hideCompletedRecords', currentSetting ? false : true);

    this.setState({
      hideCompleted: ls.get('setting.hideCompletedRecords')
    });
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps.location.pathname !== this.props.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { t } = this.props;
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let toggleCompletedLink = (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a onClick={this.toggleCompleted}>
        {this.state.hideCompleted ? (
          <>
            <i className='uniE0522' />
            {t('Show acquired')}
          </>
        ) : (
          <>
            <i className='uniE0522' />
            {t('Hide acquired')}
          </>
        )}
      </a>
    );

    if (!primaryHash) {
      return (
        <div className='view presentation-node' id='triumphs'>
          <Root {...this.props} />
        </div>
      );
    } else if (primaryHash === 'seal') {
      return (
        <>
          <div className='view presentation-node' id='triumphs'>
            <SealNode {...this.props} hideCompleted />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>
                <ProfileLink to='/triumphs'>
                  <i className='uniE742' />
                  {t('Triumphs')}
                </ProfileLink>
              </li>
            </ul>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className='view presentation-node' id='triumphs'>
            <PresentationNode {...this.props} hideCompleted={this.state.hideCompleted} primaryHash={primaryHash} />
          </div>
          <div className='sticky-nav'>
            <div />
            <ul>
              <li>{toggleCompletedLink}</li>
              <li>
                <Link to='/triumphs'>
                  <i className='uniE742' />
                  {t('Triumphs')}
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

export default withNamespaces()(Triumphs);
