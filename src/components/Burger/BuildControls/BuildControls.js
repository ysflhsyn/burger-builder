import React from 'react';

import classes from './BuildControls.module.css';
import BuildCotrol from './BuildControl/BuildControl';

const controls = [
  {label: 'Salad', type: 'salad'},
  {label: 'Bacon', type: 'bacon'},
  {label: 'Cheese', type: 'cheese'},
  {label: 'Meat', type: 'meat'},
];

const BuildControls = (props) => (
  <div className={classes.BuildControls}>
    <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>
    {controls.map( (control) => <BuildCotrol key={control.label} 
                                             label={control.label}
                                  ingredientAdd={() => props.ingredientAdd(control.type)}
                                  ingredientRemove={() => props.ingredientRemove(control.type)} 
                                  disabled={props.disabled[control.type]}/> )}
    <button className={classes.OrderButton} 
            disabled={!props.purchasable}
            onClick={props.order}>{props.isAuth ? 'ORDER NOW' : 'Sign in to order'}</button>
  </div>
);

export default BuildControls;