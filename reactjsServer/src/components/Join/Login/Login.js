import React, { Component } from 'react';
import axios from 'axios';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
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

        this.setState({ password: '', username: '' });
        axios({
            method: 'post',
            url: 'http://localhost:3000/',
            data: {
                username: username,
                password: password
            }
        }).then(res => {
            var data = res.data;
            if (data.isValid) {
                console.log("login successful");

                this.props.onSuccessLogin(res.data.userID)
            } else {
                // reload the page
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
