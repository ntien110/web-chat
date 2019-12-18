import React, { Component } from 'react';

// Components
import Join from './components/Join/Join';
import Content from './components/Content/Content';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showContent: false          
        }
    }
    onSuccessLogin = (userInfo) => {
        this.setState({ userInfo, showContent: true }, () => {
            console.log('State is now', this.state)
        })
    }
    // when error occurred in some lower components
    componentDidCatch() {
        alert('Some Error occurred...!!')
    }
    render() {
        let { showContent, userInfo} = this.state;
        return (
            <div className="App">
                {(showContent === false) ? <Join onSuccessLogin={this.onSuccessLogin} /> : <Content userInfo={userInfo}/>}
            </div>
        );
    }
}
export default App;
