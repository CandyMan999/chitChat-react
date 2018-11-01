import { combineReducers } from "redux";
import users from "./Users";

const appReducer = combineReducers({
  users
});
const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
