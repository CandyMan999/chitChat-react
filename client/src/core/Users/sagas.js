import { takeLatest, call, put } from "redux-saga/effects";
import {
  FETCH_USER,
  setProfileUser,
  BLOCK_USER,
  setBlockedUser
} from "./index";
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
function* blockUser({ payload: username }) {
  if (username) {
    yield put(setBlockedUser(username));
  }
}

export const userSagas = [
  takeLatest(FETCH_USER, fetchUser),
  takeLatest(BLOCK_USER, blockUser)
];

export default userSagas;
