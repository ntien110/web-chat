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
            stickers: []
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentDidMount() {
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getAllStickers
        }).then(res => {
            var data = res.data;
            if (data.status) {            
                this.setState({
                    stickers: data.stickers['QooBee']
                });
            }
        }).catch(err => {
            console.log(err);
        });
        if (this.props.selectedRoom.roomId !== '')
            this.loadConversation(this.props.selectedRoom.roomId, 10, new Date());
    }
    componentWillReceiveProps(nextProps) {
        
        if (this.props.selectedRoom.roomId !== nextProps.selectedRoom.roomId) {
            console.log("change roomId", nextProps.selectedRoom.roomId);
            if (!this.state.messages[nextProps.selectedRoom.roomId]) {
                this.loadConversation(nextProps.selectedRoom.roomId, 10, new Date());
            }
        }
        else {
            if (nextProps.onNewMessageArrival.roomId === this.props.selectedRoom.roomId && nextProps.switchmode === this.props.switchmode && nextProps.colorTheme === this.props.colorTheme) {
                let messages = this.state.messages;
                console.log("o day");
                messages[this.props.selectedRoom.roomId].push(nextProps.onNewMessageArrival);
                this.setState({ messages });
            }
        }
    }

    // load the conversation of the selected friend
    loadConversation(id, amount, time) {
        let selectedRoomId = (id) ? id : '' // this.props.selectedRoomId ||
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getConversation,
            data: {
                roomId: selectedRoomId,
                limit: amount,
                time: time
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
    reachTop = () => {
        let time = new Date(this.state.messages[this.props.selectedRoom.roomId][0].time);
        // let allConstants = this.allConstants;
        // axios({
        //     method: 'POST',
        //     url: allConstants.getConversation,
        //     data: {
        //         roomId: this.props.selectedRoom.roomId,
        //         limit: 10,
        //         time: this.state.messages[this.props.selectedRoom.roomId][0].time
        //     }
        // }).then((res) => {
        //     //console.log('conversation is now: ', res.data);
        //     if (res.data.status) {
        //         let newRooms = res.data.messages;
                
        //         let messages = this.state.messages;
        //         for (let i in messages[this.props.selectedRoom.roomId]){
        //             newRooms.push(messages[this.props.selectedRoom.roomId][i]);
        //         }
        //         messages[this.props.selectedRoom.roomId] = newRooms;
        //         this.setState({
        //             messages
        //         });
        //     }
        // }).catch(err => {
        //     console.log(err);
        // });
    }
    render() {
        let { messages, stickers } = this.state;
        let { userId, selectedRoom, socket, colorTheme} = this.props;
        
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
                        reachTop={this.reachTop}
                        stickers={stickers}
                        colorTheme={colorTheme}
                    />
                    <WriteMessage
                        userId={userId}
                        selectedRoomId={selectedRoom.roomId}
                        socket={socket}
                        stickers={stickers}
                    />
                </div>
            </div>
        );
    }
}
export default MessagesPanel;