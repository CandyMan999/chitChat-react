import React, { Component } from "react";

class Navbar extends Component {
  state = {
    username: "",
    password: ""
  };

  handleChange = (e, name) => this.setState({ [name]: e.target.value });

  handleSignUp = e => {
    e.preventDefault();
    this.props.onSignup(this.state);
  };

  render() {
    return (
      <nav
        style={{ color: "mediumaquamarine", backgroundColor: "red !important" }}
        className="navbar "
      >
        {" "}
        <div className="sign-up">Create A UserName and Password</div>
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
          <button id="submit" onClick={this.handleSignUp}>
            Submit
          </button>
        </form>
      </nav>
    );
  }
}

export default Navbar;
