//actions
export const FETCH_ME = "SESSION/FETCH_ME";
export const SET_ME = "SESSION/SET_ME";
export const LOGIN = "SESSION/LOGIN";
export const LOGOUT = "SESSION/LOGOUT";
export const CLEAR_ME = "SESSION/CLEAR_ME";

export const SET_IN_EDIT = "SESSION/SET_IN_EDIT";
export const REMOVE_IN_EDIT = "SESSION/REMOVE_IN_EDIT";
//initial state
const initialState = {
  me: null,
  inEdit: false
};

//reducer
export default function reducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ME:
      return {
        ...state,
        me: payload
      };
    case CLEAR_ME:
      return {
        ...state,
        me: null
      };
    case SET_IN_EDIT:
      return {
        ...state,
        inEdit: true
      };
    case REMOVE_IN_EDIT:
      return {
        ...state,
        inEdit: false
      };
    default:
      return state;
  }
}

//action creators

//this is doing an api call
export const fetchMe = () => ({
  type: FETCH_ME
});

//this takes the response of the user from fetch and placing it as me into the store
export const setMe = payload => ({
  type: SET_ME,
  payload
});

// export const clearMe = () => ({
//   type: CLEAR_ME
// });

export const login = payload => ({
  type: LOGIN,
  payload
});

// export const logout = () => ({
//   type: LOGOUT
// });

export const setInEdit = () => ({
  type: SET_IN_EDIT
});

export const removeInEdit = () => ({
  type: REMOVE_IN_EDIT
});
