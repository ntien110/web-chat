import React, { Component } from 'react';
import './ListFriend.css';
//component
import UserInfo from './UserInfo';
//img 
import imBg from './../../../images/bg-login.jpg';
class ListFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            friendInfo: {}
        }
    }
    onShowFriendInfo = (friend) =>{
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
        let {showInfo, friendInfo} = this.state;
        //console.log(this.props.listFriend!=null?[]:this.props.listFriend)
        return (
            <div>
                {
                    this.props.listFriend.map((friend) => {
                        return (
                            <div className="row friend" key={friend.id} onClick={() => this.onShowFriendInfo(friend)}>
                                <div className="col-sm-2"><img src={friend.avatar} className="img-circle" alt="avatar user" width="40px" height="40px" /></div>
                                <div className="col-sm-10 friend-name">{friend.name}</div>                    
                            </div>
                        )
                    })
                }
                 <UserInfo showInfo={showInfo} friendInfo={friendInfo} closeFriendInfo={this.closeFriendInfo}/> 
            </div>
        )
    }
}
export default ListFriend;