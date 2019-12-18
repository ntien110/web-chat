import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
// component
import Message from './Message';
import WriteMessage from './WriteMessage';

class MessagesPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            friendName: '',
            friendAvatar: ''
        }
    }
    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollToBottom = node.scrollTop + node.clientHeight >= node.scrollHeight;
    }
    componentDidMount() {
        if (this.shouldScrollToBottom) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    }
   
    // load the messages when the nextProps is different from the present one
    // most important don't forget it 
    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedRoomId !== this.props.selectedRoomId)
            this.loadConversation(nextProps.selectedRoomId)
    }

    // load the conversation of the selected friend
    loadConversation(id) {
        let selectedRoomId = (id) ? id : 'me' // this.props.selectedRoomId ||

        console.log('IN MESSAGE PANEL : selected friend id in ', selectedRoomId)

        axios({
            method: 'GET',
            url: ' http://localhost:9000/getconversation/' + selectedRoomId
        }).then((res) => {
            console.log('conversation is now: ', res.data);

            // set the messages field of the state with the data
            this.setState({
                messages: res.data.messages,
                friendAvatar: res.data.friendAvatar,
                friendName: res.data.friendName
            });
        }).catch(err => {
            console.log(err);
        });
    }

    onNewMessageArrival(data) {

        let newMessages = [...this.state.messages]
        console.log('New Messages are', newMessages)

        // if the current message is from the selected room also
        if (data.roomId === this.props.selectedRoomId) {
            this.setState((prevState, props) => ({
                messages: [...this.state.messages, { ...data }]
            }))
        }

        // fill the Room info from Socket data
        this.props.fillRoomInfoFromSocket(data)
    }

    onLineRoom = (roomsOnline) => {
        console.log('Online rooms are', roomsOnline)
        this.props.notifyOnlineRooms(roomsOnline)
    }

    render() {
        let { messages, friendAvatar, friendName } = this.state;
        let { userInfo, selectedRoomId } = this.props;

        return (
            <div>
                <div className="user-current" >
                    <div className="user-img" >
                        <img src={friendAvatar} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                    </div>
                    <div className="user-name"> {friendName} </div>
                    <div className="user-status"></div>
                </div>
                <Message
                    messages={messages}
                    friendAvatar={friendAvatar}
                    userInfo={userInfo}
                />
                <WriteMessage
                    userInfo={userInfo}
                    selectedRoomId={selectedRoomId}
                    onLineRoom={this.onLineRoom}
                    onNewMessageArrival={this.onNewMessageArrival.bind(this)} 
                />
            </div>

        );
    }
}

export default MessagesPanel;