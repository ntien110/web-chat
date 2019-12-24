import React, { Component } from 'react';
import axios from 'axios';
//SHA1 
import SHA1 from 'sha1';
// Constants
import Constants from './../../Constants';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            [name]: value
        });
    }
    onSubmit = (event) => {
        let { username, password } = this.state;
        let allConstants = this.allConstants;
        axios({
            method: 'POST',
            url: allConstants.login,
            data: {
                username: username,
                password: SHA1(password)
            }
        }).then(res => {
            var data = res.data;
            if (data.status) {
                console.log("login successful");
                this.props.onSuccessLogin(data.userId);
            } else {
                // reload the page
                console.log("login failed");
               alert("login failed");
            }
        }).catch(err => {
            console.log(err);
        });
        event.preventDefault();
    }
    render() {
        return (
            <div className="login">
                <div className="title-content">Login</div>
                <form onSubmit={this.onSubmit}>
                    <div className="row">
                        <div className="col-sm-4 pl-0">
                            <div className="form-group">
                                <label className="title">Username</label>
                                <input type="text" className="form-control" required name="username" onChange={this.onChange} />
                            </div>
                        </div>
                        <div className="col-sm-4 pl-0">
                            <div className="form-group">
                                <label className="title">Password</label>
                                <input type="password" className="form-control" required name="password" onChange={this.onChange} />
                            </div>
                        </div>
                        <div className="col-sm-4 pt-30">
                            <button type="submit" className="btn-login">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}
export default Login;
