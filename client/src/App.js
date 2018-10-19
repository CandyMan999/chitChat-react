import React, { Component } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit";
import RoomList from "./components/room-list";
import MessageList from "./components/message-list";
import SendMessageForm from "./components/send-message";
import NewRoomForm from "./components/new-room-form";
import "./style.css";
import Navbar from "./components/navbar";


import { tokenURL, instanceLocator } from "./config";

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    username: "",
    password: "",
    currentUser: ""
  };

  // createNewUser = () => {
  //   const chatkit = new Chatkit.default({
  //     instanceLocator: instanceLocator,
  //     key: key
  //   });
  //   chatkit
  //     .createUser({
  //       id: this.state.currentUser,
  //       name: this.state.currentUser
  //     })
  //     .then(res => {
  //       console.log("User created successfully", res);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  // };  I have to do this from a server.. I do not have a server yet

  componentDidMount = () => {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: "John", //TODO create users
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

  navbarInputChange = event => {
    // Pull the name and value properties off of the event.target (the element which triggered the event)
    const { name, value } = event.target;

    // Set the state for the appropriate input field
    this.setState({
      [name]: value
    });
  };

  // When the form is submitted, prevent the default event and alert the username and password
  navbarFormSubmit = event => {
    event.preventDefault();
    if (!this.state.username) {
      alert("Fill out your username please!");
    } else if (this.state.password.length < 6) {
      alert(`Choose a more secure password ${this.state.username}`);
    } else {
      alert(`Hello ${this.state.username}`);
    }

    this.setState({
      username: "",
      password: "",
      currentUser: this.state.username
    });

    // this.createNewUser();
  };

  render() {
    //console.log(...this.state.joinableRooms, this.state.joinedRooms);
    return (
      <div className="app">
        <Navbar
          navInput={this.navbarInputChange}
          navSubmit={this.navbarFormSubmit}
          username={this.state.username}
          password={this.state.password}
        />
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
      </div>
    );
  }
}

export default App;
