import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";

import createReducer from "./reducers";

import sagas from "./sagas";
const sagaMiddleware = createSagaMiddleware();

export default function configureStore(state = {}) {
  const middleware = [sagaMiddleware];
  const enhancers = [applyMiddleware(...middleware)];
  const store = createStore(
    createReducer,
    state,
    composeWithDevTools(...enhancers)
  );
  store.runSaga = sagaMiddleware.run;
  store.runSaga(sagas);
  return store;
}

export const store = configureStore();
