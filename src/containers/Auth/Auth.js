import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility';

const Auth = props => {
  const [controls, setControls] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Email'
      },
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false,
      value: ''
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Password'
      },
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false,
      value: ''
    }
  });
  const [isSignUp, setIsSignUp] = useState(true);

  const {buildingBurger, setAuthRedirectPath} = props;
  useEffect(() => {
    if(!buildingBurger) setAuthRedirectPath('/');
  }, [buildingBurger, setAuthRedirectPath]);

  const inputChangedHandler = (event, inputID) => {
    const updatedControls = {...controls};
    const updatedControl = {...updatedControls[inputID]};
    updatedControl.value = event.target.value;
    updatedControl.touched = true;
    updatedControl.valid = checkValidity(updatedControl.value, updatedControl.validation);
    updatedControls[inputID] = updatedControl;
    setControls(updatedControls);
  }

  const submitHandler = (event) => {
    event.preventDefault();
    props.auth(controls.email.value, controls.password.value, isSignUp);
  }

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  }

  let inputs = [];
  for(let key in controls) {
    inputs.push([key, controls[key]]);
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

  let errorMessage = null;

  if(props.error) {
    errorMessage = (
      <p>{props.error.message}</p>
    );
  }

  let authRedirect = props.isAuth ? <Redirect to={props.authRedirectPath} /> : null;

  let form = (
    <div className={classes.Auth}>
      {authRedirect}
      {errorMessage}
      <form onSubmit={submitHandler}>
        {inputs}
        <Button btnType="Success">SUBMIT</Button>
      </form>
      <Button btnType="Danger" clicked={switchAuthModeHandler}>SWITCH TO {isSignUp ? "SIGN IN": "SIGN UP"}</Button>
    </div>
  );

  if(props.loading) form = <Spinner />;

  return form
}

const mapStateToProps = state => ({
  loading: state.auth.loading,
  error: state.auth.error,
  isAuth: state.auth.token !== null,
  authRedirectPath: state.auth.authRedirect,
  buildingBurger: state.burgerBuilder.building
});

const mapDispatchToProps = dispatch => ({
  auth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
  setAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);