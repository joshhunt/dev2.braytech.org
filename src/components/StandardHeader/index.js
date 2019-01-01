import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cx from 'classnames';
import packageJSON from '../../../package.json';

import './styles.css';

class StandardHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileNavOpen: false
    };

    this.TriggerClickHandler = this.TriggerClickHandler.bind(this);
    this.NavlinkClickHandler = this.NavlinkClickHandler.bind(this);
  }

  TriggerClickHandler = () => {
    if (!this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: true });
    } else {
      this.setState({ mobileNavOpen: false });
    }
  };

  NavlinkClickHandler = () => {
    if (this.state.mobileNavOpen) {
      this.setState({ mobileNavOpen: false });
    }
  };

  render() {
    let viewsRender = (
      <div className='views'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    let viewsInline = false;
    if (this.props.viewport.width > 1000) {
      viewsInline = true;
    }

    let mobileNav = (
      <div className='nav'>
        <ul>
          {this.props.views.map(view => {
            let to = view.slug;
            return (
              <li key={view.slug}>
                <NavLink to={to} exact={view.exact} onClick={this.NavlinkClickHandler}>
                  {view.name}
                </NavLink>
                <div className='description'>{view.desc}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );

    return (
      <div id='header' className={cx('standard', { navOpen: this.state.mobileNavOpen, isIndex: this.props.isIndex })}>
        <div className='braytech'>
          <div className='logo'>
            <Link to='/'>
              <span className='destiny-clovis_bray_device' />
              Braytech {packageJSON.version}
            </Link>
          </div>
          {!viewsInline ? (
            this.state.mobileNavOpen ? (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniE106' />
                Exit
              </div>
            ) : (
              <div className='trigger' onClick={this.TriggerClickHandler}>
                <i className='uniEA55' />
                Views
              </div>
            )
          ) : (
            <div className='ui'>{viewsRender}</div>
          )}
          {this.state.mobileNavOpen ? mobileNav : null}
        </div>
      </div>
    );
  }
}

export default StandardHeader;
