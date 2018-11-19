import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PhotoUploader from "./photo-uploader";
import Api from "../../utils/API";
import omit from "lodash/omit";
import { getProfileUser } from "../../core/Users/selectors";
import { fetchMe, blockUser, unBlockUser } from "../../core/Session";
import { fetchUser } from "../../core/Users";
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
    hasAccepted: false,
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
    window.location.reload();
    // this.props.fetchUser(this.props.me.username)// TODO set in edit to false here somehow
  };

  handleImageSubmit = e => {
    e.preventDefault();
  };

  blockUserClick = () => {
    const blockedUser = this.props.clickedUser.username;
    const blockingUser = this.props.me.username;
    Api.blockUser(blockingUser, blockedUser).then(() =>
      this.props.blockUser(blockedUser)
    );
    alert(`${blockedUser} has been Blocked!`);
  };

  unblockUser = () => {
    const blockedUser = this.props.clickedUser.username;
    const blockingUser = this.props.me.username;
    Api.unBlockUser(blockingUser, blockedUser).then(() => {
      this.props.unblockUser(blockedUser);
    });
    alert(`${blockedUser} has been UNBlOCKED!`);
  };

  determineIsBlocked = () => {
    if (this.props.clickedUser) {
      return this.props.me.blockedUsers.some(
        users => users === this.props.clickedUser.username
      );
    } else {
      return false;
    }
  };

  render() {
    const isBlocked = this.determineIsBlocked();
    console.log("!!!!", isBlocked);
    const showIsBlocked =
      this.props.me &&
      this.props.me.username &&
      this.props.clickedUser &&
      this.props.clickedUser.username !== this.props.me.username;

    return (
      <Fragment>
        {console.log(this.props.inEdit, this.props.clickedUser)}
        {this.props.inEdit ? (
          <main className="profile">
            <h3 className="profileTitle">Your Profile</h3>
            <PhotoUploader id={this.props.userId} />
            {/* <form
              action={`/api/users/${this.props.userId}/image`}
              method="post"
              encType="multipart/form-data"
            >
              <input type="file" name="image" />
              <hr />
              <input type="submit" value="Submit Photo" />
              Please submit all photos before saving your profile!!!
              <hr />
            </form> */}
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
              <div className="selections">
                <img
                  style={{ height: "30px", marginRight: "5px" }}
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
              </div>
              <div className="selections">
                <img
                  style={{ height: "30px", marginRight: "5px" }}
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
              </div>
              <br />
              <div className="selections">
                <img
                  style={{ height: "30px", marginRight: "5px" }}
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
              </div>
              <div className="selections">
                <img
                  style={{ height: "30px", marginRight: "5px" }}
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
              </div>
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
              <input
                onChange={e => this.handleChange(e, "hasAccepted")}
                type="checkbox"
                name="hasAccepted"
                value={true}
              />
              <strong>I agree to share my location</strong>
              <img
                style={{ height: "30px" }}
                src={
                  "https://banner2.kisspng.com/20180605/gv/kisspng-computer-icons-clip-art-ubicacion-5b16ff4e0ed569.6310568615282338060608.jpg"
                }
                alt="mapIcon"
              />
              <br />
              <button onClick={this.handleSubmit} id="profileSubmit">
                Save
              </button>
            </form>
          </main>
        ) : (
          ""
        )}
        {this.props.clickedUser && !this.props.inEdit ? (
          <main className="profile">
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade"
              data-ride="carousel"
            >
              <div className="carousel-inner">
                {this.props.clickedUser.pics.map((pic, i) => {
                  return (
                    <div
                      key={pic.pics._id}
                      className={
                        i === 0 ? "carousel-item active" : "carousel-item "
                      }
                    >
                      <img
                        key={pic.pics._id}
                        style={{
                          width: "100%",
                          height: "auto",
                          border: "solid 2px mediumaquamarine"
                        }}
                        className="d-block w-100"
                        src={pic.pics.url}
                        alt="profile_image"
                      />
                    </div>
                  );
                })}
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleFade"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleFade"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="sr-only">Next</span>
              </a>
            </div>
            <h1 className="headers">Profile</h1>
            <h3>
              {this.props.clickedUser.username}
              <span style={{ float: "right", color: "red" }}>
                {this.props.clickedUser.isLoggedIn ? "Online Now" : "Offline"}
              </span>
            </h3>{" "}
            <p>
              {" "}
              <img
                style={{ height: "30px" }}
                src={"https://png.icons8.com/ios/1600/gender.png"}
                alt="maryJ"
              />
              {this.props.clickedUser.sex} {this.props.clickedUser.age}{" "}
              <span style={{ float: "right", color: "red" }}>
                Location Status{" "}
                {this.props.clickedUser.hasAccepted ? "Visible" : "Private"}
              </span>
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
            {showIsBlocked ? (
              isBlocked ? (
                <div style={{ textAlign: "center" }}>
                  {" "}
                  <button onClick={this.unblockUser} className="block">
                    UNBLOCK USER
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {" "}
                  <button onClick={this.blockUserClick} className="block">
                    BLOCK USER
                  </button>
                </div>
              )
            ) : (
              ""
            )}
          </main>
        ) : (
          ""
        )}
      </Fragment>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  fetchMe: () => dispatch(fetchMe()),
  fetchUser: payload => dispatch(fetchUser(payload)),
  blockUser: payload => dispatch(blockUser(payload)),
  unblockUser: payload => dispatch(unBlockUser(payload))
});

const mapStateToProps = state => ({
  clickedUser: getProfileUser(state),
  inEdit: state.session.inEdit // TODO make this a selector
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
