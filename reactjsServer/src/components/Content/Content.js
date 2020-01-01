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
            onlineRooms: [],
            socket: '',
            onNewMessageArrival: '',
            selectedRoom: '',
            showMessagePanel: false,
            switchmode: '',
            colorTheme: 'default-theme',
            amountMsg: ''
        };
    }
    getOnlineRooms = (data) => {
        this.setState({
            onlineRooms: data
        })
    }
    componentDidMount() {
        this.socket.on("welcome", (msg) => {
            this.socket.emit("userId", this.props.userId);
        });
        this.socket.on("message", (data) => {
            
            //let status = true;
            //send the newly incoming message to the parent component 
            //console.log(this.state.selectedRoom)
            if (data.roomId === this.state.selectedRoom.roomId){
                console.log("seen");
                let seenInfo = {
                    userId: this.props.userId,
                    roomId: data.roomId,
                    messageId: data.messageId
                }
                this.socket.emit("seen", seenInfo);
                data.seen.push(this.props.userId);
                this.setState({amountMsg : this.state.amountMsg + 1})
            }
            console.log('data value ', data);   
            this.setState({
                onNewMessageArrival: data
            });
            //console.log(this.state.onNewMessageArrival);
        });
        this.socket.on("iAmOnline", ({ userId, roomId }) => {
            console.log(`get Online message from ${userId} at ${roomId}`);
            let onlineRooms = this.state.onlineRooms;

            let check = false;
            for (let i in onlineRooms) {
                if (onlineRooms[i] === roomId) {
                    check = true
                    break;
                }
            }
            if (check === false) {
                onlineRooms.push(roomId);
            }
            // console.log(`modified onlineRoom after online: ${onlineRooms}`)
            this.setState({
                onlineRooms
            })
        });
        this.socket.on("iAmOffline", ({ roomId, userId }) => {
            console.log(`get Offline message from ${userId} at ${roomId}`);
            let onlineRooms = this.state.onlineRooms;
            //console.log(onlineRooms);
            for (let i in onlineRooms) {
                if (onlineRooms[i] === roomId) {
                    //console.log(i);
                    onlineRooms.splice(i, 1);
                    break;
                }
            }
            //console.log(onlineRooms);
            // console.log(`modified onlineRoom after ${userId} online: ${onlineRooms}`)
            this.setState({
                onlineRooms
            })
            //console.log("content.js ---72 after: ", JSON.stringify(this.state.onlineRooms))
            // console.log("iAmOffline's data: ",roomId, userId)
        })
        // this.socket.on("seen", ({ userId, messageId, roomId }) => {
        //     console.log(`get Offline message from ${userId} at ${roomId} && ${messageId}`);
        // })
    }
    setSelectedRoomId = (room) => {
        console.log('room here in content: ', room);
        if (room.roomId !== this.state.selectedRoom.roomId) {
            this.setState({
                selectedRoom: room,
                showMessagePanel: true
            });
        }
        this.setState({amountMsg : room.messageCount})
    }
    onSwitchMode = (value) => {
        this.setState({
            switchmode: value
        })
    }
    onChangeColor = (color) => {
        this.setState({
            colorTheme: color
        });
    }
    render() {
        let { userId } = this.props;
        let { selectedRoom, onNewMessageArrival, onlineRooms, showMessagePanel, switchmode, colorTheme, amountMsg } = this.state;
        let socket = this.socket;

        return (
            <div className={switchmode ? 'bodyDark' : ''}>
                <Header userId={userId} onSwitchMode={this.onSwitchMode} />
                <div className="container-fluid p-0">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-3 p-0 content-left'>
                                <RoomPanel
                                    getOnlineRooms={this.getOnlineRooms}
                                    userId={userId}
                                    onNewMessageArrival={onNewMessageArrival}
                                    setSelectedRoomId={this.setSelectedRoomId}
                                    socket={socket}
                                    onlineRooms={onlineRooms}
                                />
                            </div>

                            {showMessagePanel ?
                                <div className='col-sm-9 p-0 content-mid'>
                                    <div className="row m-0">
                                        <div className='col-sm-8 p-0 content-mid'>
                                            <MessagesPanel
                                                socket={socket}
                                                userId={userId}
                                                selectedRoom={selectedRoom}
                                                onNewMessageArrival={onNewMessageArrival}
                                                switchmode={switchmode}
                                                colorTheme={colorTheme}
                                            />
                                        </div>
                                        <div className='col-sm-4 p-0 content-right'>
                                            <ContentRight amountMsg={amountMsg} selectedRoom={selectedRoom} onChangeColor={this.onChangeColor} />
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className='col-sm-9 p-0 content-mid'>
                                    <Welcome />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
