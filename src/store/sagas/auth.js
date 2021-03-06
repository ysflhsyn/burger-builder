import { put, delay} from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions';

export function* logoutSaga() {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');
  yield put(actions.logoutSuccess());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

export function* authSaga(action) {
  yield put(actions.authStart());
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  };
  let apiEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD6gL0xw9nMBIT2ClXl70UBv6ZoUK5zWcY';
  if(!action.isSignUp) apiEndpoint = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD6gL0xw9nMBIT2ClXl70UBv6ZoUK5zWcY';
  
  try {
    const res = yield axios.post(apiEndpoint, authData);
    const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
    localStorage.setItem('token', res.data.idToken);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userId', res.data.localId);
    yield put(actions.authSuccess(res.data.idToken, res.data.localId));
    yield put(actions.checkAuthTimeout(res.data.expiresIn));
  }catch(err) {
    yield put(actions.authFail(err.response.data.error))
  }
}

export function* authCheckStateSaga() {
  const token = localStorage.getItem('token');
  if(!token) yield put(actions.logout());
  else {
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    const userId = localStorage.getItem('userId');
    if(expirationDate < new Date()) yield put(actions.logout());
    else {
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
}