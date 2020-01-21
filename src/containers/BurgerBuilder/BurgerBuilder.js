import React, { useState, useEffect} from 'react';
import {connect} from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index'; // index could be omitted

const BurgerBuilder = props => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const {initIngredients} = props;
  useEffect(() => {
    initIngredients();
  }, [initIngredients]);
  
  const purchaseHandler = () => {
    if(props.isAuth) setIsPurchasing(true);
    else {
      props.setAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  }

  const purchaseContinueHandler = () => {
    props.initPurchase();
    props.history.push('/checkout');
  }

  const purchaseCancelHandler = () => {
    setIsPurchasing(false);
  }

  const updatePurchaseState = () => {
    const sum = Object.keys(props.ingredients)
                      .reduce( (sum, type) =>  sum + props.ingredients[type], 0);
    return sum > 0;
  }

  const disabledInfo = {...props.ingredients};
  for(let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0; 
  }

  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded</p> :<Spinner />;

  if(props.ingredients) {
    burger = (
      <>
        <Burger ingredients={props.ingredients}/>
        <BuildControls 
          ingredientAdd={props.addIngredientHandler}
          ingredientRemove={props.removeIngredientHandler}
          disabled={disabledInfo}
          price={props.totalPrice}
          purchasable={updatePurchaseState()}
          order={purchaseHandler}
          isAuth={props.isAuth}
        />
      </>
    );
    orderSummary = (<OrderSummary 
      ingredients={props.ingredients}
      purchaseCanceled={purchaseCancelHandler}
      purchaseContinue={purchaseContinueHandler}
      price={props.totalPrice}/>);
  }

  return (
    <>
      <Modal show={isPurchasing} modalClose={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </>
  );
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