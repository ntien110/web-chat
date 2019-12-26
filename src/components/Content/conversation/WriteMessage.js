import React, { Component } from 'react';
import { IoIosSend } from 'react-icons/io';
import { MdInsertEmoticon } from 'react-icons/md';
class WriteMessage extends Component {
    constructor() {
        super();
        this.state = {
            chatText: ''
        };
    }
    handleChange = (e) => {
        this.setState({
            chatText: e.target.value
        });
    }
    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
    submitMessage = (e) => {
        console.log(new Date());
        let { chatText } = this.state;
        // define the chat message

        let data = {
            time: new Date(),
            Body: chatText,
            From: this.props.userId,
            roomId: this.props.selectedRoomId,
            type: "text"
        }
        //console.log('the message', data);
        // console.log('length of the message', data.msgBody.length);

        // emit the message
        if (data.Body.length > 0){
            this.props.socket.emit('send', data);
            this.setState({ chatText: '' });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedRoomId !== prevProps.selectedRoomId) {
            this.setState({ chatText: '' });
        }
    }
    render() {

        return (
            <div className="type_msg">
                <div className="row">
                    <input type="text"
                        placeholder="Type your message..."
                        value={this.state.chatText}
                        onChange={this.handleChange}
                        onKeyUp={(e) => this.userTyping(e)}
                        className="box-text"
                    >
                    </input>
                    <IoIosSend className="btn-send btn-msg" onClick={this.submitMessage}/>
                    <MdInsertEmoticon className="btn-send btn-msg" />
                    {/* <div className="fa fa-paper-plane btn-type" onClick={this.submitMessage}></div> */}

                </div>


            </div>
        );
    }
}

export default WriteMessage;