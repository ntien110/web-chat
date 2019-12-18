import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import imgBg from './../../../images/bg-login.jpg';
class ChatView extends Component {
    onToggleRight = () => {
        this.props.onToggleRight();
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
    
    render() {
        return (
            <div >
                <div className="user-current" >
                    <div className="user-img" >
                        <img src={imgBg} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                    </div>
                    <div className="user-name"> {this.props.friendName} </div>
                    <div className="user-status"> </div>
                    <button className="add-info" onClick={this.onToggleRight}><i className="fa fa-angle-right"></i></button >
                </div>
                <div className="mesgs" >
                    <div className="msg_history">
                        {
                            this.props.messages.map((msg, index) => {
                                if (msg.sender === this.props.friendName) {
                                    return (
                                        <div className="incoming_msg" key={index} >
                                            <div className="incoming_msg_img" >
                                                <img src={imgBg} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
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
            </div>
        )
    }
}                                                                                                                                                                                           
export default ChatView;