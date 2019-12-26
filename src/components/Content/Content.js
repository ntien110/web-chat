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
            onlineRooms: null,
            offlineRooms: null,
            socket: '',
            onNewMessageArrival: '',
            selectedRoomId: '',
            showMessagePanel: false
        };
    }
    getOnlineRooms = (data) => {
        this.setState({
            onlineRooms : data
        })
    }
    componentDidMount() {
        this.socket.on("welcome", (msg) => {
            this.socket.emit("userId", this.props.userId);
        });
        this.socket.on("message", (data) => {
            console.log('data value ', data);
            // let status = true;
            // send the newly incoming message to the parent component 
            // if (data.roomId !== selectedRoomId) status = false;

            this.setState({
                onNewMessageArrival: data
            });
            //console.log(this.state.onNewMessageArrival);
        });
        this.socket.on("iAmOnline", ({ userId, roomId }) => {
            let onlineRooms = this.state.onlineRooms;
            if (onlineRooms.hasOwnProperty(roomId)) {
                onlineRooms[roomId].push(userId)
            } else {
                onlineRooms[roomId] = [userId]
            }
            this.setState({
                onlineRooms
            })
            console.log("content.js ---49: ", userId, roomId, JSON.stringify(onlineRooms));
        });
        this.socket.on("iAmOffline", ({ roomId, userId }) => {
            
            console.log(roomId);
            let onlineRooms = this.state.onlineRooms;
            // console.log("content.js ---61 pre: ",this.state.onlineRooms[roomId])
            // console.log(onlineRooms.hasOwnProperty(roomId), roomId)

            if (onlineRooms.hasOwnProperty(roomId)) {
                let room = onlineRooms[roomId]
                let index = room.indexOf(userId);
                // console.log("index found: ",index)
                if (index !== -1) room.splice(index, 1);
                onlineRooms[roomId] = room
            }

            if(onlineRooms[roomId].length === 0){
                delete onlineRooms[roomId]
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

                <div className="container-fluid p-0 containerDark">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-3 p-0 content-left'>
                                <RoomPanel
                                    getOnlineRooms={this.getOnlineRooms}
                                    userId={userId}
                                    onlineRooms={onlineRooms}
                                    onNewMessageArrival={onNewMessageArrival}
                                    setSelectedRoomId={this.setSelectedRoomId}
                                    socket={socket}
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
                            <div className='col-sm-3 p-0 content-right'>
                                <ContentRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
