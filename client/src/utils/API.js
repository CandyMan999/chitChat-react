import axios from "axios";
import { getToken } from "./helpers";

export default {
  uploadPhoto: (file, id) => {
    const data = new FormData();
    data.append("image", file);
    return axios({
      url: `/api/users/${id}/image`,
      method: "POST",
      headers: {
        "content-type": "multipart/form-data"
      },
      data
    });
  },
  deletePhoto: (id, photoId) =>
    axios({
      url: `/api/users/${id}/images/${photoId}`,
      method: "DELETE"
    }),
  deleteRoom: roomId =>
    axios({
      url: `/api/rooms/${roomId}`,
      method: "DELETE"
    }),
  creatUser: data => axios.post("/api/users", data),
  authenticate: username =>
    axios({
      url: `/authenticate?userId=${username}`,
      method: "POST"
    }),
  logOut: username => {
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

  signUp: data =>
    axios({
      url: "/api/users",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data
    }),

  blockUser: (blockingUser, blockedUser) =>
    axios({
      url: `/api/block/${blockingUser}/${blockedUser}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => console.log(res)),

  unBlockUser: (blockingUser, blockedUser) =>
    axios({
      url: `/api/unblock/${blockingUser}/${blockedUser}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => console.log(res)),

  getAllUsers: () =>
    axios.get("/api/users").then(res => {
      return res.data;
    }),

  getUser: username =>
    axios.get(`/api/users/${username}`).then(res => {
      return res.data;
    }),
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
  },

  reload: username => {
    axios({
      url: `/api/reload/${username}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
};
