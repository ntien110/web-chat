import React, { Component } from 'react';
import imBg from './../../../images/bg-login.jpg';
//icon 
import {IoMdColorPalette} from 'react-icons/io';
//css
import './ContentRight.css';
class ContentRight extends Component {
    render() {
        let {selectedRoom} = this.props;
        return (
            <div>
                <div className="user-info text-center">
                    <div className="img-user">
                        <img src={selectedRoom.avatar} className="img-circle" alt="Cinque Terre" width="80px" height="80px" />
                    </div>
                    <div className="name-user">{selectedRoom.name}</div>
                </div>
                <div className="user-option">
                    <div className="change-theme">
                        <div class="row">
                            <div class="col-sm-10">Change Theme</div>
                            <div class="col-sm-2" className="icon-changetheme"><IoMdColorPalette /></div>
                        </div>
                    </div>
                </div>
                {/* Modal */}
            </div>
        );
    }
}
export default ContentRight;