import React, { Component } from "react";
import { Map, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import Marker from "./marker";
import Api from "../../utils/API";
import { connect } from "react-redux";

class GoogleMap extends Component {
  state = {
    userLocation:
      this.props.me && this.props.me.location.lat && this.props.me.location,
    users: null,
    showingInfoWindow: false,
    activeMarker: {},
    selectedUser: {}
  };

  // TODO need to pass user object down to here or at least userLocation

  componentDidMount() {
    Api.getAllUsers()
      .then(res => {
        this.setState({ users: res });
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps) {
    if (!this.state.userLocation) {
      if (this.props.me && this.props.me.location.lat) {
        this.setState({ userLocation: this.props.me.location });
      } else {
        navigator.geolocation.getCurrentPosition(({ coords }) => {
          Api.updateUser(this.props.me._id, {
            location: { lat: coords.latitude, lng: coords.longitude }
          }).then(() => {
            this.setState({
              userLocation: {
                lat: coords.latitude,
                lng: coords.longitude
              }
            });
          });
        });
      }
    }
    console.log("in update", this.props.profileUser);
    if (
      !!this.props.profileUser &&
      prevProps.profileUser.username !== this.props.profileUser.username
    ) {
      console.log("updating...");
      this.setState({
        selectedUser: this.props.profileUser

        // showingInfoWindow: true
      });
    }
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedUser: props.user,
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };

  render() {
    return this.state.userLocation ? (
      <Map
        onClick={this.onMapClicked}
        google={this.props.google}
        zoom={10}
        style={{ width: "100%", height: "100%" }}
        initialCenter={this.state.userLocation}
      >
        {/* <Marker
          postition={
            this.state.me.location && this.state.me.hasAccepted
              ? this.state.userLocation
              : null
          }
          onClick={this.onMarkerClick}
          name={"Current location"}
        /> */}

        {this.state.users &&
          !!this.state.users.length &&
          this.state.users.map(user => (
            <Marker
              key={user._id}
              postition={user.location}
              onClick={this.onMarkerClick}
              onActivation={marker => this.setState({ activeMarker: marker })}
              user={
                console.log("marker!!", user, this.state.selectedUser) || user
              }
              selected={user.username === this.state.selectedUser.username}
            />
          ))}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={!!this.state.activeMarker}
          onClose={() =>
            this.setState({ selectedUser: {}, activeMarker: null })
          }
        >
          <div>
            <h1 className="profileName font-effect-fire-animation">
              {this.state.selectedUser.username}
            </h1>
            <img
              style={{
                width: "100%",
                height: "auto",
                border: "solid 2px mediumaquamarine",
                borderRadius: "50px"
              }}
              className="d-block w-100"
              src={
                this.state.selectedUser.pics &&
                !!this.state.selectedUser.pics.length
                  ? this.state.selectedUser.pics[0].pics.url
                  : "https://static.thenounproject.com/png/994628-200.png"
              }
              alt="profile_image"
            />
          </div>
        </InfoWindow>
      </Map>
    ) : null;
  }
}

// const mapStateToProps = state => ({
//   profileUser: state.users.profileUser
// });

export default GoogleApiWrapper({
  apiKey: "AIzaSyBFUrGNjQUHEI5MHH3XpNLCxWbWhII9_PM"
})(GoogleMap);
