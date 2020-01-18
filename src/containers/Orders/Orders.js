import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

class Orders extends Component {
  componentDidMount() {
   this.props.fetchOrders();
  }

  render() {
    let orders = <p>No orders</p>;
    if(this.props.loading) {
      orders = <Spinner/>;
    }
    else if(this.props.orders.length > 0) {
      orders = this.props.orders.map( (order) => (<Order key={order.id}
                                                         ingredients={order.ingredients}
                                                         price={order.price}/>) );
    }
    return (
      <div>
        {orders}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  orders: state.order.orders,
  loading: state.order.loading
});

const mapDispatchToProps = dispatch => ({
  fetchOrders: () => dispatch(actions.fetchOrders())
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));