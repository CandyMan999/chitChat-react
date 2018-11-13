import axios from "axios";
import { getToken } from "./helpers";

export default {
  creatUser: data => axios.post("/api/users", data),

  logOut: username => {
    console.log("username logout: ", username);
    axios.put(`/api/logout/${username}`).then(res => {
      return res.data;
    });
  },
  login: data =>
    axios({
      url: "/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data
    }),

  getAllUsers: () =>
    axios.get("/api/users").then(res => {
      return res.data;
    }),

  getUser: username =>
    axios.get(`/api/users/${username}`).then(res => {
      return res.data;
    }),

  // fetchUser: username => {
  //   console.log("this is happening");
  //   axios.get(`/api/users/${username}`).then(res => {
  //     return res.data;
  //   });
  // },

  getMe: token =>
    axios({
      url: "/api/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  fetchMe: token =>
    axios({
      url: "/api/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }),

  updateUser: (id, data) =>
    console.log(id, data) ||
    axios({
      url: `/api/users/${id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      data
    }),

  updateImage: (id, data) => {
    console.log("file on the backend: ", data);
    // console.log("update image");
    // const form = new FormData();
    // form.append("file", data, data.name);

    // axios({
    //   url: `/api/users/${id}/image`,
    //   method: "POST",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Content-Type": `application/x-www-form-urlencoded`
    //   },
    //   data
    // });
  }
  // axios({
  //   url: `/api/users/${id}/image`,
  //   method: "POST",
  //   headers: {
  //     "Content-Type": `multipart/form-data`
  //   },
  //   form
  // });
  //}
};
