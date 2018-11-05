import React, { Component, Fragment } from "react";

class Vidyo extends Component {
  state = {
    roomId: null
  };

  makeRoomid = () => {
    let text = "";
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 7; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    this.setState({ roomId: text });
    console.log("chat roomId: ", this.state.roomId);
  };

  render() {
    return (
      <Fragment>
        {" "}
        {this.state.roomId ? (
          <div>
            {" "}
            <button style={{ position: "absolute" }}>
              test {this.state.roomId}
            </button>
            <iframe
              title="chatshit"
              src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=6ee527d4-9d0f-43eb-b042-b6cae60f360f&room=default&iframe=true`}
              width="800px"
              height="640px"
              allow="microphone; camera"
            />
          </div>
        ) : (
          <div>
            <button onClick={this.makeRoomid}>Join this chat</button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Vidyo;
