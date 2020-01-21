import React, { useState } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { checkValidity } from '../../../shared/utility';

const ContactData = props => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'ZIP Code'
      },
      value: '',
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5
      },
      valid: false,
      touched: false
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-Mail'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [{value: 'fastest', displayValue: 'Fastest'},
                  {value: 'cheapest', displayValue: 'Cheapest'}]
      },
      value: 'fastest',
      touched: false,
      valid: true
    },
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const orderHandler = (event) => {
    event.preventDefault();
    const formData = {};
    for(let formEl in orderForm) {
      formData[formEl] = orderForm[formEl].value;
    }
    const order = {
      ingredients: props.ingredients,
      price: props.totalPrice,
      orderData: formData,
      userId: props.userId
    };
    props.orderBurger(order, props.token);
  }

  const inputChangedHandler = (event, inputID) => {
    const updatedOrderForm = {...orderForm};
    const updatedFormELement = {...updatedOrderForm[inputID]};
    updatedFormELement.value = event.target.value;
    updatedFormELement.touched = true;
    updatedFormELement.valid = checkValidity(updatedFormELement.value, updatedFormELement.validation);
    updatedOrderForm[inputID] = updatedFormELement;

    let formIsValid = true;
    for(let inputID in updatedOrderForm) {
      formIsValid = formIsValid && updatedOrderForm[inputID].valid;
    }

    setOrderForm(updatedOrderForm);
    setIsFormValid(formIsValid)
  }

  let inputs = [];
  for(let key in orderForm) {
    inputs.push([key, orderForm[key]]);
  }
  inputs = inputs.map( (input) => (
    <Input key={input[0]} 
            changed={event => inputChangedHandler(event, input[0])}
            invalid={!input[1].valid}
            elementConfig={input[1].elementConfig}
            elementType={input[1].elementType}
            shouldValidate={input[1].validation}
            touched={input[1].touched}/>
  ) );
  let form = (
    <div className={classes.ContactData}>
      <h4>Enter your contact data</h4>
      <form onSubmit={orderHandler}>
        {inputs}
        <Button btnType="Success" disabled={!isFormValid}>ORDER</Button>
      </form>
    </div>
  );
  if(props.loading) {
    form = <Spinner />;
  }
  return form;
}

const mapStateToProps = state => ({
  ingredients: state.burgerBuilder.ingredients,
  totalPrice: state.burgerBuilder.totalPrice,
  loading: state.order.loading,
  token: state.auth.token,
  userId: state.auth.userId
});

const mapDispatchToProps = dispatch => ({
  orderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
});

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));