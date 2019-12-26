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
            from: ''
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    componentWillReceiveProps(nextProps) {
        let newRooms = [...this.state.rooms];
        newRooms.forEach((room) => {
            if (room.roomId === nextProps.onNewMessageArrival.roomId) {
                let lastMessage = room.lastMessage !== null ? room.lastMessage : { "Body": "", "time": "" };
                // adjust the necessary field if the roomId matches
                lastMessage.Body = nextProps.onNewMessageArrival.Body;
                lastMessage.time = nextProps.onNewMessageArrival.time;
                // lastMessage.senderId = nextProps.onNewMessageArrival.senderId;

                // if the message is from other non active room
                // if (room.read === true) {
                //     room.read = false
                //     this.saveReadStatusToDb(room, false)
                // }
            }
        })
        // newRooms = newRooms.sort((a, b) => {
        //     let x = a.lastMessage !== null ? a.lastMessage : { "time": "" };
        //     let y = b.lastMessage !== null ? b.lastMessage : { "time": "" };
        //     return new Date(y.time) - new Date(x.time);

        // });
        this.setState({ rooms: newRooms });
    }
    componentDidMount() {
        this.props.socket.on("newFriendRequest", (data) => {
            this.state.listWait.push(data);
        })
        this.loadrooms();
    }
    loadrooms() {
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
                console.log("getRooms", data.rooms);
                this.setState({ rooms: data.rooms });
            }
            else {
                console.log("getRoom is failed");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    setSelectedRoomId = (id) => {
        // pass the selected room id augmented with logged in userid to the parent 
        this.props.setSelectedRoomId(id);
        // set active room id for highlighting purpose
        this.setState({ activeRoomId: id });
        // this.changeReadStatus(id)
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
            console.log("data", data);
            if (data.status) {
                this.setState({
                    friendSearch: data.friend,
                    notFriendSearch: data.notFriend
                });
            } else {
                alert('search failed');
            }
            console.log(this.state.friendSearch, this.state.notFriendSearch);
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
                console.log(data);
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
                console.log(data);
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();

    }
    onShowMessage = () => {
        this.setState({
            showMessage: true,
            showListFriend: false
        });
    }
    // function to change the room status from read / unread
    // changeReadStatus(id) {
    //     let allRooms = [...this.state.rooms];
    //     console.log('change status reached');

    //     allRooms.forEach((room, index, roomArray) => {
    //         if (room.roomId === id && room.read === false) {
    //             roomArray[index].read = true
    //             this.saveReadStatusToDb(room, true)
    //         }
    //     })

    //     console.log('All rooms are now', allRooms)
    //     this.setState({ rooms: allRooms })
    // }
    // saveReadStatusToDb(room, status) {
    //     axios({
    //         method: 'PUT',
    //         url: 'http://localhost:9000/updateroomreadstatus',
    //         data: {
    //             userId: this.props.userInfo.userId,
    //             roomName: room.roomName,
    //             read: status
    //         }
    //     }).then((response) => {
    //             console.log('room status saved');
    //     }).catch((err) => {
    //          console.log('unable to save room status', err);
    //     })
    // }
    render() {
        let { userId, setSelectedRoomId, socket } = this.props;
        let { from, activeRoomId, rooms, showListFriend, showMessage, listFriend, listWait, showAllFriend, notFriendSearch, friendSearch, search } = this.state;
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
                                <div className={showMessage ? "col-sm-4 btn-left active-btn-left" : "col-sm-4 btn-left"} onClick={this.onShowMessage}>Message</div>
                                <div className={showListFriend ? "col-sm-4 btn-left active-btn-left" : "col-sm-4 btn-left"} onClick={this.onShowListFriend}>Friend</div>
                                <div className={!showMessage && !showListFriend ? "col-sm-4 btn-left active-btn-left" : "col-sm-4 btn-left"} onClick={this.onShowAddfriend}>Add friend</div>
                            </div>
                            <hr />
                            <div className="message-box">
                            {

                                showMessage ?
                                    rooms.map((room) => {
                                        return (
                                            <div className={activeRoomId === room.roomId ? 'chat_list active_chat' : 'chat_list'} key={room.roomId} onClick={() => this.setSelectedRoomId(room.roomId)}>
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
                                        <ListWait listWait={listWait} userId={userId} />
                            }
                            </div>
                        </div>
                }
            </div>
        );
    }
}
export default RoomPanel;