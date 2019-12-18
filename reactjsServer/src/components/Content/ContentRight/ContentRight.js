import React, {Component} from 'react';
import {Link} from 'react-router-dom';
class ContentRight extends Component {
    render(){   
        return (
            <div className="user-info">
                <div className="img-user">
                    <img src="./../../../images/bg-login.jpg" className="img-circle" alt="Cinque Terre" width="80px" height="80px"/> 
                </div>
                <Link to=""><div className="name-user">{this.props.friendName}</div></Link>                   
            </div>
            
        );
    }
}
export default ContentRight;