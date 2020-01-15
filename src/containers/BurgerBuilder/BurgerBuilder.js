import React, {Component} from 'react';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
    error: false
  }

  componentDidMount() {
    axios.get('/ingredients.json')
          .then( res => {
            this.setState({ingredients: res.data});
          })
          .catch( err => {
            this.setState({error: true});
          });
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseContinueHandler = () => {
    const queryParams = [];
    for(let type in this.state.ingredients) {
      queryParams.push(encodeURIComponent(type) + '=' + encodeURIComponent(this.state.ingredients[type]));
    }
    
    const queryString = queryParams.join('&') + '&price=' + encodeURIComponent(this.state.totalPrice);
    this.props.history.push({
      pathname: '/checkout',
      search: queryString
    });
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
                      .reduce( (sum, type) =>  sum + ingredients[type], 0);
    this.setState({
      purchasable: sum > 0
    });
  }

  addIngredientHandler = (type) => {
    const updatedIngredients = {...this.state.ingredients};
    updatedIngredients[type] = this.state.ingredients[type] + 1;
    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
  }

  removeIngredientHandler = (type) => {
    const updatedIngredients = {...this.state.ingredients};
    if(this.state.ingredients[type] <= 0) {
      return;
    }
    updatedIngredients[type] = this.state.ingredients[type]- 1;
    const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    this.setState({
      totalPrice: newPrice,
      ingredients: updatedIngredients
    });
    this.updatePurchaseState(updatedIngredients);
  }

  render() {
    const disabledInfo = {...this.state.ingredients};
    for(let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0; 
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded</p> :<Spinner />;

    if(this.state.ingredients) {
      burger = (
        <>
          <Burger ingredients={this.state.ingredients}/>
          <BuildControls 
            ingredientAdd={this.addIngredientHandler}
            ingredientRemove={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={this.state.purchasable}
            order={this.purchaseHandler}
          />
        </>
      );
      orderSummary = (<OrderSummary 
        ingredients={this.state.ingredients}
        purchaseCanceled={this.purchaseCancelHandler}
        purchaseContinue={this.purchaseContinueHandler}
        price={this.state.totalPrice}/>);
    }

    if(this.state.loading) {
      orderSummary = <Spinner />;
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

export default withErrorHandler(BurgerBuilder, axios);