import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Layout from './containers/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncAuth = asyncComponent(() => import('./containers/Auth/Auth'));
const asyncOrders = asyncComponent(() => import('./containers/Orders/Orders'));
const asyncCheckout = asyncComponent(() => import('./containers/Checkout/Checkout'));

class App extends Component {
  componentDidMount() {
    this.props.tryAutoSignIn();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={asyncAuth}/>
        <Route path="/burger-builder" component={BurgerBuilder}/>
        <Redirect from="/" to="/burger-builder" />
      </Switch>
    );

    if(this.props.isAuth) {
      // added auth path to redirection in Auth.js work correctly (redirect to Checkout)
      routes = (
        <>
          <Switch>
            <Route path="/auth" component={asyncAuth}/> 
            <Route path="/checkout" component={asyncCheckout}/>
            <Route path="/orders" component={asyncOrders}/>
            <Route path="/logout" component={Logout}/>
            <Route path="/burger-builder" component={BurgerBuilder}/>
            <Redirect from="/" to="/burger-builder" />
          </Switch>
        </>
      );
    }
    return (
      <Layout>
        {routes}
      </Layout> 
    );
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
  tryAutoSignIn: () => dispatch(actions.authCheckState())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
