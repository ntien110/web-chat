import React, { Component } from 'react';

// Components
import Join from './components/Join/Join';
import Content from './components/Content/Content';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        }
    }
    onSuccessLogin = (userId) => {
        localStorage.setItem("user", userId);
        this.setState({
            userId
        });
    }
    // when error occurred in some lower components
    componentDidCatch() {
        alert('Some Error occurred...!!')
    }
    render() {
        let {userId} = this.state;
        userId = localStorage.getItem("user") != null ? localStorage.getItem("user"): userId;
        return (
            <div className="App">
                {(userId === '') ? <Join onSuccessLogin={this.onSuccessLogin} /> : <Content userId={userId}/>}
            </div>
        );
    }
}
export default App;
