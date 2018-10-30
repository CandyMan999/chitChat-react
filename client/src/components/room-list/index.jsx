import React from "react";

class RoomList extends React.Component {
  render() {
    const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);
    return (
      <div className="rooms-list">
        <ul>
          <h3>Your Rooms:</h3>
          {orderedRooms.map((room, i) => {
            const active = this.props.roomId === room.id ? "active" : "";
            return (
              <li key={room.id} className={"room" + active}>
                <a href="#" onClick={() => this.props.subscribeToRoom(room.id)}>
                  # {room.name}
                  {/* {this.props.usersInRooms[i].userIds.length} */}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default RoomList;
