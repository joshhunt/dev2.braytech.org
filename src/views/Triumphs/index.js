import React from 'react';
import { Link } from 'react-router-dom';
import * as ls from '../../utils/localStorage';
import Root from './Root';
import SealNode from './SealNode';
import PresentationNode from './PresentationNode';

import './styles.css';

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

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps) {
    if (!this.props.match.params.quaternary && prevProps !== this.props) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    let primaryHash = this.props.match.params.primary ? this.props.match.params.primary : false;

    let toggleCompletedLink = (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a onClick={this.toggleCompleted}>
        {this.state.hideCompleted ? (
          <>
            <i className='uniE0522' />
            Show acquired
          </>
        ) : (
          <>
            <i className='uniE0522' />
            Hide acquired
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
                <Link to='/triumphs'>
                  <i className='uniE742' />
                  Triumphs
                </Link>
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
                  Triumphs
                </Link>
              </li>
            </ul>
          </div>
        </>
      );
    }
  }
}

export default Triumphs;
