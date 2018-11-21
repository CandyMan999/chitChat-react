import React from "react";
//import {token} from "../../utils/"

const CellPhone = () => ({
  render() {
    return (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">AOLisBack</h1>
          <p className="lead">
            This website is <span className="cell">NOT</span> for{" "}
            <span className="cell">MOBILE DEVICES</span> !{" "}
            <span className="lucky">LUCKY</span> for you we have a sister App
            which you can download for Mobile with even MORE cool Features!!
          </p>
          <hr />
          {/* <img src="../../utils/images/liveBait.png" alt="livebait" /> */}

          <a
            href="https://play.google.com/store/apps/details?id=com.livebat"
            className="btn btn-primary"
          >
            DownLoad LiveBait
          </a>
        </div>
      </div>
    );
  }
});

export default CellPhone;
