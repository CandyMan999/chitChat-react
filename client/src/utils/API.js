import axios from "axios";

export default {
  creatUser: ({ email, password }) =>
    axios.post("/api/users", { email: email, password: password }).then(res => {
      console.log(res.data);
      if (res.status === 200) {
        return res.data;
      }
    }),

  getUser: id =>
    axios.get(`/api/users/${id}`).then(res => {
      return res.data;
    }),

  saveProfile: ({
    id,
    intro,
    username,
    age,
    sex,
    occupation,
    drink,
    smoke,
    marijuana,
    kids
  }) =>
    axios
      .post(`/api/users/${id}`, {
        intro: intro,
        username: username,
        age: age,
        sex: sex,
        occupation: occupation,
        drink: drink,
        smoke: smoke,
        marijuana: marijuana,
        kids: kids
      })
      .then(res => {
        console.log(res);
      })
};
