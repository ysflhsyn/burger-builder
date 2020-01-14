import React from 'react';

import Button from '../UI/Button/Button';

const OrderSummary = (props) => {
    const ingredientSummary 
        = Object.keys(props.ingredients)
                .map( (type) => (<li key={type}>
                                   <span style={{ textTransform: 'capitilize' }}>{type}</span>: 
                                   {props.ingredients[type]}
                                 </li>) );

    return (
      <>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>
          {ingredientSummary}
        </ul>
        <p><strong>Total Price: {props.price.toFixed(2)}</strong></p>
        <p>Continuee to checkout?</p>
        <Button btnType="Danger" clicked={props.purchaseCanceled}>CANCEL</Button>
        <Button btnType="Success" clicked={props.purchaseContinue}>CONTINUE</Button>
      </>
    ); 
}

export default OrderSummary;