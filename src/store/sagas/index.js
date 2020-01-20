import { takeEvery, all, takeLatest } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import {logoutSaga, checkAuthTimeoutSaga, authSaga, authCheckStateSaga} from './auth';
import {initIngredientSaga} from './burgerBuilder';
import {purchaseBurgerSaga, fetchOrdersSaga} from './order';

export function* watchAuth() {
  yield all([
   takeEvery(actionTypes.AUTH_INIT_LOGOUT, logoutSaga),
   takeEvery(actionTypes.AUTH_INIT_AUTHTIMEOUT, checkAuthTimeoutSaga),
   takeEvery(actionTypes.AUTH_INIT, authSaga),
   takeEvery(actionTypes.AUTH_CHECK_STATE, authCheckStateSaga),
   takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientSaga)
  ]);
}

export function* watchBurgerBuilder() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientSaga);
}

export function* watchOrder() {
  yield takeLatest(actionTypes.PURCHASE_BURGER, purchaseBurgerSaga);
  yield takeEvery(actionTypes.FETCH_ORDERS, fetchOrdersSaga);
}