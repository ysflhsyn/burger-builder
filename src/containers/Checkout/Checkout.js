import React, { Component } from 'react';
import { connect } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';
import { Route, Redirect } from 'react-router-dom';

class Checkout extends Component {
  checkoutCanceledHandler = () => {
    this.props.history.goBack();
  }

  checkoutContinuedHandler = () => {
    this.props.history.replace('/checkout/contact-data');
  }

  render() {
    let summary = <Redirect to="/"/>;
    if(this.props.ingredients) {
      const purchasedRedirect = this.props.purchased ? <Redirect to="/"/> : null;
      summary = (
        <div>
          {purchasedRedirect}
          <CheckoutSummary 
            ingredients={this.props.ingredients}
            onCheckoutCanceled={this.checkoutCanceledHandler}
            onCheckoutContinued={this.checkoutContinuedHandler}/>
          <Route path={this.props.match.path + '/contact-data'} 
                component={ContactData}/>
        </div>
      );
    }
    return summary;
  }
}

const mapStateToProps = state => ({
  ingredients: state.burgerBuilder.ingredients,
  totalPrice: state.burgerBuilder.totalPrice,
  purchased: state.order.purchased
});

export default connect(mapStateToProps)(Checkout);