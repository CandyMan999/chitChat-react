// actions  these are just strings the name of the action to run, stings need to be unique/ you can but not always neccessary export actions
export const FETCH_USER = "USERS/FETCH_USER";

export const FETCH_PROFILE_USER = "USERS/FETCH_PROFILE_USER";
export const SET_PROFILE_USER = "USERS/SET_PROFILE_USER";
export const SET_BLOCKED_USER = "USERS/SET_BLOCKED_USER";
export const BLOCK_USER = "USERS/BLOCK_USER";

//reducer  function that mutates state
const initialState = {
  blockedUsers: [],
  profileUser: null
};
export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;

  switch (type) {
    case SET_PROFILE_USER:
      return {
        ...state,
        profileUser: payload
      };
    case SET_BLOCKED_USER:
      return {
        ...state,
        blockedUsers: [...state.blockedUsers, payload]
      };
    default:
      return state;
  }
}

//action creators  the actual functions that send actions to the reducer export all of our creators import with {}
export const fetchUser = payload => ({
  type: FETCH_USER,
  payload
});

// export const fetchProfileUser = payload => ({
//   type: FETCH_PROFILE_USER,
//   payload
// })
export const blockUser = payload => ({
  type: BLOCK_USER,
  payload
});

export const setBlockedUser = payload => ({
  type: SET_BLOCKED_USER,
  payload
});

export const setProfileUser = payload => ({
  type: SET_PROFILE_USER,
  payload
});
