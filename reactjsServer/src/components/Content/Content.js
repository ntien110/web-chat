import React, { Component } from "react";

// component
import Header from './Header/Header';
import RoomPanel from './rooms/RoomPanel';
import MessagesPanel from './conversation/MessagesPanel';
// css
import './Content.css';

class Content extends Component {
    constructor(props) {
        super();
        this.state = {
            showMessagePanel: true,
            showRoomPanel: true,
            onlineRooms: []
        };
    }
    setSelectedRoomId = (id) => {
        console.log('id here in content: ', id);
        this.setState({ selectedRoomId: id }, () => {
            console.log('state is now', this.state);
        });
    }
    fillRoomInfoFromSocket = (message) => {
        console.log('The new message from Socket arrived', message)

        this.setState({ newMessageFromSocket: message })
    }

    notifyOnlineRooms = (rooms) => {
        this.setState({ onlineRooms: rooms })
    }
    render() {
        let {userInfo} = this.props;
        let {showMessagePanel, showRoomPanel, selectedRoomId, newMessageFromSocket, onlineRooms} = this.state;
        return (
            <div>
                <Header userInfo= {userInfo}/>
                
                <div className="container-fluid p-0">
                    <div className="content">
                        <div className="row m-0">
                            <div className='col-sm-4 p-0 content-left'>
                                <RoomPanel
                                     userInfo={userInfo}
                                     onlineRooms={onlineRooms}
                                     newMessageFromSocket={newMessageFromSocket}
                                     setSelectedRoomId={this.setSelectedRoomId} 
                                />   
                            </div>
                            <div className='col-sm-8 p-0 content-mid'>
                                <MessagesPanel 
                                    userInfo={userInfo}
                                    selectedRoomId={selectedRoomId}
                                    fillRoomInfoFromSocket={this.fillRoomInfoFromSocket}
                                    notifyOnlineRooms={this.notifyOnlineRooms}          
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Content;
