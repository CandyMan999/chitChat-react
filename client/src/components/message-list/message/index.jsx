import React from "react";

const Message = ({ username, text }) => (
  <div className="message">
    <div className="message-username">{username}</div>
    <div className="message-text">{text}</div>
  </div>
);

export default Message;
