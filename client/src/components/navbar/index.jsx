import React, { Component } from "react";
import Axios from "axios";

class Navbar extends Component {
  state = {
    username: "",
    password: "",
    email: "",
    shouldPersist: false,
    login: false,
    signup: false
  };

  handleChange = (e, name) => this.setState({ [name]: e.target.value });

  handleLogin = e => {
    e.preventDefault();
    const { username, password, shouldPersist } = this.state;
    this.props.onLogin({ username, password, shouldPersist });
  };

  handleSignUp = e => {
    e.preventDefault();
    const { username, email, password, shouldPersist } = this.state;
    this.props.onSignUp({ username, email, password, shouldPersist });
  };

  render() {
    return (
      <nav style={{ color: "mediumaquamarine" }} className="navbar ">
        {" "}
        <div className="navButtons">
          <button
            style={{ border: `5px  solid${this.state.login ? " gold" : ""}` }}
            onClick={() => this.setState({ login: true, signup: false })}
            className="sign-up"
          >
            Login
          </button>
          <button
            style={{ border: `5px solid${this.state.signup ? " gold" : ""}` }}
            onClick={() => this.setState({ login: false, signup: true })}
            className="sign-up"
          >
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
            <button id="logSubmit" onClick={this.handleLogin}>
              Submit
            </button>
            <input
              onChange={e => this.handleChange(e, "shouldPersist")}
              type="checkbox"
              name="shouldPersist"
              value={!this.state.shouldPersist}
            />
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
            <input
              style={{ margin: "2px" }}
              type="text"
              placeholder="Username"
              name="username"
              value={this.state.username}
              onChange={e => this.handleChange(e, "username")}
            />
            <button onClick={this.handleSignUp} id="signSubmit">
              Submit
            </button>
            Keep me signed in
            <input
              onChange={e => this.handleChange(e, "shouldPersist")}
              type="checkbox"
              name="shouldPersist"
              value={!this.state.shouldPersist}
            />
          </form>
        ) : (
          ""
        )}
      </nav>
    );
  }
}

export default Navbar;
