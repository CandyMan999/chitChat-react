import axios from "axios";

export default {
  // Gets all books
  creatUser() {
    return axios.get("/api/books");
  }
};
