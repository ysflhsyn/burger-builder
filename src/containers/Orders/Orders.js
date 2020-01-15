import React, { Component } from 'react';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
  state = {
    orders: [],
    loading: true
  }

  componentDidMount() {
    axios.get('/orders.json')
         .then(res => {
          const fetchedOrders = []; 
          for(let key in res.data) {
           fetchedOrders.push(
             {
               id: key,
               ...res.data[key]
             }
           );
          }
          this.setState({orders: fetchedOrders});
         })
         .catch(err => {
            console.log(err);
         })
         .finally( () => {
           this.setState({loading: false});
         })
  }

  render() {
    let orders = <p>No orders</p>;
    if(this.state.loading) {
      orders = <Spinner/>;
    }
    else if(this.state.orders.length > 0) {
      orders = this.state.orders.map( (order) => (<Order key={order.id}
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

export default withErrorHandler(Orders, axios);