import React from 'react';

import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const NavigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link="/burger-builder">Burger Builder</NavigationItem>
    {
      !props.isAuth 
      ? <NavigationItem link="/auth">Authenticate</NavigationItem> 
      : (<>
        <NavigationItem link="/orders">Orders</NavigationItem>
        <NavigationItem link="/logout">Log out</NavigationItem>
        </>
      )
    }
  </ul>
);

export default NavigationItems;