import React, { Component } from 'react';
import imBg from './../../../images/bg-login.jpg';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
//icon 
import {IoMdColorPalette} from 'react-icons/io';
//css
import './ContentRight.css';

class ContentRight extends Component {
    constructor(props){
        super(props);
        this.state = {
            themes: [
                {
                    "color": "#6f5499",
                    "body" : "default-theme" 
                },
                {
                    "color": "#920000",
                    "body" : "red-theme" 
                },
                {
                    "color": "#005018",
                    "body" : "green-theme" 
                },
                {
                    "color": "#1d0364",
                    "body" : "blue-theme" 
                },
                {
                    "color": "#8d0755",
                    "body" : "pink-theme" 
                }
            ],
            showColorTheme : false
        }
    }
    onCloseColor = () =>{
        this.setState({
            showColorTheme: true
        })
    }
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
                    <div className="change-theme" onClick={() => this.setState({showColorTheme: true})}>
                        <div class="row">
                            <div class="col-sm-10">Change Theme</div>
                            <div class="col-sm-2" className="icon-changetheme"><IoMdColorPalette /></div>
                        </div>
                    </div>
                </div>
                <Modal isOpen={this.state.showColorTheme}>
                    <ModalHeader>Color</ModalHeader>
                    <ModalBody>
                        {
                            this.state.themes.map((theme) => {
                                return(
                                    <div className="circle" style={{backgroundColor: `${theme.color}`}} onClick={() =>{this.setState({showColorTheme: false});this.props.onChangeColor(theme.body)}}></div>
                                )
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.onCloseColor}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}
export default ContentRight;