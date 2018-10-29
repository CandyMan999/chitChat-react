export const setToken = (token, shouldPersist) =>
  shouldPersist
    ? localStorage.setItem("token", token)
    : sessionStorage.setItem("token", token);
export const getToken = () =>
  sessionStorage.getItem("token") || localStorage.getItem("token");
