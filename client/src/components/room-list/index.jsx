import React from "react";

class RoomList extends React.Component {
  render() {
    const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id);

    return (
      <div className="rooms-list">
        <ul>
          <h3>Rooms:</h3>
          {orderedRooms &&
            orderedRooms.map(room => {
              const active = this.props.roomId === room.id ? "active" : "";
              return (
                <li key={room.id} className={"room" + active}>
                  <a
                    href="#"
                    onClick={() => this.props.subscribeToRoom(room.id)}
                  >
                    # {room.name}{" "}
                    {room.userIds && room.userIds.length ? (
                      <p className="userNumber">
                        {room.userIds.length} Online{" "}
                      </p>
                    ) : (
                      <p className="userNumber"> 0 Online </p>
                    )}
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
