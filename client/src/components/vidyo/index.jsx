import React, { Component, Fragment } from "react";
import Banner from "./banner";
import Offline from "./offline";

class Vidyo extends Component {
  state = {};

  determineIsBlocked = () => {
    if (
      this.props.username &&
      this.props.clickedUser &&
      this.props.clickedUser.blockedUsers
    ) {
      return this.props.clickedUser.blockedUsers.some(
        users => users === this.props.username
      );
    } else {
      return false;
    }
  };

  render() {
    const isMyChannel =
      !this.props.clickedUser ||
      this.props.clickedUser.username === this.props.username;

    const isBlocked = this.determineIsBlocked();

    const channelName = isMyChannel
      ? this.props.username
      : this.props.clickedUser.username;

    const channelOffline =
      !isMyChannel && (!this.props.clickedUser.isLoggedIn || isBlocked);

    return this.props.username ? (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Banner
          channelOwner={!isMyChannel && this.props.clickedUser.username}
        />

        <div style={{ flex: 1 }}>
          {channelOffline ? (
            <Offline
              username={this.props.clickedUser.username}
              isBlocked={isBlocked}
            />
          ) : (
            <iframe
              title="chatshit"
              src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=6ee527d4-9d0f-43eb-b042-b6cae60f360f&room=${channelName}&iframe=true`}
              allow="microphone; camera"
            />
          )}
        </div>
      </div>
    ) : (
      ""
    );
  }
}

export default Vidyo;
