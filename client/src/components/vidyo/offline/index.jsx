import React from "react";

const Offline = ({ isBlocked, username }) => (
  <div>
    <h3 className="blocked">
      {isBlocked
        ? `You were blocked by ${username}`
        : `Sorry ${username} is OFFLINE!!`}
    </h3>
  </div>
);

export default Offline;
