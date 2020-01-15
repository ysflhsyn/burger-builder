import React from 'react';

import classes from './Order.module.css';

const Order = (props) => {
  let ingredients = [];

  for(let ingName in props.ingredients) {
    ingredients.push([ingName, props.ingredients[ingName]]);
  }

  ingredients = ingredients.map(ing => <span className={classes.ingredient} key={ing[0]}>{ing[0]} ({ing[1]})</span>);
  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredients}</p>
      <p>Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong></p>
    </div>
  );
  
}

export default Order;