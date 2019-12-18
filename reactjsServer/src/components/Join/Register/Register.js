import React, { Component } from 'react';
import axios from 'axios';
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            username: '',
            password: '',
            userIsExist: false,
        }
    }
    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        if (name === 'username') {
            axios({
                method: 'GET',
                url: 'http://localhost:3000/register/'+value,
            }).then(res => {
                var data = res.data;
                this.setState({
                    userIsExist: !data.isValid
                });
            }).catch(err => {
                console.log(err);
            });
        }
        this.setState({
            [name]: value
        });


    }
    onSubmit = (event) => {
        event.preventDefault();
        const { name, username, password } = this.state;
        axios({
            method: 'POST',
            url: 'http://localhost:3000/register',
            data: {
                name: name,
                username: username,
                password: password
            }
        }).then(res => {
            var data = res.data;
            if (data.success) {
                alert('register success');
            }
            else {
                alert('register not success');
            }
        });
    }
    // getBase64 = (e) => {
    //     this.setState({
    //         displayImg: URL.createObjectURL(e.target.files[0])
    //     });
    //     var file = e.target.files[0];
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         this.setState({
    //             avatar: reader.result
    //         })
    //     };
    //     reader.onerror = function (error) {
    //         console.log('Error: ', error);
    //     }
    // }
    render() {
        var  { name, username, password, userIsExist } = this.state;
        return (
            <div className="signup">
                <div className="title-content">Signup</div>
                <form className="form-signup" onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label className="title">Name</label>
                        <input type="text" className="form-control" placeholder="Enter name" required name="name" value={name} onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label className="title">Username</label>
                        <input type="text" className="form-control" placeholder="Enter username" required name="username" value={username} onChange={this.onChange} />
                        {userIsExist ? <div className="error pl-10">Username is exist</div> : ''}
                    </div>
                    <div className="form-group">
                        <label className="title">Password</label>
                        <input type="password" className="form-control" placeholder="Enter password" required name="password" value={password} onChange={this.onChange} />
                    </div>
                    {/* <div className="form-group phone">
                                <label className="title" className="title">Phone</label>
                                <input type="text" className="form-control" placeholder="Enter phone number" required name="phonenumber" value={phonenumber} onChange={this.onChange} />
                            </div>
                            <div className="form-group upload-img">
                                <label class="title">Image</label>
                                <br />
                                <input type="file" className="box-uploadimg" name="imgUpload" onChange={this.getBase64} />
                                <img src={displayImg} className="img-circle img" width="50px" height="50px" alt="" />
                            </div> */}
                    <button type="submit" className="btn btn-login btn-signup" disabled={userIsExist ? 'disabled' : ''}>Signup</button>
                </form>
            </div>
        );
    }
}

export default Register;