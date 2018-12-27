import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import UserContext from '../UserContext';

export function ProfileLink({ to, children, component, ...rest }) {
  const LinkComponent = component || Link;

  return (
    <UserContext.Consumer>
      {user => (
        <LinkComponent {...rest} to={`${user ? user.urlPrefix : ''}${to}`}>
          {children}
        </LinkComponent>
      )}
    </UserContext.Consumer>
  );
}

export function ProfileNavLink(props) {
  return <ProfileLink {...props} component={NavLink} />;
}
