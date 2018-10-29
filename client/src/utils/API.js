import axios from "axios";

export default {
  creatUser: data => axios.post("/api/users", data),

  getUser: id =>
    axios.get(`/api/users/${id}`).then(res => {
      return res.data;
    }),

  getMe: token =>
    axios({
      url: "/api/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
};
