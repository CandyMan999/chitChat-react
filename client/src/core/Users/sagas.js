import { takeLatest, call, put } from "redux-saga/effects";
import { FETCH_USER, setProfileUser } from "./index";
import Api from "../../utils/API";
import { removeInEdit } from "../Session";

function* fetchUser({ payload: { username } }) {
  const response = yield call(Api.getUser, username);
  console.log("saga", response);
  if (response) {
    yield put(setProfileUser(response));
    yield put(removeInEdit());
  }
}

export const userSagas = [takeLatest(FETCH_USER, fetchUser)];

export default userSagas;
