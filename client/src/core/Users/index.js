// actions  these are just strings the name of the action to run, stings need to be unique/ you can but not always neccessary export actions
const FETCH_USER = "USERS/FETCH_USER";

//reducer  function that mutates state
const initialState = {};
export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  console.log(type);
  switch (type) {
    case FETCH_USER:
      console.log("in reducer");
      return { test: "test" };
    default:
      return state;
  }
}

//action creators  the actual functions that send actions to the reducer export all of our creators import with {}
export const fetchUser = payload =>
  console.log("fires") || {
    type: FETCH_USER,
    payload
  };
