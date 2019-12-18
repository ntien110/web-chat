import React, { Component } from 'react'

class RoomInfo extends Component {
    render() {
        let {room, activeRoomId} = this.props;
        return (
            <div className={(activeRoomId === room.roomId) ? 'chat_list active' : 'chat_list'} onClick={() => this.props.setSelectedRoomId(room.roomId)}>
                <div className="chat_people">
                    <div className="chat_img"> <img src={room.friendAvatar} className="img-circle" alt="avatar user" width="40px" height="40px" /> </div>
                    <div className="chat_ib">
                        <h5>{room.friendName}<span className="chat_date">{room.date}</span></h5>
                        <p>{room.message}</p>
                    </div>
                </div>
            </div>
        )
    }
}
export default RoomInfo;
