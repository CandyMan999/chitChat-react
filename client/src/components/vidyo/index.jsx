import React, { Component, Fragment } from "react";

class Vidyo extends Component {
  state = {};

  render() {
    return (
      <Fragment>
        {this.props.username && !this.props.clickedUser ? (
          <div>
            {" "}
            <h5 className="videoTitle">
              Join your own channel or click someone elses SCREEName to join
              their channel!
            </h5>
            <iframe
              title="chatshit"
              src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=6ee527d4-9d0f-43eb-b042-b6cae60f360f&room=${
                this.props.username
              }&iframe=true`}
              allow="microphone; camera"
            />
          </div>
        ) : this.props.clickedUser ? (
          <div>
            {" "}
            {this.props.clickedUser.username === this.props.username ? (
              <h5 className="videoTitle">
                Join your own channel or click someone elses SCREEName to join
                their channel!
              </h5>
            ) : (
              <h5 className="videoTitle">
                Join {this.props.clickedUser.username}
                's channel or clicked your SCREEName to join your own!
              </h5>
            )}
            {this.props.clickedUser.isLoggedIn ? (
              <Fragment>
                <iframe
                  title="chatshit"
                  src={`https://tokbox.com/embed/embed/ot-embed.js?embedId=6ee527d4-9d0f-43eb-b042-b6cae60f360f&room=${
                    this.props.clickedUser.username
                  }&iframe=true`}
                  allow="microphone; camera"
                />
              </Fragment>
            ) : (
              <h3
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: "20%"
                }}
              >
                Sorry {this.props.clickedUser.username} is OFFLINE!!
              </h3>
            )}
          </div>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default Vidyo;
