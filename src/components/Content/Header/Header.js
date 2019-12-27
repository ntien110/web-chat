import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { MdModeEdit } from 'react-icons/md';
import axios from 'axios';
import {TiMessages} from 'react-icons/ti'; 
import {FaUserFriends} from 'react-icons/fa';
// components 
import imgBg from './../../../images/bg-login.jpg';
// Constants
import Constants from './../../Constants';
//css
import './Header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        const src = imgBg;
        this.state = {
            showInfo: false,
            showUserInfo: false,
            name: '',
            avatar: '',
            preview: null,
            src: src,
            showEditName: false,
            switchmode: ''
        };
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    Logout = () => {
        localStorage.removeItem("user");
        window.location.reload();
    }
    onToggleLogout = () => {
        this.setState({
            showInfo: !this.state.showInfo
        });
    }
    OpenUserInfo = () => {
        this.setState({
            showUserInfo: true,
            showInfo: false,
            showEditName: false
        });
    }
    closeEditUserInfo = () => {
        this.setState({
            showUserInfo: false,
            showInfo: false
        });
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        if (target.type === 'checkbox') {
            this.props.onSwitchMode(value);
            this.setState({
                switchmode: value
            })
        }
        if (target.type ==='file'){
            this.getBase64(event);
        }
        else {
            this.setState({
                [name]: value
            });
        }
    }
    getBase64 = (e) => {
        this.setState({
            displayImg: URL.createObjectURL(e.target.files[0])
        });
        var file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result);
            this.setState({
                avatar: reader.result
            })
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }
    EditUserInfo = (event) => {
        let { name, avatar } = this.state;
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.editUser,
            data: {
                userId: this.props.userId,
                name: name,
                avatar: avatar
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                //alert("update successful");
                this.closeEditUserInfo();
                
            } else {
                alert("update failed");
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();
    }
    componentDidMount() {
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.getUser,
            data: {
                userId: this.props.userId
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                console.log(data.avatar);
                this.setState({
                    name: data.name,
                    avatar: data.avatar
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }
    showEditName = () => {
        this.setState({
            showEditName: true
        });
    }
    render() {

        let { name, avatar, showInfo, showUserInfo, showEditName, switchmode } = this.state;
        let edituser = 'edituser';
        if (switchmode) edituser = 'edituserDark';
        return (
            <div className="container-fluid p-30">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-3" >
                            <div className="logo text-white">
                                WEBCHAT... <i className="fa fa-comments"></i>
                            </div>
                        </div>
                        <div className="col-sm-6 text-center iconheader">
                            {/* notification add friend
                            {/* <div className="notif n1">1</div> */}
                            {/* <a className="iconbtn fa fa-users" to='/add'></a>
                            {/* notification message */}
                            {/* <div className="notif n2">2</div> */}
                            {/* <a className="iconbtn fa fa-comment" to='/chat'></a> */}
                            {/* notification */}
                            {/* <div className="notif n3">3</div> */}
                            {/* <a className="iconbtn fa fa-bell"></a> */} 
                            {/* <FaUserFriends className='iconbtn'/>
                            <TiMessages className='iconbtn'/> */}
                        </div>
                        <div className="col-sm-3 iconuser">
                            <span>{name}</span>

                            <div className="avatar" onClick={this.onToggleLogout}>
                                <img src={avatar} className="img-circle" alt="avatar" width="40px" height="40px" />
                            </div>
                            {showInfo ?

                                <div className={edituser}>
                                    <div className="box-edituser" onClick={this.OpenUserInfo}>Update Information</div>
                                    <hr />
                                    <div className="box-edituser" onClick={this.Logout} >Logout</div>
                                </div>
                                :
                                ''
                            }

                        </div>
                        <div className="switchmode">
                            <input type="checkbox" name="switchmode" onChange={this.onChange}/>
                        </div>
                    </div>
                </div>
                <Modal isOpen={showUserInfo}>
                    <ModalHeader>User Information</ModalHeader>
                    <ModalBody>
                        <div className="text-center img-user-info"><img src={avatar} className="img-circle text-center" alt="avatar" width="80px" height="80px" /></div>
                        {!showEditName ?
                            <div>
                                <div className="title text-center edit-name">{name}</div>
                                <MdModeEdit className="editName" onClick={this.showEditName} />
                                
                            </div>
                            :
                            <div className="form-group">
                                <label className="title">Name:</label>
                                <input type="text" className="form-control" placeholder="Enter password" name ="name" required value={name} onChange={this.onChange} />
                            </div>
                        }
                        <input type="file" name="avatar" onChange = {this.onChange} />  
                        {/* <div className="form-group">
                            <label className="title">Phone Number:</label>
                            <input type="text" className="form-control" placeholder="Enter phone" name="phone" required value="0389632456" onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <label className="title">Birthday:</label>
                            <input type="date" className="form-control" name="dob" onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <label className="title">Sex:</label>
                            <br/>
                            <input type="radio" name="sex" className="sex" value="Male" /> Male
                            <input type="radio" name="sex" className="sex" value="Female"/> Female
                            
                        </div>
                         */}

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.EditUserInfo}>Edit</Button>
                        <Button color="secondary" onClick={this.closeEditUserInfo}>Cancel</Button>

                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}
export default Header;