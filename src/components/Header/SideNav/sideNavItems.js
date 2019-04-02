import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';

import './sideNav.css';

const SideNavItems = (props) => {
  const items = [
    {
      icon: 'home',
      text: 'Home',
      link: '/'
    },
    {
      icon: 'file-text-o',
      text: 'News',
      link: '/news'
    },
    {
      icon: 'play',
      text: 'Videos',
      link: '/videos'
    },
    {
      icon: 'sign-in',
      text: 'Sign in',
      link: '/sign-in'
    },
    {
      icon: 'sign-out',
      text: 'Sign out',
      link: '/sign-out'
    }
  ];

  const showItems = () => {
    return items.map((item, i) => (
      <div key={i} className="option">
        <Link to={item.link}>
          <FontAwesome name={item.icon} />
          {item.text}
        </Link>
      </div>
    ))
  }

  return (
    <div>
      { showItems() }
    </div>
  );
};

export default SideNavItems;