import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { Redirect } from 'react-router-dom';
import { checkValidity } from '../../shared/utility';

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignUp: true
  }

  componentDidMount() {
    if(!this.props.buildingBurger) this.props.setAuthRedirectPath('/');
  }

  inputChangedHandler = (event, inputID) => {
    const updatedControls = {...this.state.controls};
    const updatedControl = {...updatedControls[inputID]};
    updatedControl.value = event.target.value;
    updatedControl.touched = true;
    updatedControl.valid = checkValidity(updatedControl.value, updatedControl.validation);
    updatedControls[inputID] = updatedControl;
    this.setState({
      controls: updatedControls
    });
  }

  submitHandler = (event) => {
    event.preventDefault();
    this.props.auth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignUp);
  }

  switchAuthModeHandler = () => {
    this.setState( prevState => ({isSignUp: !prevState.isSignUp}) );
  }

  render() {
    let inputs = [];
    for(let key in this.state.controls) {
      inputs.push([key, this.state.controls[key]]);
    }
    inputs = inputs.map( (input) => (
      <Input key={input[0]} 
             changed={event => this.inputChangedHandler(event, input[0])}
             invalid={!input[1].valid}
             elementConfig={input[1].elementConfig}
             elementType={input[1].elementType}
             shouldValidate={input[1].validation}
             touched={input[1].touched}/>
    ) );

    let errorMessage = null;

    if(this.props.error) {
      errorMessage = (
        <p>{this.props.error.message}</p>
      );
    }

    let authRedirect = this.props.isAuth ? <Redirect to={this.props.authRedirectPath} /> : null;

    let form = (
      <div className={classes.Auth}>
        {authRedirect}
        {errorMessage}
        <form onSubmit={this.submitHandler}>
          {inputs}
          <Button btnType="Success">SUBMIT</Button>
        </form>
        <Button btnType="Danger" clicked={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignUp ? "SIGN IN": "SIGN UP"}</Button>
      </div>
    );

    if(this.props.loading) form = <Spinner />;

    return form
  };
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