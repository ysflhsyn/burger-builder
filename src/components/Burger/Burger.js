import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = (props) => {
  let ingredients = Object.keys(props.ingredients)
                            .map(ing => [...Array(props.ingredients[ing])]
                            .map((_, i) => <BurgerIngredient key={ing + i}
                                                             type={ing} />))
                            .reduce((arr, el) => [...arr, ...el], []);
                            
  if(!ingredients.length) {
    ingredients = <p>Please start adding ingredients!</p>;
  }
  
  return (
    <div className={classes.Burger}>
      <BurgerIngredient type="bread-top"/>
      {ingredients}
      <BurgerIngredient type="bread-bottom"/>
    </div>
  );
};

export default Burger;