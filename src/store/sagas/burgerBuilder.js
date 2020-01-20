import { put } from 'redux-saga/effects';

import * as actions from '../actions';
import axios from '../../axios-orders';

export function* initIngredientSaga() {
  try {
    const res = yield  axios.get('/ingredients.json');
    yield put(actions.setIngredients(res.data))
  }catch(err) {
    yield put(actions.fetchIngredientsFailed());
  }
}