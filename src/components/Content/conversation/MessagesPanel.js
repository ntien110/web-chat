import React, { Component } from 'react';
import axios from 'axios';
import imBg from './../../../images/bg-login.jpg';
import ScrollToBottom from 'react-scroll-to-bottom';
// component
import Message from './Message';
import WriteMessage from './WriteMessage';

// Constants
import Constants from './../../Constants';

class MessagesPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: {},
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentDidMount() {
        if (this.props.selectedRoom.roomId !== '')
            this.loadConversation(this.props.selectedRoom.roomId);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.selectedRoom.roomId !== nextProps.selectedRoom.roomId) {
            console.log("change roomId", nextProps.selectedRoom.roomId);
            if (!this.state.messages[nextProps.selectedRoom.roomId]) {
                this.loadConversation(nextProps.selectedRoom.roomId);
            }
        }
        else {
            if (nextProps.onNewMessageArrival.roomId === this.props.selectedRoom.roomId) {
                let messages = this.state.messages
                messages[this.props.selectedRoom.roomId].push(nextProps.onNewMessageArrival)
                this.setState({ messages });
            }
        }
    }

    // load the conversation of the selected friend
    loadConversation(id) {
        let selectedRoomId = (id) ? id : '' // this.props.selectedRoomId ||
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getConversation,
            data: {
                roomId: selectedRoomId,
                limit: 10,
                time: new Date()
            }
        }).then((res) => {
            //console.log('conversation is now: ', res.data);
            if (res.data.status) {
                let newRooms = res.data.messages;
                let messages = this.state.messages;
                messages[selectedRoomId] = newRooms;
                this.setState({
                    messages
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
    render() {
        let { messages } = this.state;
        let { userId, selectedRoom, socket } = this.props;
        return (
            <div>
                <div className="user-current" >
                    <div className="user-img" >
                        <img src={selectedRoom.avatar} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                    </div>
                    <div className="user-name"> {selectedRoom.name} </div>
                    <div className="user-status"></div>
                </div>
                <div className="mesgs">
                    <Message
                        Messages={messages[selectedRoom.roomId]}
                        userId={userId}
                        avatar={selectedRoom.avatar}
                    />
                    <WriteMessage
                        userId={userId}
                        selectedRoomId={selectedRoom.roomId}
                        socket={socket}
                    />
                </div>
            </div>
        );
    }
}
export default MessagesPanel;