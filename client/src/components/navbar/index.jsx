import React, { Component, Fragment } from "react";
//import { Link } from "react-router-dom";//
import { clearToken } from "../../utils/helpers";
import Api from "../../utils/API";
import Sound from "react-sound";
import soundfile from "../../utils/dial.mp3";
import { setInEdit } from "../../core/Session";
import { connect } from "react-redux";

class Navbar extends Component {
  state = {
    username: null,
    password: "",
    email: "",
    shouldPersist: false,
    login: false,
    signup: false,
    loginSubmitted: false,
    signInSubmitted: false
  };

  handleChange = (e, name) => this.setState({ [name]: e.target.value });

  handleLogin = e => {
    e.preventDefault();
    const { username, password, shouldPersist } = this.state;
    this.props.onLogin({ username, password, shouldPersist });
  };

  handleSignUp = e => {
    e.preventDefault();
    // this.props.editProfile();
    this.setState({ signInSubmitted: true });
    const { username, email, password, shouldPersist } = this.state;
    this.props.onSignUp({ username, email, password, shouldPersist });
  };

  logOut = () => {
    clearToken();
    Api.logOut(this.state.username);
    window.location.reload();
  };

  render() {
    return (
      <nav style={{ color: "mediumaquamarine" }} className="navbar ">
        <h2 className="logo font-effect-fire-animation">AOLisBack</h2>{" "}
        {this.props.currentUser ? (
          ""
        ) : (
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
        )}
        {!this.props.currentUser && this.props.error && (
          <p className="invalid">{this.props.error}</p>
        )}
        {this.state.login && !this.props.currentUser ? (
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
            <span>Keep me signed in </span>
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
        {this.state.signup && !this.props.currentUser ? (
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
            <span>Keep me signed in </span>
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
        {this.props.currentUser || this.props.valueOfEdit ? (
          <Fragment>
            <button onClick={this.logOut} className="logOut">
              LogOut
            </button>{" "}
            <h3 id="editProfile" onClick={this.props.setInEdit}>
              <img
                style={{ height: "30px" }}
                src={
                  "https://cdn3.iconfinder.com/data/icons/simplius-pack/512/pencil_and_paper-512.png"
                }
                alt="edit"
              />{" "}
              Edit Profile
            </h3>
          </Fragment>
        ) : (
          ""
        )}
        {!this.props.currentUser && !this.state.username ? (
          <Sound
            url={soundfile}
            playStatus={Sound.status.PLAYING}
            playFromPosition={300 /* in milliseconds */}
            onLoading={this.handleSongLoading}
            onPlaying={this.handleSongPlaying}
            onFinishedPlaying={this.handleSongFinishedPlaying}
          />
        ) : (
          ""
        )}
      </nav>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setInEdit: () => dispatch(setInEdit())
});

const mapStateToProps = state => ({
  error: state.session.error
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
