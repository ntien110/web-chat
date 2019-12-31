import React, { Component } from 'react';
// Constants
import imBg from './../../../images/bg-login.jpg';
import Constants from './../../Constants';
// Css
import './Message.css';
class Message extends Component {
    constructor(props) {
        super(props);
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    handleScroll = () => {
        if (this.scroller && this.scroller.scrollTop < 1) {
            this.props.reachTop();
        }
    }
    componentDidUpdate() {
        const message = document.getElementById("message");
        if (message) {
            message.scrollTo(0, message.scrollHeight);
        }
    }
    render() {
        let allConstants = this.allConstants;
        let messages = this.props.Messages ? this.props.Messages : [];
        let { stickers, colorTheme} = this.props;
        //console.log(stickers);
        console.log("messages:", messages);
        return (
            <div
                className="msg_history"
                id="message"
                ref={(scroller) => {
                    this.scroller = scroller;
                }}
                onScroll={this.handleScroll}
            >
                {
                    messages.map((msg, index) => {
                        let body = '';
                        let read = false;
                        if (msg.From === this.props.userId){
                            for (let i in msg.seen){
                                if (msg.seen[i] !== this.props.userId){
                                    read = true;
                                    break;
                                }
                            }
                        }
                        //console.log("kk",msg.Type);
                        if (msg.Type === 'Sticker') {
                            for (let i in stickers) {
                                if (stickers[i].id === msg.Body) {
                                    body = stickers[i].body;
                                    //console.log("sticker");
                                }
                            }
                        }
                        else if (msg.Type === 'Text') {
                            body = msg.Body;
                            //console.log("text");
                        } else {
                            body = msg.Body;
                            //console.log("Image");
                        }
                        if (msg.From !== this.props.userId) {
                            return (
                                <div className="incoming_msg" key={index} >
                                    <div className="incoming_msg_img" >
                                        <img src={this.props.avatar} className="img-circle" alt="Cinque Terre" width="40px" height="40px" />
                                    </div>
                                    <div className="received_msg">
                                        <div className="received_withd_msg" >
                                            {
                                                msg.Type === 'Text' ?
                                                    <p>{body}</p>
                                                    :
                                                    <img src={body} alt="Cinque Terre" width="100px" height="100px" />
                                            }
                                            <span className="time_date" >{allConstants.formatDates(msg.time)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <div className="outgoing_msg" key={index} >
                                    <div className={`sent_msg ${colorTheme}`}>
                                        {
                                            msg.Type === 'Text' ?
                                                <p>{body}</p>
                                                :
                                                <img src={body} alt="Cinque Terre" width="100px" height="100px" />
                                        }
                                        <span className="time_date" >
                                            {allConstants.formatDates(msg.time)}
                                            {
                                                read ?
                                                    <div style={{'float':'right'}}>
                                                        <img src={this.props.avatar} className="img-circle" alt="Cinque Terre" width="10px" height="10px" />
                                                    </div>
                                                :
                                                    ''
                                            }
                                        </span>
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