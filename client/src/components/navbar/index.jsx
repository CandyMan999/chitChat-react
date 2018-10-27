import React, { Component } from "react";
import Axios from "axios";

class Navbar extends Component {
  state = {
    username: "",
    password: "",
    email: ""
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

  render() {
    return (
      <nav style={{ color: "mediumaquamarine" }} className="navbar ">
        {" "}
        <div className="navButtons">
          {this.props.login ? (
            <button
              style={{ border: "5px  solid gold" }}
              onClick={() => this.props.loginClick()}
              className="sign-up"
            >
              Login
            </button>
          ) : (
            <button onClick={() => this.props.loginClick()} className="sign-up">
              Login
            </button>
          )}
          {this.props.signup ? (
            <button
              style={{ border: "5px solid gold" }}
              onClick={() => this.props.signupClick()}
              className="sign-up"
            >
              Sign-Up
            </button>
          ) : (
            <button
              onClick={() => this.props.signupClick()}
              className="sign-up"
            >
              Sign-Up
            </button>
          )}
        </div>
        {this.props.login ? (
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
          </form>
        ) : (
          ""
        )}{" "}
        {this.props.signup ? (
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
            <button onClick={this.handleSignUp} id="signSubmit">
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
