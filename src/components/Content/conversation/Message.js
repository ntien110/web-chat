import React, { Component } from 'react';
// Constants
import Constants from './../../Constants'
class Message extends Component {
    constructor(props) {
        super(props);
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    render() {
        let allConstants = this.allConstants;
        let messages = this.props.Messages?this.props.Messages:[];
        return (
            <div className="msg_history">
                {
                    messages.map((msg, index) => {
                        if (msg.From !== this.props.userId) {
                            return (
                                <div className="incoming_msg" key={index} >
                                    <div className="incoming_msg_img" >
                                        <img src="" className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
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