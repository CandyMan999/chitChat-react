import axios from "axios";
import { getToken } from "./helpers";

export default {
  creatUser: data => axios.post("/api/users", data),

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

  updateUser: (id, data) =>
    console.log(id) ||
    axios({
      url: `/api/users/${id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`
      },
      data
    })
};
