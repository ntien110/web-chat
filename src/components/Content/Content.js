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
            onlineRooms: '',
            offlineRooms: '',
            socket: '',
            onNewMessageArrival: '',
            selectedRoom: '',
            showMessagePanel: false,
            switchmode: '',
            colorTheme: 'default-theme' 
        };
    }
    // getOnlineRooms = (data) => {
    //     this.setState({
    //         onlineRooms : data
    //     })
    // }
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
            console.log(`get Online message from ${userId} at ${roomId}`);
            // let onlineRooms = this.state.onlineRooms;
          
            // let check = false;
            // for (let i in onlineRooms){
            //     if (onlineRooms[i].roomId === roomId)  {               
            //         check=true
            //         break;
            //     }
            // }
            // if(check === false){
            //     onlineRooms.push(roomId);
            // }
            // console.log(`modified onlineRoom after online: ${onlineRooms}`)
            this.setState({
                onlineRooms : roomId
            })
        });
        this.socket.on("iAmOffline", ({ roomId, userId }) => {
            console.log(`get Offline message from ${userId} at ${roomId}`);
            // let onlineRooms = this.state.onlineRooms;
        
            // for (let i in onlineRooms){
            //     if (onlineRooms[i].roomId === roomId)  {
            //         onlineRooms.splice(i, 1);
            //         break;
            //     }
            // }
            // console.log(`modified onlineRoom after ${userId} online: ${onlineRooms}`)
            this.setState({
                offlineRooms: roomId
            })
            //console.log("content.js ---72 after: ", JSON.stringify(this.state.onlineRooms))
            // console.log("iAmOffline's data: ",roomId, userId)
        })
    }
    setSelectedRoomId = (room) => {
        console.log('id here in content: ', room.roomId);
        if (room.roomId !== this.state.selectedRoom.roomId)
        {
            this.setState({
                selectedRoom: room,
                showMessagePanel: true
            });
        }
    }
    onSwitchMode = (value) => {
        this.setState({
            switchmode : value
        })
    }
    onChangeColor = (color) => {
        this.setState({
            colorTheme: color
        });
    } 
    render() {
        let { userId } = this.props;
        let { selectedRoom, onNewMessageArrival, onlineRooms, offlineRooms, showMessagePanel, switchmode, colorTheme } = this.state;
        let socket = this.socket;

        return (
            <div className={switchmode ? 'bodyDark' : ''}>
                <Header userId={userId} onSwitchMode={this.onSwitchMode}/>
                <div className="container-fluid p-0">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-3 p-0 content-left'>
                                <RoomPanel               
                                    userId={userId}
                                    onNewMessageArrival={onNewMessageArrival}
                                    setSelectedRoomId={this.setSelectedRoomId}
                                    socket={socket}
                                    onlineRooms={onlineRooms}
                                    offlineRooms={offlineRooms}
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
                                            <ContentRight selectedRoom={selectedRoom} onChangeColor={this.onChangeColor}/>
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
