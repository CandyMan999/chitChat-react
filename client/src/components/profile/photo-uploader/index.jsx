import React, { Component, Fragment } from "react";
import Dropzone from "react-dropzone";

import Api from "../../../utils/API";

class PhotoUploader extends Component {
  state = {
    images: []
  };

  componentWillUnmount() {
    this.state.images.forEach(image => URL.revokeObjectURL(image));
  }

  onDropAccepted = files => {
    files.forEach(file => {
      Api.uploadPhoto(file, this.props.id).then(res =>
        this.setState({
          images: [
            ...this.state.images,
            {
              ...file,
              id: res.data.data.imageId,
              preview: URL.createObjectURL(file)
            }
          ]
        })
      );
    });
  };

  handleDelete = image => {
    Api.deletePhoto(this.props.id, image.id).then(() => {
      this.setState({
        images: this.state.images.filter(cImage => cImage.id !== image.id)
      });
    });
  };

  render() {
    return (
      <div>
        <Dropzone
          accept="image/jpeg, image/png"
          maxSize={500000}
          onDropAccepted={console.log("test") || this.onDropAccepted}
          onDropRejected={console.log("duh")}
          className="photo-uploader"
        >
          <div style={{ width: "300px", display: "flex", flexWrap: "wrap" }}>
            {this.state.images.map(image => (
              <div style={{ position: "relative" }}>
                <img
                  src={image.preview}
                  width={100}
                  height={100}
                  alt="fuck off"
                />

                <button
                  className="deleteIcon"
                  //onClick={() => this.handleDelete(this.props.me.pics[i]._id)}
                  onClick={() => this.handleDelete(image)}
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </Dropzone>
      </div>
    );
  }
}

export default PhotoUploader;
