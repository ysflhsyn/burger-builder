import React, { useEffect, Suspense, useCallback } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Layout from './containers/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Auth = React.lazy(() => import('./containers/Auth/Auth'));
const Orders = React.lazy(() => import('./containers/Orders/Orders'));
const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'));

const App = props => {  
  const dispatch = useDispatch();
  const tryAutoSignIn = useCallback(() => dispatch(actions.authCheckState()), [dispatch]);
  const isAuth = useSelector(state => state.auth.token !== null);

  useEffect(() => {
    tryAutoSignIn()
  }, [tryAutoSignIn])

  let routes = (
    <Switch>
      <Route path="/auth" component={Auth}/>
      <Route path="/burger-builder" component={BurgerBuilder}/>
      <Redirect from="/" to="/burger-builder" />
    </Switch>
  );

  if(isAuth) {
    // added auth path to redirection in Auth.js work correctly (redirect to Checkout)
    routes = (
      <>
        <Switch>
          <Route path="/auth" component={Auth}/> 
          <Route path="/checkout" component={Checkout}/>
          <Route path="/orders" component={Orders}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/burger-builder" component={BurgerBuilder}/>
          <Redirect from="/" to="/burger-builder" />
        </Switch>
      </>
    );
  }

  return (
    <Layout>
      <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
    </Layout> 
  );
}

export default withRouter(App);
