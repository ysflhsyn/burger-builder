import React, {Component} from 'react';
import {connect} from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index'; // index could be omitted

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount() {
    this.props.initIngredients();
  }

  purchaseHandler = () => {
    if(this.props.isAuth) this.setState({purchasing: true});
    else {
      this.props.setAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseContinueHandler = () => {
    this.props.initPurchase();
    this.props.history.push('/checkout');
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  updatePurchaseState() {
    const sum = Object.keys(this.props.ingredients)
                      .reduce( (sum, type) =>  sum + this.props.ingredients[type], 0);
    return sum > 0;
  }

  render() {
    const disabledInfo = {...this.props.ingredients};
    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; 
    }

    let orderSummary = null;
    let burger = this.props.error ? <p>Ingredients can't be loaded</p> :<Spinner />;

    if(this.props.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.props.ingredients}/>
          <BuildControls 
            ingredientAdd={this.props.addIngredientHandler}
            ingredientRemove={this.props.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.props.totalPrice}
            purchasable={this.updatePurchaseState()}
            order={this.purchaseHandler}
            isAuth={this.props.isAuth}
          />
        </>
      );
      orderSummary = (<OrderSummary 
        ingredients={this.props.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
        price={this.props.totalPrice}/>);
    }

    return (
      <>
        <Modal show={this.state.purchasing} modalClose={this.purchaseCancelHandler}>
          {orderSummary}
        </Modal>
        {burger}
      </>
    );
  }
}

const mapStateToProps = state => ({
  ingredients: state.burgerBuilder.ingredients,
  totalPrice: state.burgerBuilder.totalPrice,
  error: state.burgerBuilder.error,
  isAuth: state.auth.token !== null
});

const mapDispatchToProps = dispatch => ({
  addIngredientHandler: ( 
    (ingredientName) => dispatch(actions.addIngredient(ingredientName))
  ),
  removeIngredientHandler: ( 
    (ingredientName) => dispatch(actions.removeIngredient(ingredientName))
  ),
  initIngredients: () => dispatch(actions.initIngredients()),
  initPurchase: () => dispatch(actions.purchaseInit()),
  setAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));