import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';

const Orders = (props) => {
  const {fetchOrders, token, userId} = props;
  useEffect(() => {
    fetchOrders(token, userId);
  }, [fetchOrders, token, userId]);

  let orders = <p>No orders</p>;
  if(props.loading) {
    orders = <Spinner/>;
  }
  else if(props.orders.length > 0) {
    orders = props.orders.map( (order) => (<Order key={order.id}
                                                  ingredients={order.ingredients}
                                                  price={order.price}/>) );
  }
  return (
    <div>
      {orders}
    </div>
  );
}

const mapStateToProps = state => ({
  orders: state.order.orders,
  loading: state.order.loading,
  token: state.auth.token,
  userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
  fetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));