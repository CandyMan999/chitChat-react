import React from "react";

const Banner = ({ channelOwner }) => (
  <div>
    <h5 className="videoTitle">
      {!!channelOwner
        ? `Join ${channelOwner}'s channel or click your SCREEName to join your own!`
        : "Join your own channel or click someone else's SCREEName to join their channel!"}
    </h5>
  </div>
);

export default Banner;
