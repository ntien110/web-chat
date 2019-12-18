import React, { Component } from 'react';
import axios from 'axios';
//Component
import RoomInfo from './RoomInfo';

class RoomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            showLoading: true
        }
    }
    componentDidMount() {
        this.loadrooms()
    }
    componentWillReceiveProps(nextProps) {
        // console.log('nextProps from RoomPanel', nextProps, ' and old props', this.props)

        if (nextProps.newMessageFromSocket && (!this.props.newMessageFromSocket || nextProps.newMessageFromSocket.id !== this.props.newMessageFromSocket.id)) {

            let newRooms = [...this.state.rooms]

            newRooms.forEach((room) => {
                if (room.roomId === nextProps.newMessageFromSocket.roomId) {

                    // adjust the necessary field if the roomId matches
                    room.lastMessage = nextProps.newMessageFromSocket.msgBody
                    room.dateInfo = nextProps.newMessageFromSocket.timeSent
                    room.senderId = nextProps.newMessageFromSocket.senderId

                    // if the message is from other non active room
                    if (room.read === true) {
                        room.read = false
                        this.saveReadStatusToDb(room, false)
                    }
                }
            })

            newRooms = newRooms.sort((a, b) => { return new Date(b.dateInfo) - new Date(a.dateInfo) })
            this.setState({ rooms: newRooms })
        }
    }

    loadrooms(){
        // call the back end to get rooms
        axios({
            method: 'POST',
            url: ' http://localhost:9000/getrooms/'+this.props.userInfo.userId,
            data: {}
        }).then(res => {
            console.log('data', res.data);
            res.data = res.data.sort((a, b) => { return new Date(b.dateInfo) - new Date(a.dateInfo) })
            this.setState({ rooms: res.data, showLoading: false })
        }).catch(err => {
            console.log(err);
        });
    }

    setSelectedRoomId = (id) => {
        // pass the selected room id augmented with logged in userid to the parent 
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
        let { userInfo, onlineRooms } = this.props;
        let { activeRoomId, showLoading } = this.state;

        return (
            <div className="inbox_chat">
                {
                    this.state.rooms.map((room) => {
                        return <RoomInfo 
                            room={room} 
                            userInfo={userInfo.userId}
                            activeRoomId={activeRoomId}
                            onlineRooms={onlineRooms}
                            setSelectedRoomId={this.setSelectedRoomId(room.roomId)}
                        />
                    })
                }
            </div>
        );
    }
}
export default RoomPanel;