import React from 'react';

import './styles.css';

import StandardHeader from '../StandardHeader';
import ProfileHeader from '../ProfileHeader';
import { withNamespaces } from 'react-i18next';

function makeUrl(path, user) {
  return user && user.response ? `${user.urlPrefix}${path}` : `/character-select?next=${path}`;
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t, user, route, viewport } = this.props;

    let views = [
      {
        name: t('Clan'),
        desc: t('Activity and statistics'),
        slug: makeUrl('/clan', user),
        exact: false
      },
      {
        name: t('Collections'),
        desc: t('Items your Guardian has acquired'),
        slug: makeUrl('/collections', user),
        exact: false
      },
      {
        name: t('Triumphs'),
        desc: t("Records of your Guardian's achievements"),
        slug: makeUrl('/triumphs', user),
        exact: false
      },
      // {
      //   name: t('Character'),
      //   desc: t('Character (dev only)'),
      //   slug: '/character',
      //   exact: true,
      //   dev: true
      // },
      {
        name: t('Account'),
        desc: t("Bird's eye view of your overall progress"),
        slug: makeUrl('/account', user),
        exact: true
      },
      {
        name: t('Checklists'),
        desc: t('Made a list, check it twice'),
        slug: makeUrl('/checklists', user),
        exact: true
      },
      {
        name: t('This Week'),
        desc: t('Prestigious records and valued items up for grabs this week'),
        slug: makeUrl('/this-week', user),
        exact: true
      },
      // {
      //   name: t('Vendors'),
      //   desc: t("Tracking what's in stock across the Jovians"),
      //   slug: makeUrl('/vendors', user),
      //   exact: false
      // },
      {
        name: t('Tools'),
        desc: t('Assorted Destiny-related tools'),
        slug: '/tools',
        exact: true
      },
      {
        name: <span className='destiny-settings' />,
        desc: 'Select a different language',
        slug: '/settings',
        exact: true
      }
    ];

    views = process.env.NODE_ENV !== 'development' ? views.filter(view => !view.dev) : views;

    let standard = ['character-select', 'pride', 'credits', 'settings', 'tools'];

    if (this.props.user.response && this.props.user.characterId && this.props.route.location.pathname !== '/' && !standard.includes(this.props.route.location.pathname.split('/')[1])) {
      return <ProfileHeader {...route} user={user} viewport={viewport} manifest={this.props.manifest} views={views} />;
    } else {
      return <StandardHeader {...user} viewport={viewport} views={views} isIndex={this.props.route.location.pathname === '/' ? true : false} />;
    }
  }
}

export default withNamespaces()(Header);
