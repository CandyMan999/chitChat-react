import React, { Component } from "react";
import Axios from "axios";

class Navbar extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    login: false,
    signup: false
  };

  handleChange = (e, name) => this.setState({ [name]: e.target.value });

  handleLogin = e => {
    e.preventDefault();
    this.props.onLogin(this.state);
  };

  handleSignUp = e => {
    e.preventDefault();
    this.props.onSignUp(this.state);
  };

  loginClick = () => {
    this.setState({ login: !this.state.login, signup: false });
  };

  signupClick = () => {
    this.setState({ signup: !this.state.signup, login: false });
  };

  render() {
    return (
      <nav
        style={{ color: "mediumaquamarine", backgroundColor: "red !important" }}
        className="navbar "
      >
        {" "}
        <div className="navButtons">
          <button onClick={() => this.loginClick()} className="sign-up">
            Login
          </button>
          <button onClick={() => this.signupClick()} className="sign-up">
            Sign-Up
          </button>
        </div>
        {this.state.login ? (
          <form>
            <input
              style={{ margin: "2px" }}
              type="text"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e, "username")}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={e => this.handleChange(e, "password")}
            />
            <button id="submit" onClick={this.handleLogin}>
              Submit
            </button>
          </form>
        ) : (
          ""
        )}{" "}
        {this.state.signup ? (
          <form>
            <input
              style={{ margin: "2px" }}
              type="text"
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={e => this.handleChange(e, "email")}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={e => this.handleChange(e, "password")}
            />
            <button onClick={this.handleSignUp} id="submit">
              Submit
            </button>
          </form>
        ) : (
          ""
        )}
      </nav>
    );
  }
}

export default Navbar;
