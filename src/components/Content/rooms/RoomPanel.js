import React, { Component } from 'react';
import axios from 'axios';
import { MdSearch } from 'react-icons/md';
import { Button } from 'reactstrap';
//Component
import RoomInfo from './RoomInfo';
import ListFriend from './ListFriend';
import FriendSearch from './FriendSearch';
import ListWait from './ListWait';
// Constants
import Constants from './../../Constants';
//css
import './RoomPanel.css';

class RoomPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            showMessage: true,
            search: '',
            showListFriend: false,
            showListWait: false,
            listFriend: [],
            listWait:[],
            showAllFriend: false,
            friendSearch: [],
            notFriendSearch: [],
            from: '',
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentWillReceiveProps(nextProps) {
        let newRooms = [...this.state.rooms];
        newRooms.forEach((room) => {
            if (room.roomId === nextProps.onNewMessageArrival.roomId) {
                let lastMessage = room.lastMessage !== null ? room.lastMessage : { "Body": "", "time": "", "_id":"","From":"","Type":"" };
                // adjust the necessary field if the roomId matches
                lastMessage.Body = nextProps.onNewMessageArrival.Body;
                lastMessage.time = nextProps.onNewMessageArrival.time;
                lastMessage._id = nextProps.onNewMessageArrival.messageId;
                lastMessage.From = nextProps.onNewMessageArrival.From;
                lastMessage.Type = nextProps.onNewMessageArrival.Type;

                // lastMessage.senderId = nextProps.onNewMessageArrival.senderId;

                // if the message is from other non active room
                // if (room.read === true) {
                //     room.read = false
                //     this.saveReadStatusToDb(room, false)
                // }
            }
            
        })   
        this.setState({ rooms: newRooms });
        let rooms = this.state.rooms;
        //console.log(this.props.onlineRooms);
        for (let i in rooms ){
            if (rooms[i].roomId === nextProps.onNewMessageArrival.roomId && nextProps.onNewMessageArrival !== this.props.onNewMessageArrival){
                rooms[i].messageCount ++;
            }
            let j = this.props.onlineRooms.indexOf(rooms[i].roomId);
            if (j >= 0) {
                //console.log("online");
                rooms[i].online = true;
            }
            else 
            {
                //console.log("offline");
                rooms[i].online = false;  
            }
        }
        //console.log("new Rooms", rooms);
        this.setState({ rooms });
        // newRooms = newRooms.sort((a, b) => {
        //     let x = a.lastMessage !== null ? a.lastMessage : { "time": "" };
        //     let y = b.lastMessage !== null ? b.lastMessage : { "time": "" };
        //     return new Date(y.time) - new Date(x.time);

        // });
       
    }
    componentDidMount() {
        this.props.socket.on("newFriendRequest", (data) => {
            this.state.listWait.push(data);
        })
        this.loadrooms();
        this.props.socket.on("newRoom",()=>{
            this.loadrooms();
        })
    }
    loadrooms() {
        //console.log("load room");
        let allConstants = this.allConstants;
        // call the back end to get rooms
        axios({
            method: 'POST',
            url: allConstants.getRooms,
            data: {
                userId: this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                let rooms = data.rooms;
                //console.log("getRooms", data.rooms);
                this.setState({ rooms: rooms });
                let onlineRooms = [];
                for (let i in rooms){
                    if (rooms[i].online) onlineRooms.push(rooms[i].roomId);
                }
                this.props.getOnlineRooms(onlineRooms);
            }
            else {
                console.log("getRoom is failed");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    setSelectedRoomId = (room) => {
        // pass the selected room id augmented with logged in userid to the parent 
        this.changeReadStatus(room.roomId);
        this.props.setSelectedRoomId(room);
        // set active room id for highlighting purpose
        this.setState({ activeRoomId: room.roomId });
        

    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.search,
            data: {
                userId: this.props.userId,
                name: value
            }
        }).then(res => {
            var data = res.data;
            //console.log("data", data);
            if (data.status) {
                this.setState({
                    friendSearch: data.friend,
                    notFriendSearch: data.notFriend
                });
            } else {
                alert('search failed');
            }
            //console.log(this.state.friendSearch, this.state.notFriendSearch);
        }).catch(err => {
            console.log(err);
        });
    }
    onShowListFriend = (event) => {
        let allConstants = this.allConstants;
        this.setState({
            showListFriend: true,
            showMessage: false
        });
        axios({
            method: 'POST',
            url: allConstants.getListFriend,
            data: {
                userId: this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                this.setState({
                    listFriend: data.friendList
                })
                //console.log(data);
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();
    }
    onShowAddfriend = (event) => {
        let allConstants = this.allConstants;
        this.setState({
            showListFriend: false,
            showMessage: false
        });
        axios({
            method: 'POST',
            url: allConstants.getListWait,
            data: {
                userId: this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                this.setState({
                    listWait: data.waitList
                })
                //console.log(data);
            }
        }).catch(err => {
            //console.log(err);
        });
        event.preventDefault();

    }
    onShowMessage = () => {
        this.setState({
            showMessage: true,
            showListFriend: false
        });
    }
    onAcceptedFriendRequest = (from, to) => {
        let list = this.state.listWait;
        let index = list.findIndex((friend) => friend.userId === to);
        if (index >= 0) list.splice(index, 1); 
        this.setState({
            listWait: list
        })
    }
    //function to change the room status from read / unread
    changeReadStatus(id) {
        //console.log("gfd");
        let rooms = this.state.rooms;
        let msg = '';
        
        for (let i in rooms){
            if (rooms[i].roomId === id){
                let lastMessage = rooms[i].lastMessage !== null ? rooms[i].lastMessage : { "Body": "", "time": "" };
                msg = lastMessage._id;
                
                break;
            }
        }
        //console.log("data1: ",);
        let data = {
            userId : this.props.userId,
            roomId: id,
            messageId: msg
        }
        
        this.props.socket.emit("seen", data);
    }
    render() {
        let { userId, setSelectedRoomId, socket, onlineRooms } = this.props;
        let btnLeft = 'btn-left';  
        let { from, activeRoomId, rooms, showListFriend, showMessage, listFriend, listWait, showAllFriend, notFriendSearch, friendSearch, search } = this.state;
        //console.log("lastMessage1: ",rooms);
        return (
            <div className="inbox_chat">
                <div className="search-box-wrapper">
                    <input type="text" placeholder="Search..." className="search-box-input" name="search" onChange={this.onChange} />
                    <button className="search-box-button"><MdSearch /></button>
                </div>
                <hr />
                {
                    search !== '' ?
                        <FriendSearch search={search} notFriendSearch={notFriendSearch} friendSearch={friendSearch} socket={socket} userId={userId} />
                        :
                        <div>
                            <div className="row">
                                <div className={showMessage ? `col-sm-4 ${btnLeft} active-btn-left` : `col-sm-4 ${btnLeft}`} onClick={this.onShowMessage}>Message</div>
                                <div className={showListFriend ? "col-sm-4 btn-left active-btn-left" : "col-sm-4 btn-left"} onClick={this.onShowListFriend}>Friend</div>
                                <div className={!showMessage && !showListFriend ? "col-sm-4 btn-left active-btn-left" : "col-sm-4 btn-left"} onClick={this.onShowAddfriend}>Add friend</div>
                            </div>
                            <hr />
                            <div className="message-box">
                            {

                                showMessage ?
                                    rooms.map((room) => {
                                        return (
                                            <div className={activeRoomId === room.roomId ? 'chat_list active_chat' : 'chat_list'} key={room.roomId} onClick={() => this.setSelectedRoomId(room)}>
                                                <RoomInfo
                                                    room={room}
                                                    userId={userId}
                                                    setSelectedRoomId={setSelectedRoomId}
                                                />
                                            </div>
                                        )
                                    })
                                    :
                                    showListFriend ?
                                        <ListFriend listFriend={listFriend} />
                                        :
                                        <ListWait onAcceptedFriendRequest={this.onAcceptedFriendRequest} socket={socket} listWait={listWait} userId={userId} />
                            }
                            </div>
                        </div>
                }
            </div>
        );
    }
}
export default RoomPanel;