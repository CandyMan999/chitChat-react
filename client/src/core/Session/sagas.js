import { takeLatest, call, put } from "redux-saga/effects";

import {
  setError,
  FETCH_ME,
  setMe,
  LOGIN,
  LOGOUT,
  SIGNUP,
  clearMe,
  fetchMe as fetchMeAction
} from "./index";
import Api from "../../utils/API";

import { getToken, setToken, clearToken } from "../../utils/helpers";
import { setProfileUser } from "../Users";

//call invokes a function
//put belongs with action creators and with the context of redux invokes it
//put takes an actual action type and palyoad... that function evaluates to an object which is passed to the put

function* fetchMe() {
  const token = getToken();
  if (token) {
    const response = yield call(Api.fetchMe, token);
    if (response.data) {
      yield put(setMe(response.data));
      yield put(setProfileUser(response.data));
    }
  }
}

function* login({ payload: { username, shouldPersist, password } }) {
  try {
    const response = yield call(Api.login, { username, password });
    if (response) {
      setToken(response.data.token, shouldPersist);
      yield put(setMe(response.data.user));
      yield put(setProfileUser(response.data.user));
    }
  } catch (error) {
    console.error("error", error);
    yield put(setError("Invalid Username or Password"));
  }
}

function* signUp({ payload: { username, email, password, shouldPersist } }) {
  try {
    const response = yield call(Api.signUp, { username, email, password });
    if (response) {
      setToken(response.data.token, shouldPersist);
      yield put(setMe(response.data.userRes));
      yield put(setProfileUser(response.data.userRes));
    }
  } catch (error) {
    console.log(error);
  }
}

///this is boiler plate needed for each ruducer folder..... several sagas for each reducer
export const sessionSagas = [
  takeLatest(FETCH_ME, fetchMe),
  takeLatest(LOGIN, login),
  takeLatest(SIGNUP, signUp)
];

export default sessionSagas;
