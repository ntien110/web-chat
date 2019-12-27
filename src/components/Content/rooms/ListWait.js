import React, { Component } from 'react';
import {Button} from 'reactstrap';
//component
import UserInfo from './UserInfo';
//img 
import imBg from './../../../images/bg-login.jpg';
//css 
import './ListFriend.css';
import './FriendSearch.css';
class ListWait extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            friendInfo: {}
        }
    }
    onShowFriendInfo = (friend) => {
        this.setState({
            showInfo: true,
            friendInfo: friend
        });
    }
    onSubmitAccept = (from, to) => {
        console.log(to);
        this.props.onAcceptedFriendRequest(from, to);
        console.log(to)
        this.props.socket.emit("acceptFriendRequest", {
            "userId" : from,
            "acceptedFriendId": to
        });

    }
    closeFriendInfo = () => {
        this.setState({
            showInfo: false
        });
    }
    render() {
        let { friendInfo, showInfo } = this.state;
        return (
            <div className="message-box">
                {
                    this.props.listWait.map((friend) => {
                        return (
                            <div className="row friend" key={friend.userId} >
                                <div className="col-sm-2"><img src={imBg} className="img-circle" alt="avatar user" width="40px" height="40px" /></div>
                                <div className="col-sm-5 friend-name" onClick={() => this.onShowFriendInfo(friend)}>{friend.name}</div>
                                <div className="col-sm-5">
                                    <Button color="primary" onClick={() => this.onSubmitAccept(this.props.userId, friend.userId)}>Accept</Button>
                                    <Button color="secondary" onClick={() => this.onSubmitDecline(this.props.userId, friend.userId)}>Decline</Button>
                                </div>
                            </div>
                        )
                    })
                }
                <UserInfo showInfo={showInfo} friendInfo={friendInfo} closeFriendInfo={this.closeFriendInfo}/> 
            </div>
        )
    }
}
export default ListWait;