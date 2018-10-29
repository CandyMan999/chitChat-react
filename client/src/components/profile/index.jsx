import React, { Component, Fragment } from "react";
import Dropzone from "react-dropzone";
import axios from "axios";

class Profile extends Component {
  state = {
    intro: "",
    username: "",
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

  handleChange = (e, name) => this.setState({ [name]: e.target.value });

  handleSubmit = e => {
    e.preventDefault();
    const id = this.props.userId;
    axios
      .put(`/api/users/${id}`, {
        intro: this.state.intro,
        age: this.state.age,
        sex: this.state.sex,
        occupation: this.state.occupation,
        drink: this.state.drink,
        smoke: this.state.smoke,
        marijuana: this.state.marijuana,
        kids: this.state.kids
      })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    return (
      <Fragment>
        {this.props.signupSubmitted ? (
          <main className="profile">
            <h3 className="profileTitle">Your Profile</h3>
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
              <section className="imageSection">
                <div className="dropzone">
                  <Dropzone
                    accept="image/jpeg, image/png"
                    onDrop={(accepted, rejected) => {
                      this.setState({ accepted, rejected });
                    }}
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
              </section>
              <br />
              <input
                type="number"
                placeholder="Age"
                name="age"
                value={this.state.age}
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
              <select onChange={e => this.handleChange(e, "sex")} name="sex">
                <option value="" disabled selected>
                  Gender...?
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
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
              <select
                onChange={e => this.handleChange(e, "marijuana")}
                name="marijuana"
              >
                <option value="" disabled selected>
                  420...?
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
              <br />
              <button onClick={this.handleSubmit} id="profileSubmit">
                Save
              </button>
            </form>
          </main>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}

export default Profile;
