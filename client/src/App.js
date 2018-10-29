import React, { Component } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit";
import RoomList from "./components/room-list";
import MessageList from "./components/message-list";
import SendMessageForm from "./components/send-message";
import NewRoomForm from "./components/new-room-form";
import Profile from "./components/profile";
import "./style.css";
import Navbar from "./components/navbar";
import Wrapper from "./components/wrapper";
import axios from "axios";
import Api from "../src/utils/API";

import { tokenURL, instanceLocator } from "./config";
import { setToken, getToken } from "./utils/helpers";

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    username: null,
    userId: null
  };

  componentDidMount = () => {
    const token = getToken();
    console.log("my token when the component mounted: ", token);
    if (token) {
      Api.getMe(token)
        .then(({ data: { _id: userId, username } }) => {
          this.setState({ userId, username });
        })
        .catch(err => console.log("something went wrong with token: ", err));
    }
  };

  componentDidUpdate = () => {
    if (this.state.username !== null) {
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
        console.log("!!!!", shouldPersist);
        setToken(response.data.token, shouldPersist);
        this.setState({
          username: newUser.username,
          userId: newUser._id
        });
      })
      .catch(error => console.error("error", error));
  };

  signUp = data => {
    Api.creatUser(data).then(res => {
      console.log(res);
      this.setState({ userId: res.data._id, username: res.data.username });
    });
  };

  render() {
    //console.log(...this.state.joinableRooms, this.state.joinedRooms);
    return (
      <div className="app">
        <Navbar onLogin={this.login} onSignUp={this.signUp} />

        {!this.state.username ? (
          ""
        ) : (
          <Wrapper>
            <RoomList
              roomId={this.state.roomId}
              subscribeToRoom={this.subscribeToRoom}
              rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
            />
            <MessageList
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
          userId={this.state.userId}
          signupSubmitted={!!this.state.username}
        />
      </div>
    );
  }
}

export default App;
