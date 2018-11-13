import { all } from "redux-saga/effects";
import sessionSagas from "./Session/sagas";
import userSagas from "./Users/sagas";

function* rootSaga() {
  yield all([...sessionSagas, ...userSagas]);
}

export default rootSaga;
