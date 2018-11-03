import React, { Component, Fragment } from "react";
import Dropzone from "react-dropzone";

import Api from "../../utils/API";
import omit from "lodash/omit";

class Profile extends Component {
  state = {
    intro: "",
    age: null,
    sex: "",
    occupation: "",
    drink: "",
    smoke: "",
    marijuana: "",
    kids: false,
    accepted: [],
    rejected: []
  };

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  fileChangeHandler = e => {
    this.setState({ image: e.target.files[0] });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.editProfile();
    alert("your profile has been updated");
    const id = this.props.userId;
    Api.updateUser(id, omit(this.state, ["accepted", "rejected"]));
  };

  handleImageSubmit = e => {
    e.preventDefault();
  };

  handleOndrop = (accepted, rejected) => {
    console.log("ondrop: ", accepted[0]);

    this.setState({
      accepted: [accepted],
      rejected
    });
    const id = this.props.userId;

    Api.updateImage(id, accepted[0]);
  };

  render() {
    return (
      <Fragment>
        {this.props.signupSubmitted && !this.props.clickedUser ? (
          <main className="profile">
            <h3 className="profileTitle">Your Profile</h3>

            <form
              action={`/api/users/${this.props.userId}/image`}
              method="post"
              encType="multipart/form-data"
            >
              <input type="file" name="image" />
              <hr />
              <input type="submit" value="Submit Photo" />
              Please submit all photos before saving your profile!!!
              <hr />
            </form>
            <form>
              <textarea
                rows="4"
                cols="50"
                style={{ margin: "2px" }}
                type="text"
                placeholder="Intro"
                name="intro"
                value={this.state.intro}
                onChange={e => this.handleChange(e, "intro")}
              />
              {/* <section className="imageSection">
                <div className="dropzone">
                  <Dropzone
                    accept="image/jpeg, image/png"
                    onDrop={this.handleOndrop}
                  >
                    <p>
                      Try dropping some files here, or click to select files to
                      upload.
                    </p>
                    <p>Only *.jpeg and *.png images will be accepted</p>
                  </Dropzone>
                </div>
                <aside>
                  <p>
                    <strong>Accepted files</strong>
                  </p>
                  <ul>
                    {this.state.accepted.map(f => (
                      <li key={f.name}>
                        {f.name} - {f.size} bytes
                      </li>
                    ))}
                  </ul>
                  <p>
                    <strong>Rejected files</strong>
                  </p>
                  <ul>
                    {this.state.rejected.map(f => (
                      <li key={f.name}>
                        {f.name} - {f.size} bytes
                      </li>
                    ))}
                  </ul>
                </aside>
              </section> */}
              <br />
              <input
                type="number"
                placeholder="Age"
                name="age"
                value={this.state.age || ""}
                onChange={e => this.handleChange(e, "age")}
              />
              <br />{" "}
              <input
                type="text"
                placeholder="Occupation"
                name="occupation"
                value={this.state.occupation}
                onChange={e => this.handleChange(e, "occupation")}
              />{" "}
              <br />
              <img
                style={{ height: "30px" }}
                src={"https://png.icons8.com/ios/1600/gender.png"}
                alt="maryJ"
              />
              <select onChange={e => this.handleChange(e, "sex")} name="sex">
                <option value="male" disabled selected>
                  Gender...?
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <img
                style={{ height: "30px" }}
                src={
                  "https://cdn2.iconfinder.com/data/icons/life-moments/404/draft-512.png"
                }
                alt="maryJ"
              />
              <select
                onChange={e => this.handleChange(e, "drink")}
                name="drink"
              >
                <option value="" disabled selected>
                  Drink...?
                </option>
                <option value="yes">Yes</option>
                <option value="socially">Socially</option>
                <option value="never">Never</option>
              </select>
              <img
                style={{ height: "30px" }}
                src={"http://cdn.onlinewebfonts.com/svg/img_490627.png"}
                alt="maryJ"
              />
              <select
                onChange={e => this.handleChange(e, "smoke")}
                name="smoke"
              >
                <option value="" disabled selected>
                  Smoke...?
                </option>
                <option value="yes">Yes</option>
                <option value="socially">Socially</option>
                <option value="never">Never</option>
              </select>
              <img
                style={{ height: "30px" }}
                src={
                  "https://cdn3.iconfinder.com/data/icons/marijuana/480/Solid_Leaf-512.png"
                }
                alt="maryJ"
              />
              <select
                onChange={e => this.handleChange(e, "marijuana")}
                name="marijuana"
              >
                <option value="" disabled selected>
                  420...?{" "}
                </option>
                <option value="friendly">Friendly</option>
                <option value="unfriendly">Unfriendly</option>
              </select>
              <br />
              <input
                onChange={e => this.handleChange(e, "kids")}
                type="checkbox"
                name="kids"
                value={true}
              />
              I have Kids
              <img
                style={{ height: "30px" }}
                src={
                  "https://cdn4.iconfinder.com/data/icons/baby-child-children-kids/100/baby-04-512.png"
                }
                alt="maryJ"
              />
              <br />
              <button onClick={this.handleSubmit} id="profileSubmit">
                Save
              </button>
            </form>
          </main>
        ) : (
          ""
        )}{" "}
        {this.props.clickedUser ? (
          <main className="profile">
            {this.props.clickedUser.pics.map(pic => {
              return (
                <img
                  alt="profile_image"
                  key={pic.pics._id}
                  src={pic.pics.url}
                />
              );
            })}
            <h1 className="headers">Profile</h1>
            <h3>{this.props.clickedUser.username}</h3>{" "}
            <p>
              {" "}
              <img
                style={{ height: "30px" }}
                src={"https://png.icons8.com/ios/1600/gender.png"}
                alt="maryJ"
              />
              {this.props.clickedUser.sex} {this.props.clickedUser.age}
            </p>
            <hr />
            <h4 className="headers">Intro: </h4>
            <p>{this.props.clickedUser.intro}</p>
            <hr />
            <p>
              <span className="headers">
                <strong>Occupation: </strong>
              </span>
              {this.props.clickedUser.occupation}
            </p>
            <hr />
            <p>
              <span className="headers">
                {" "}
                <strong>
                  <img
                    style={{ height: "30px" }}
                    src={
                      "https://cdn2.iconfinder.com/data/icons/life-moments/404/draft-512.png"
                    }
                    alt="maryJ"
                  />
                  Drink:{" "}
                </strong>
              </span>
              {this.props.clickedUser.drink}
            </p>
            <hr />
            <p>
              <span className="headers">
                {" "}
                <strong>
                  {" "}
                  <img
                    style={{ height: "30px" }}
                    src={"http://cdn.onlinewebfonts.com/svg/img_490627.png"}
                    alt="maryJ"
                  />
                  Smoke:{" "}
                </strong>
              </span>

              {this.props.clickedUser.smoke}
            </p>
            <hr />
            <p>
              <span className="headers">
                <strong>
                  <img
                    style={{ height: "30px" }}
                    src={
                      "https://cdn3.iconfinder.com/data/icons/marijuana/480/Solid_Leaf-512.png"
                    }
                    alt="maryJ"
                  />
                  420:{" "}
                </strong>
              </span>

              {this.props.clickedUser.marijuana}
            </p>
            <hr />
            <p>
              <span className="headers">
                <strong>
                  <img
                    style={{ height: "30px" }}
                    src={
                      "https://cdn4.iconfinder.com/data/icons/baby-child-children-kids/100/baby-04-512.png"
                    }
                    alt="maryJ"
                  />
                  Kids:{" "}
                </strong>
              </span>

              {this.props.clickedUser.kids ? "yes" : "no"}
            </p>
          </main>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default Profile;
