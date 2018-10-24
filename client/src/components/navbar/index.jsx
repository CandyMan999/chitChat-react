import React from "react";

const Navbar = ({ username, navInput, password, navSubmit }) => (
  <nav
    style={{ color: "mediumaquamarine", backgroundColor: "red !important" }}
    className="navbar "
  >
    {" "}
    <div className="sign-up">Create A UserName and Password</div>
    <form>
      <input
        style={{ margin: "2px" }}
        type="text"
        placeholder="Username"
        name="username"
        value={username}
        onChange={navInput}
      />
      <input
        type="password"
        placeholder="Password"
        name="password"
        value={password}
        onChange={navInput}
      />
      <button id="submit" onClick={navSubmit}>
        Submit
      </button>
    </form>
  </nav>
);

export default Navbar;
