import React, { Component } from 'react';
import {Button} from 'reactstrap';
//component
import UserInfo from './UserInfo';
//img 
import imBg from './../../../images/bg-login.jpg';
//css 
import './ListFriend.css';
import './FriendSearch.css';
class FriendSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            friendInfo: {}
        }
    }
    onSubmitAdd = (from, to) => {
        this.props.socket.emit("friendRequest", {
            "from": from,
            "to": to
        });
    }
    onShowFriendInfo = (friend) => {
        this.setState({
            showInfo: true,
            friendInfo: friend
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
                <div class="title-search">Tìm kiếm với nội dung: '{this.props.search}'</div>
                {
                    this.props.friendSearch.map((friend) => {
                        return (
                            <div className="row friend" key={friend.id} onClick={() => this.onShowFriendInfo(friend)}>
                                <div className="col-sm-2"><img src={imBg} className="img-circle" alt="avatar user" width="40px" height="40px" /></div>
                                <div className="col-sm-7 friend-name">{friend.name}</div>
                            </div>
                        )
                    })
                }
                {
                    this.props.notFriendSearch.map((friend) => {
                        return (
                            <div className="row friend" key={friend.id} >
                                <div className="col-sm-2"><img src={imBg} className="img-circle" alt="avatar user" width="40px" height="40px" /></div>
                                <div className="col-sm-7 friend-name" onClick={() => this.onShowFriendInfo(friend)}>{friend.name}</div>
                                <div className="col-sm-3">
                                    <Button color="secondary" onClick={() => this.onSubmitAdd(this.props.userId, friend.id)}>Add</Button>
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
export default FriendSearch;