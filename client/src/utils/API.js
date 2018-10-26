import axios from "axios";

export default {
  // Gets all books
  creatUser({ email, password }) {
    axios
      .post("/api/users", { email: email, password: password })
      .then(res => console.log(res));
  }
};
