import React, { Fragment } from "react";
import logo from "../../utils/images/liveBait.png";
import home from "../../utils/images/home.png";
import profile from "../../utils/images/profile.png";

const CellPhone = () => ({
  render() {
    return (
      <Fragment>
        {" "}
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">AOLisBack</h1>
            <p className="lead">
              This website is <span className="cell">NOT</span> for{" "}
              <span className="cell">MOBILE DEVICES</span>!{" "}
              <span className="lucky">LUCKY</span> for you, we have a sister App
              which you can download for Mobile with even MORE cool Features!!
            </p>
            <hr />
            <div className="appStore">
              <a
                href="https://play.google.com/store/apps/details?id=com.livebat"
                className="btn btn-primary"
              >
                LiveBait (Android)
              </a>
              <a
                href="https://itunes.apple.com/us/app/livebait-totally-live/id1334051224?ls=1&mt=8"
                className="btn btn-primary"
              >
                LiveBait (iOS)
              </a>
            </div>
          </div>
        </div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                className="d-block w-100"
                style={{ height: "500px", width: "250px" }}
                src={logo}
                alt="First slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100"
                style={{ height: "500px", width: "250px" }}
                src={home}
                alt="Second slide"
              />
            </div>
            <div className="carousel-item">
              <img
                className="d-block w-100"
                style={{ height: "500px", width: "250px" }}
                src={profile}
                alt="Third slide"
              />
            </div>
          </div>
          <a
            className="carousel-control-prev"
            href="#carouselExampleFade"
            role="button"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#carouselExampleFade"
            role="button"
            data-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </a>
        </div>
      </Fragment>
    );
  }
});

export default CellPhone;
