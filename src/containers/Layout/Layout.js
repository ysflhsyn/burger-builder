import React, { useState } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = (props) => {
  const [isSideDrawerShown, setIsSideDrawerShown] = useState(false);
  
  const sideDrawerClosedHandler = () => {
    setIsSideDrawerShown(false);
  }

  const sideDrawerToggleHandler = () => {
    setIsSideDrawerShown(!isSideDrawerShown);
  }
  
  return (
    <>
      <Toolbar 
        toggle={sideDrawerToggleHandler}
        isAuth={props.isAuth}/>
      <SideDrawer 
        open={isSideDrawerShown} 
        closed={sideDrawerClosedHandler}
        isAuth={props.isAuth}/>
      <main className={classes.Content}>
        {props.children}
      </main>
    </>
  );
}

const mapStateToProps = state => ({
  isAuth: state.auth.token !== null
});

export default connect(mapStateToProps)(Layout);