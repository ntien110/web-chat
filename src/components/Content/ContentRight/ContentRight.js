import React, { Component } from 'react';
import imBg from './../../../images/bg-login.jpg';
//icon 
import {IoMdColorPalette} from 'react-icons/io';
//css
import './ContentRight.css';
class ContentRight extends Component {
    render() {
        return (
            <div>
                <div className="user-info text-center">
                    <div className="img-user">
                        <img src={imBg} className="img-circle" alt="Cinque Terre" width="80px" height="80px" />
                    </div>
                    <div className="name-user">test room</div>
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