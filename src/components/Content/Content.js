import React, { Component } from "react";
import io from 'socket.io-client';
// component
import Header from './Header/Header';
import RoomPanel from './rooms/RoomPanel';
import MessagesPanel from './conversation/MessagesPanel';
import Welcome from './Welcome/Welcome';
import ContentRight from './ContentRight/ContentRight';
// css
import './Content.css';
// Constants
import Constants from './../Constants';

class Content extends Component {
    constructor(props) {
        super(props);
        // instantiate the Constants
        this.allConstants = new Constants();
        this.socket = io(this.allConstants.webSocketServer);
        this.state = {
            //onlineRooms có dạng ["room": ["userId-1","userId-2",....]]
            onlineRooms: {},
            socket: '',
            onNewMessageArrival: '',
            selectedRoomId: '',
            showMessagePanel: false
        };

    }
    componentDidMount() {
        this.socket.on("welcome", (msg) => {
            this.socket.emit("userId", this.props.userId);
        });
        this.socket.on("message", (data) => {
            //console.log('data value ', data);
            // console.log(data)
            // send the newly incoming message to the parent component 
            this.setState({
                onNewMessageArrival: data
            });
            console.log(this.state.onNewMessageArrival);
        });
        this.socket.on("iAmOnline", ({ userId, roomId }) => {
            let onlineRooms = this.state.onlineRooms
            if (onlineRooms.hasOwnProperty(roomId)) {
                onlineRooms[roomId].push(userId)
            } else {
                onlineRooms[roomId] = [userId]
            }
            this.setState({
                onlineRooms
            })
            console.log("content.js ---49: ", userId, roomId, JSON.stringify(onlineRooms))
        });
        this.socket.on("iAmOffline", ({ roomId, userId }) => {
            // console.log(roomId)
            let onlineRooms = this.state.onlineRooms
            // console.log("content.js ---61 pre: ",this.state.onlineRooms[roomId])
            // console.log(onlineRooms.hasOwnProperty(roomId), roomId)

            if (onlineRooms.hasOwnProperty(roomId)) {
                let room = onlineRooms[roomId]
                let index = room.indexOf(userId);
                // console.log("index found: ",index)
                if (index !== -1) room.splice(index, 1);
                onlineRooms[roomId] = room
            }
            this.setState({
                onlineRooms
            })
            console.log("content.js ---72 after: ", JSON.stringify(this.state.onlineRooms))
            // console.log("iAmOffline's data: ",roomId, userId)
        })
    }
    setSelectedRoomId = (id) => {
        console.log('id here in content: ', id);
        if (id !== this.state.selectedRoomId)
        {
            this.setState({
                selectedRoomId: id,
                showMessagePanel: true
            });
        }
    }
    render() {
        let { userId } = this.props;
        let { selectedRoomId, onNewMessageArrival, onlineRooms, showMessagePanel } = this.state;
        let socket = this.socket;
        return (
            <div>
                <Header userId={userId} />

                <div className="container-fluid p-0">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-3 p-0 content-left'>
                                <RoomPanel
                                    userId={userId}
                                    onlineRooms={onlineRooms}
                                    onNewMessageArrival={onNewMessageArrival}
                                    setSelectedRoomId={this.setSelectedRoomId}
                                />
                            </div>
                            <div className='col-sm-6 p-0 content-mid'>
                                {showMessagePanel ?
                                    <MessagesPanel
                                        socket={socket}
                                        userId={userId}
                                        selectedRoomId={selectedRoomId}
                                        onNewMessageArrival={onNewMessageArrival}
                                    />
                                    :
                                    <Welcome />
                                }
                            </div>
                            <ContentRight userId={userId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
