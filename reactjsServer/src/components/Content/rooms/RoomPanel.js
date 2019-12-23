import React, { Component } from 'react';
import axios from 'axios';
//Component
import RoomInfo from './RoomInfo';
// Constants
import Constants from './../../Constants'
class RoomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            showLoading: true
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentDidUpdate(nextProps) {
        if (nextProps.onNewMessageArrival && (!this.props.onNewMessageArrival || nextProps.onNewMessageArrival.roomId !== this.props.onNewMessageArrival.roomId)) {
            let newRooms = [...this.state.rooms];
            newRooms.forEach((room) => {
                if (room.roomId === nextProps.onNewMessageArrival.roomId) {
                    let lastMessage = room.lastMessage !== null ? room.lastMessage : { "Body": "", "time": "" };
                    // adjust the necessary field if the roomId matches
                    lastMessage.Body = nextProps.onNewMessageArrival.Body;
                    lastMessage.time = nextProps.onNewMessageArrival.time;
                    // lastMessage.senderId = nextProps.onNewMessageArrival.senderId;

                    // if the message is from other non active room
                    // if (room.read === true) {
                    //     room.read = false
                    //     this.saveReadStatusToDb(room, false)
                    // }
                }
            })
            newRooms = newRooms.sort((a, b) => {
                let x = a.lastMessage !== null ? a.lastMessage : { "time": "" };
                let y = b.lastMessage !== null ? b.lastMessage : { "time": "" };
                return new Date(y.time) - new Date(x.time);

            });
            this.setState({ rooms: newRooms });
        }
    }
    componentDidMount() {
        this.loadrooms();
    }
    loadrooms() {
        let allConstants = this.allConstants;
        // call the back end to get rooms
        axios({
            method: 'POST',
            url: allConstants.getRooms,
            data: {
                userId: this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                console.log(data.rooms, "getRooms");
                this.setState({ rooms: data.rooms });
            }
            else {
                console.log("getRoom is failed");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    setSelectedRoomId = (id) => {
        // pass the selected room id augmented with logged in userid to the parent 
        console.log(id, " choose id");
        this.props.setSelectedRoomId(id);
        // set active room id for highlighting purpose
        this.setState({ activeRoomId: id });
        // this.changeReadStatus(id)
    }
    // function to change the room status from read / unread
    // changeReadStatus(id) {
    //     let allRooms = [...this.state.rooms];
    //     console.log('change status reached');

    //     allRooms.forEach((room, index, roomArray) => {
    //         if (room.roomId === id && room.read === false) {
    //             roomArray[index].read = true
    //             this.saveReadStatusToDb(room, true)
    //         }
    //     })

    //     console.log('All rooms are now', allRooms)
    //     this.setState({ rooms: allRooms })
    // }
    // saveReadStatusToDb(room, status) {
    //     axios({
    //         method: 'PUT',
    //         url: 'http://localhost:9000/updateroomreadstatus',
    //         data: {
    //             userId: this.props.userInfo.userId,
    //             roomName: room.roomName,
    //             read: status
    //         }
    //     }).then((response) => {
    //             console.log('room status saved');
    //     }).catch((err) => {
    //          console.log('unable to save room status', err);
    //     })
    // }
    render() {
        let { userId, setSelectedRoomId } = this.props;
        let { activeRoomId, rooms } = this.state;
        return (
            <div className="inbox_chat">
                {
                    rooms.map((room) => {
                        return (
                            <div className='chat_list' key={room.roomId} onClick={() => this.setSelectedRoomId(room.roomId)}>
                                <RoomInfo
                                    room={room}
                                    userId={userId}
                                    activeRoomId={activeRoomId}
                                    setSelectedRoomId={setSelectedRoomId}

                                />
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
export default RoomPanel;