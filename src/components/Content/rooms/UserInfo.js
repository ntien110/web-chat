import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
//img 
import imBg from './../../../images/bg-login.jpg';
class UserInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Modal isOpen={this.props.showInfo}>
                    <ModalHeader>User Information</ModalHeader>
                    <ModalBody>
                        <div className="text-center img-user-info">
                            <img src={imBg} className="img-circle text-center" alt="avatar" width="80px" height="80px" />
                            <div className="title text-center edit-name">{this.props.friendInfo.name}</div>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.props.closeFriendInfo}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}
export default UserInfo;