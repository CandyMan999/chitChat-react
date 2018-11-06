import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
import Api from "../../utils/API";

class GoogleMap extends Component {
  state = {
    userLocation: this.props.me.userLocation
  };

  // TODO need to pass user object down to here or at least userLocation

  componentDidMount() {
    if (!this.state.userLocation) {
      console.log("!!!", this.props.me);
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        console.log("!!!!!!", coords);
        console.log("about to set state");
        Api.updateUser(this.props.me._id, {
          location: { lat: coords.latitude, lng: coords.longitude }
        }).then(() => {
          // TODO get mongo id passed down to this component as part of me
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

  onMarkerClick = () => {
    if (this.props.me.hasAccepted) {
      alert(this.props.me.username);
    } else {
      alert("you clicked me");
    }
  };

  render() {
    return this.state.userLocation ? (
      <Map
        google={this.props.google}
        zoom={14}
        style={{ width: "100%", height: "100%" }}
        initialCenter={this.state.userLocation}
      >
        <Marker
          postition={
            this.props.me.location && this.props.me.hasAccepted
              ? this.state.userLocation
              : null
          }
          onClick={this.onMarkerClick}
          name={"Current location"}
        />

        <InfoWindow onClose={this.onInfoWindowClose} />
      </Map>
    ) : null;
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBFUrGNjQUHEI5MHH3XpNLCxWbWhII9_PM"
})(GoogleMap);
