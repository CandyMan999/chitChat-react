import React, { Component } from "react";
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
import Api from "./utils/API";
import Vidyo from "./components/vidyo";

import { tokenURL, instanceLocator } from "./config";
import { setToken, getToken } from "./utils/helpers";

import { connect } from "react-redux";
import { fetchMe, login } from "./core/Session";
import { fetchUser } from "./core/Users";
import API from "./utils/API";

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    usersInRooms: null,
    clickedUser: null,
    editProfile: false
  };

  componentDidMount = () => {
    //const token = getToken();

    this.props.fetchMe();

    // if (token) {
    //   Api.getMe(token)
    //     .then(({ data: { _id: userId, username } }) => {
    //       this.setState({ userId, username });
    //     })
    //     .catch(err => console.log("something went wrong with token: ", err));
    // }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const username = this.props.me && this.props.me.username;
    if (username && (!prevProps.me || username !== prevProps.me.username)) {
      const chatManager = new ChatManager({
        instanceLocator,
        userId: username,
        tokenProvider: new TokenProvider({
          url: tokenURL
        })
      });

      chatManager
        .connect()
        .then(currentUser => {
          this.currentUser = currentUser;

          const rooms = this.currentUser.rooms;
          // console.log(rooms);
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
      // console.log("response after signing up: ", response.config.data);
      // console.log("data.user: ", response.data.userRes);
      const newUser = response.data.userRes;
      console.log(response, newUser);

      setToken(response.data.token, shouldPersist);
      this.setState({ userId: newUser._id, username: newUser.username });
    });
  };

  usernameClick = username => {
    this.props.fetchUser({ username });

    // const user = Api.getUser(username);
    // console.log("this is click: ", user);
    // this.props.fetchUser(user);
    // Api.getUser(username).then(res => {
    //   this.props.fetchUser(res);
    //   console.log("clicked screename, ", res);
    //   this.setState({ clickedUser: res });
    //   console.log("my clicked user state: ", this.state.clickedUser);
    // });
  };

  editProfile = () => {
    this.setState({ editProfile: true, clickedUser: false });
  };

  render() {
    const username = this.props.me && this.props.me.username;
    return (
      <div className="app">
        {/* <source src={soundfile} type="audio/mpeg" /> */}

        <Navbar
          onLogin={this.props.login}
          onSignUp={this.signUp}
          editProfile={this.editProfile}
          valueOfEdit={this.state.editProfile}
          currentUser={username}
        />

        {!username ? (
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
          username={username}
          editProfile={this.editProfile}
          //clickedUser={this.state.clickedUser}
          userId={this.props.me && this.props.me._id}
          signupSubmitted={!!username} //this might blow
        />
        {username && (
          <main className="map">
            <GoogleMap
              me={this.props.me}
              clickedUser={this.props.profileUser}
            />
          </main>
        )}
        <div className="vidyo">
          <Vidyo
            style={{ background: "beige" }}
            username={username}
            clickedUser={this.props.profileUser}
          />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: payload => dispatch(fetchUser(payload)),
  fetchMe: () => dispatch(fetchMe()),
  login: payload => dispatch(login(payload))
});

const mapStateToProps = state => ({
  me: state.session.me,
  profileUser: state.users.profileUser
});
//mapState the mapDispatch order matters connects to the app only for this one file
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
