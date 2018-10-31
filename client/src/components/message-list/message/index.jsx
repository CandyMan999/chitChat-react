import React from "react";

const Message = ({ username, text, usernameClick }) => (
  <div className="message">
    <div onClick={() => usernameClick(username)} className="message-username">
      {username}:
    </div>
    <div className="message-text">{text}</div>
  </div>
);

export default Message;
