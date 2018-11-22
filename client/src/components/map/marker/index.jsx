import React from "react";

class Marker extends React.Component {
  state = {
    marker: null
  };

  componentDidMount() {
    if (this.props.map) this.buildMarker();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.map && this.props.map) this.buildMarker();

    if (!prevProps.selected && this.props.selected) {
      this.props.onActivation(this.state.marker);
      this.animateBounce();
    }

    if (prevProps.selected && !this.props.selected) this.cancelBounce();
  }

  componentWillUnmount() {
    if (this.state.marker) this.state.marker.setMap(null);
  }

  buildMarker = () => {
    const { map, google, ...props } = this.props;

    const { lat, lng } = this.props.user.location;

    const position = new google.maps.LatLng(lat, lng);

    const marker = new google.maps.Marker({
      map,
      position,
      ...props
    });

    google.maps.event.addListener(marker, "click", () =>
      this.props.onClick(this.props, marker)
    );
    this.setState({ marker });
  };

  animateBounce = () => {
    this.state.marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
  };

  cancelBounce = () => {
    this.state.marker.setAnimation(0);
  };

  render() {
    return null;
  }
}

export default Marker;
