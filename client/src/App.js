import React, { Component, Fragment } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit";
import RoomList from "./components/room-list";
import MessageList from "./components/message-list";
import SendMessageForm from "./components/send-message";
import NewRoomForm from "./components/new-room-form";
import Profile from "./components/profile";
import GoogleMap from "./components/map";
import "./style.css";
import Navbar from "./components/navbar";
import Wrapper from "./components/wrapper";
import axios from "axios";
import Api from "../src/utils/API";
import Vidyo from "./components/vidyo";

import { tokenURL, instanceLocator } from "./config";
import { setToken, getToken } from "./utils/helpers";

import { connect } from "react-redux";

import { fetchUser } from "./core/Users";

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    username: null,
    userId: null,
    usersInRooms: null,
    clickedUser: null,
    editProfile: false,
    me: null
  };

  componentDidMount = () => {
    const token = getToken();

    if (token) {
      Api.getMe(token)
        .then(res => {
          this.setState({
            me: res.data,
            userId: res.data._id,
            username: res.data.username
          });
        })
        // ({ data: { _id: userId, username } }) => {
        //   this.setState({ userId, username });
        // })
        .catch(err => console.log("something went wrong with token: ", err));
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      this.state.username !== null &&
      this.state.username !== prevState.username
    ) {
      const chatManager = new ChatManager({
        instanceLocator,
        userId: this.state.username,
        tokenProvider: new TokenProvider({
          url: tokenURL
        })
      });

      chatManager
        .connect()
        .then(currentUser => {
          this.currentUser = currentUser;

          const rooms = this.currentUser.rooms;
          console.log(rooms);
          if (rooms.length > 1) {
            this.setState({ usersInRooms: rooms });
          }
          this.getRooms();
        })
        .catch(err => console.log("error on connecting: ", err));
    }
  };

  getRooms = () => {
    this.currentUser
      .getJoinableRooms()
      .then(joinableRooms => {
        this.setState({
          joinableRooms,
          joinedRooms: this.currentUser.rooms
        });
      })
      .catch(err => console.log("error on joinableRooms: ", err));
  };

  subscribeToRoom = roomId => {
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.setState({
              messages: [...this.state.messages, message]
            });
          }
        }
      })
      .then(room => {
        this.setState({
          roomId: room.id
        });
        this.getRooms();
      })
      .catch(err => console.log(`error on subscribing to room: ${err}`));
  };

  sendMessage = text => {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  };

  createRoom = name => {
    this.currentUser
      .createRoom({
        name
      })
      .then(room => this.subscribeToRoom(room.id))
      .catch(err => console.log("error with create room: ", err));
  };

  login = ({ username, password, shouldPersist }) => {
    console.log("!!!!", shouldPersist);
    axios({
      url: "/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: { username, password }
    })
      .then(response => {
        console.log(
          "response after submitting a new user: ",
          response.config.data
        );
        const newUser = response.data.user;
        console.log(response, newUser);

        setToken(response.data.token, shouldPersist);
        this.setState({
          username: newUser.username,
          userId: newUser._id
        });
      })
      .catch(error => console.error("error", error));
  };

  signUp = ({ username, password, email, shouldPersist }) => {
    console.log("should persist: ", shouldPersist);
    axios({
      url: "/api/users",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      data: { username, password, email }
    }).then(response => {
      console.log("response after signing up: ", response.config.data);
      console.log("data.user: ", response.data.userRes);
      const newUser = response.data.userRes;
      console.log(response, newUser);

      setToken(response.data.token, shouldPersist);
      this.setState({ userId: newUser._id, username: newUser.username });
    });
  };

  usernameClick = username => {
    this.props.fetchUser();
    Api.getUser(username).then(res => {
      console.log("clicked screename, ", res);
      this.setState({ clickedUser: res });
      console.log("my clicked user state: ", this.state.clickedUser);
    });
  };

  editProfile = () => {
    this.setState({ editProfile: true, clickedUser: false });
  };

  render() {
    return (
      <div className="app">
        <Navbar
          onLogin={this.login}
          onSignUp={this.signUp}
          editProfile={this.editProfile}
          valueOfEdit={this.state.editProfile}
          currentUser={this.state.username}
        />

        {!this.state.username ? (
          ""
        ) : (
          <Wrapper>
            <RoomList
              usersInRooms={this.state.usersInRooms}
              roomId={this.state.roomId}
              subscribeToRoom={this.subscribeToRoom}
              rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
            />
            <MessageList
              usernameClick={this.usernameClick}
              roomId={this.state.roomId}
              messages={this.state.messages}
            />
            <NewRoomForm createRoom={this.createRoom} />
            <SendMessageForm
              disabled={!this.state.roomId}
              sendMessage={this.sendMessage}
            />
          </Wrapper>
        )}
        <Profile
          username={this.state.username}
          editProfile={this.editProfile}
          clickedUser={this.state.clickedUser}
          userId={this.state.userId}
          signupSubmitted={!!this.state.username}
        />
        {this.state.username ? (
          <main className="map">
            <GoogleMap me={this.state.me} />
          </main>
        ) : (
          ""
        )}
        <div className="vidyo">
          <Vidyo
            username={this.state.username}
            clickedUser={this.state.clickedUser}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: payload => dispatch(fetchUser(payload))
});

export default connect(
  null,
  mapDispatchToProps
)(App);
