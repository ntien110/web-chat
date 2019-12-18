import React, { Component } from 'react';
class ChatTextBox extends Component {
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
    submitMessage = (e) => {
        e.preventDefault();
        this.props.submitMessageFn(this.state.chatText);
        this.setState({
            chatText: ''
        })
    }
    render() {
        return (
            <div className="type_msg">
                <input type="text" 
                    placeholder="Type your message..." 
                    value={this.state.chatText} 
                    onChange={this.handleChange}
                    onKeyUp={(e) => (e.keyCode === 13) ? this.submitMessage : null} 
                >
                </input> 
                <button className="fa fa-paper-plane btn-type" onClick={this.submitMessage}></button> 
            </div>
        );
    }
}
export default ChatTextBox;