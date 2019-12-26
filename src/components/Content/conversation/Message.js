import React, { Component } from 'react';
// Constants
import imBg from './../../../images/bg-login.jpg';
import Constants from './../../Constants'
class Message extends Component {
    constructor(props) {
        super(props);
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentDidUpdate() {
        const message = document.getElementById("message");
        if (message) {
            console.log("scroll");
            message.scrollTo(0, message.scrollHeight);
        }
    }
    render() {
        let allConstants = this.allConstants;
        let messages = this.props.Messages?this.props.Messages:[];
        return (
            <div className="msg_history" id="message">
                {
                    messages.map((msg, index) => {
                        if (msg.From !== this.props.userId) {
                            return (
                                <div className="incoming_msg" key={index} >
                                    <div className="incoming_msg_img" >
                                        <img src={imBg} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                                    </div>
                                    <div className="received_msg">
                                        <div className="received_withd_msg" >
                                            <p>{msg.Body}</p>
                                            <span className="time_date" >{allConstants.formatDates(msg.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className="outgoing_msg" key={index} >
                                    <div className="sent_msg" >
                                        <p> {msg.Body} </p>
                                        <span className="time_date" >{allConstants.formatDates(msg.time)}</span>
                                    </div>
                                </div>
                            );
                        }
                    })
                }
            </div>
        )
    }
}
export default Message;