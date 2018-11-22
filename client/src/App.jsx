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
import MediaQuery from "react-responsive";

import Api from "./utils/API";
import Vidyo from "./components/vidyo";
import { clearToken } from "./utils/helpers";

import { tokenURL, instanceLocator } from "./config";

import { connect } from "react-redux";
import { fetchMe, login, signUp } from "./core/Session";
import { fetchUser, blockUser } from "./core/Users";
import CellPhone from "./components/cell-phone";

class App extends Component {
  state = {
    roomId: null,
    messages: [],
    joinableRooms: [],
    joinedRooms: [],
    usersInRooms: null,
    clickedUser: null,
    editProfile: false,
    prevRoomId: null
  };

  componentDidMount = async () => {
    await this.props.fetchMe();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const username = this.props.me && this.props.me.username;

    Api.reload(this.props.me.username);

    if (username && (!prevProps.me || username !== prevProps.me.username)) {
      const chatManager = new ChatManager({
        instanceLocator,
        userId: username,
        tokenProvider: new TokenProvider({
          url: tokenURL,
          queryParams: { userId: username }
        })
      });

      chatManager
        .connect({
          onAddedToRoom: room => {
            console.log(`Added to room ${room.name}`);
          },
          onRemovedFromRoom: room => {
            console.log("user left room", room);
          }
        })
        .then(currentUser => {
          this.currentUser = currentUser;

          const rooms = this.currentUser.rooms;

          this.setState({ usersInRooms: rooms });

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
    if (this.state.prevRoomId) {
      const username = this.props.me && this.props.me.username;
      this.currentUser
        .removeUserFromRoom({
          userId: username,
          roomId: this.state.prevRoomId
        })
        .then(() => {
          const allRooms = [
            ...this.state.joinableRooms,
            ...this.state.joinedRooms
          ];

          allRooms.forEach(room => {
            if (room.userIds.length === 0 && room.name !== "Dallas") {
              Api.deleteRoom(room.id).then(res => {
                console.log("we have a deleted a room", res);
                this.getRooms();

                this.setState({
                  joinedRooms: this.state.joinedRooms.filter(
                    room => room.id !== this.state.prevRoomId
                  ),
                  joinableRooms: this.state.joinableRooms.filter(
                    room => room.id !== this.state.prevRoomId
                  )
                });
              });
            }
          });
        })
        .catch(err => {
          console.log(`Error removing leah from room ${username}: ${err}`);
        });
      //.leaveRoom({ roomId: this.state.prevRoomId })
      // .then(room => {
      //   console.log(`joined this room ${room}`);
      // })
      // .catch(err => {
      //   console.log(`Error leaving room ${this.state.prevRoomId}: ${err}`);
      // });
    }
    this.currentUser
      .joinRoom({ roomId: roomId })
      .then(room => {
        console.log(`Joined room with ID: ${room.id}`);
      })
      .catch(err => {
        console.log(`Error joining room ${roomId}: ${err}`);
      });
    this.setState({ prevRoomId: roomId });
    this.setState({ messages: [] });
    this.currentUser
      .subscribeToRoom({
        roomId: roomId,
        hooks: {
          onNewMessage: message => {
            this.getRooms();
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

  usernameClick = username => {
    this.props.fetchUser({ username });
  };

  editProfile = () => {
    this.setState({ editProfile: true, clickedUser: false });
  };

  // logOut = () => {
  //   clearToken();
  //   Api.logOut(this.props.me.username);
  //   if (this.state.roomId) {
  //     this.currentUser
  //       .removeUserFromRoom({
  //         userId: this.props.me.username,
  //         roomId: this.state.roomId
  //       })
  //       .then(() => {
  //         window.location.reload();
  //       });
  //   }
  // };

  render() {
    window.addEventListener("beforeunload", ev => {
      ev.preventDefault();
      Api.logOut(this.props.me.username);
      this.currentUser
        .removeUserFromRoom({
          userId: this.props.me.username,
          roomId: this.state.roomId
        })
        .then(() => {
          console.log("user left room");
        });

      return (ev.returnValue = "Are you sure you want to close?");
    });

    const username = this.props.me && this.props.me.username;
    return (
      <div className="app">
        <MediaQuery query="(max-device-width: 1023px)">
          <CellPhone />
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1024px)">
          <Navbar
            onLogin={this.props.login}
            onSignUp={this.props.signUp}
            editProfile={this.editProfile}
            valueOfEdit={this.state.editProfile}
            currentUser={username}
            roomId={this.state.roomId}
            logOut={this.logOut}
          />
        </MediaQuery>
        <MediaQuery query="(min-device-width: 1024px)">
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
            me={this.props.me}
            blockUser={this.props.blockUser}
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
                profileUser={this.props.profileUser}
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
        </MediaQuery>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  fetchUser: payload => dispatch(fetchUser(payload)),
  fetchMe: () => dispatch(fetchMe()),
  login: payload => dispatch(login(payload)),
  blockUser: payload => dispatch(blockUser(payload)),
  signUp: payload => dispatch(signUp(payload))
});

const mapStateToProps = state => ({
  me: state.session.me,
  profileUser: state.users.profileUser,
  blockedUsers: state.users.blockedUsers
});
//mapState the mapDispatch order matters connects to the app only for this one file
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
