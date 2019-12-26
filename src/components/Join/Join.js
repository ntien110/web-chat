import React, { Component } from 'react';

// components 
import Login from './Login/Login';
import Register from './Register/Register';

// img
import imgBg from './../../images/bg-login.jpg';

// css
import './Join.css';

class Join extends Component {
    render() {
        return (
            <div className="join">
                {/* header */}
                <div className="container-fluid text-center header">
                    <div className="logo text-white">WEBCHAT... <i className="fa fa-comments"></i></div>
                </div>
                {/* content */}
                <div className="content">
                    <div className="row">
                        <div className="col-sm-7 p-0">
                            <img src={imgBg} width="100%" height="600px" alt="bglogin" />
                        </div>
                        <div className="col-sm-5 logreg">
                            <div className="logreg-content">
                                <Login onSuccessLogin={this.props.onSuccessLogin}/>
                                <hr />
                                <Register onSuccessLogin={this.props.onSuccessLogin}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="clear"></div>
                {/* footer */}
                <div className="footer">
                    <div className="footer-content">
                        <div className="btn-social">
                            <i className="fa fa-phone"></i>
                        </div>
                        <div className="btn-social">
                            <i className="fa fa-envelope"></i>
                        </div>
                        <div className="btn-social">
                            <i className="fa fa-youtube"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Join;