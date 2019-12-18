import React, { Component } from 'react';

class Message extends Component {
    render() {
        return (
            <div className="mesgs" >
                <div className="msg_history">
                    {
                        this.props.messages.map((msg, index) => {
                            if (msg.senderId !== this.props.userInfo.userId) {
                                return (
                                    <div className="incoming_msg" key={index} >
                                        <div className="incoming_msg_img" >
                                            <img src={this.props.friendAvatar} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                                        </div>
                                        <div className="received_msg">
                                            <div className="received_withd_msg" >
                                                <p>{msg.message}</p>
                                                <span className="time_date" > {msg.date} </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="outgoing_msg" key={index} >
                                        <div className="sent_msg" >
                                            <p> {msg.message} </p>
                                            <span className="time_date" > {msg.date} </span>
                                        </div>
                                    </div>
                                );
                            }
                        })
                    }
                </div>
            </div>

        )
    }
}
export default Message;