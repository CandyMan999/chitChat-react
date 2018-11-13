import { combineReducers } from "redux";
import users from "./Users";
import session from "./Session";

const appReducer = combineReducers({
  users,
  session
});
const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
