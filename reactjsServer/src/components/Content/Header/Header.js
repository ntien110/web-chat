import React, { Component } from 'react';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            showLogout : false
        };
    }
    render() {
        let {userInfo} = this.props;
        let {showLogout} = this.state;
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
                            {/* <Link className="iconbtn fa fa-users" to='/add'></Link> */}
                            {/* notification message */}
                            {/* <div className="notif n2">2</div> */}
                            {/* <Link className="iconbtn fa fa-comment" to='/chat'></Link> */}
                            {/* notification */}
                            {/* <div className="notif n3">3</div> */}
                            {/* <Link className="iconbtn fa fa-bell"></Link> */} 

                        </div>
                        <div className="col-sm-3 iconuser">
                            <div className="avatar" onClick={this.onToggleLogout}>
                                <img src={userInfo.avatar} className="img-circle" alt="avatar" width="40px" height="40px" />
                            </div>
                            {showLogout ?
                                <button className="btn-logout" onClick={this.handleLogout}>Login</button>
                                :
                                ''
                            }
                            <span>{userInfo.name}</span>
                        </div>
                        <div className="switchmode">
                            <input type="checkbox" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Header;