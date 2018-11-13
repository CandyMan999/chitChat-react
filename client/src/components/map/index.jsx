import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Api from "../../utils/API";

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
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedUser: props,
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
    console.log(this.state.userLocation);
    return this.state.userLocation ? (
      <Map
        onClick={this.onMapClicked}
        google={this.props.google}
        zoom={7}
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
          this.state.users.map(user =>
            user.pics.length >= 1 ? (
              <Marker
                key={user._id}
                postition={user.location}
                onClick={this.onMarkerClick}
                name={user.username}
                image={user.pics[0].pics.url}
              />
            ) : (
              <Marker
                key={user._id}
                postition={user.location}
                onClick={this.onMarkerClick}
                name={user.username}
              />
            )
          )}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div>
            <h1>{this.state.selectedUser.name}</h1>
            <img
              style={{
                width: "100%",
                height: "auto",
                border: "solid 2px mediumaquamarine"
              }}
              className="d-block w-100"
              src={
                this.state.selectedUser.image
                  ? this.state.selectedUser.image
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

export default GoogleApiWrapper({
  apiKey: "AIzaSyBFUrGNjQUHEI5MHH3XpNLCxWbWhII9_PM"
})(GoogleMap);
