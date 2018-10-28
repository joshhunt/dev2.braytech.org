import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <NavLink to="/">Thomas Chapman</NavLink>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink to="/archive">Archive</NavLink>
            <p>The complete record of digital works</p>
          </li>
          <li>
            <NavLink to="/guestbook">Guestbook</NavLink>
            <p>Leave your x here</p>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;