import React, {  } from 'react';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { Route, Redirect } from 'react-router-dom';

const Checkout = (props) => {
  const checkoutCanceledHandler = () => {
    props.history.goBack();
  }

  const checkoutContinuedHandler = () => {
    props.history.replace('/checkout/contact-data');
  }

  let summary = <Redirect to="/"/>;
  if(props.ingredients) {
    const purchasedRedirect = props.purchased ? <Redirect to="/"/> : null;
    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary 
          ingredients={props.ingredients}
          onCheckoutCanceled={checkoutCanceledHandler}
          onCheckoutContinued={checkoutContinuedHandler}/>
        <Route 
          path={props.match.path + '/contact-data'} 
          component={ContactData}/>
      </div>
    );
  }
  return summary;
}

const mapStateToProps = state => ({
  ingredients: state.burgerBuilder.ingredients,
  totalPrice: state.burgerBuilder.totalPrice,
  purchased: state.order.purchased
});

export default connect(mapStateToProps)(Checkout);