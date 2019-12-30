import React, { Component } from 'react';
import { IoIosSend } from 'react-icons/io';
import { MdInsertEmoticon, MdAttachFile } from 'react-icons/md';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from 'axios';
// Constants
import Constants from './../../Constants';
class WriteMessage extends Component {
    constructor() {
        super();
        this.state = {
            chatText: '',
            showSticker: false,
            avatar: ''
        };
        // instantiate the Constants
        this.allConstants = new Constants();
    }
    handleChange = (e) => {
        this.setState({
            chatText: e.target.value
        });
    }
    // getBase64Img = (e) => {
    //     var file = e.target.files[0];
    //     let reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         //console.log(reader.result);
    //         let data = {
    //             time: new Date(),
    //             Body: reader.result,
    //             From: this.props.userId,
    //             roomId: this.props.selectedRoomId,
    //             Type: "Image"
    //         }
    //         //console.log('the message', data);
    //         // console.log('length of the message', data.msgBody.length);
    
    //         // emit the message
    //         if (data.Body.length > 0) {
    //             this.props.socket.emit('send', data);
    //         }
    //     };
    //     reader.onerror = function (error) {
    //         console.log('Error: ', error);
    //     }
    // }
    sendSticker = (sticker) => {   
        let data = {
            time: new Date(),
            Body: sticker,
            From: this.props.userId,
            roomId: this.props.selectedRoomId,
            Type: "Sticker"
        }
        //console.log('the message', data);
        // console.log('length of the message', data.msgBody.length);

        // emit the message
        if (data.Body.length > 0) {
            this.props.socket.emit('send', data);
        }
        this.setState({
            showSticker: false
        });
    }
    userTyping = (e) => e.keyCode === 13 ? this.submitMessage() : this.setState({ chatText: e.target.value });
    submitMessage = (e) => {
        console.log(new Date());
        let { chatText } = this.state;
        // define the chat message

        let data = {
            time: new Date(),
            Body: chatText,
            From: this.props.userId,
            roomId: this.props.selectedRoomId,
            Type: "Text"
        }
        //console.log('the message', data);
        // console.log('length of the message', data.msgBody.length);

        // emit the message
        if (data.Body.length > 0) {
            this.props.socket.emit('send', data);
            this.setState({ chatText: '' });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.selectedRoomId !== prevProps.selectedRoomId) {
            this.setState({ chatText: '' });
        }
    }
    onShowSticker = () => { 
        this.setState({
            showSticker: true
        });
    }
    onCloseSticker = () => {
        this.setState({
            showSticker: false
        });
    }
    render() {
        let { showSticker } = this.state;
        let { stickers } = this.props;
        console.log(stickers);
        return (
            <div className="type_msg">
                <div className="row">
                    <input type="text"
                        placeholder="Type your message..."
                        value={this.state.chatText}
                        onChange={this.handleChange}
                        onKeyUp={(e) => this.userTyping(e)}
                        className="box-text"
                    >
                    </input>
                    <IoIosSend className="btn-send btn-msg" onClick={this.submitMessage} />
                    <MdInsertEmoticon className="btn-send btn-msg" onClick={this.onShowSticker} />          
                    {/* <input type="file" id="file" accept="image/*" /> 
                    <label for="file"><MdAttachFile className="btn-send btn-msg"/></label> */}
                </div>
                <Modal isOpen={showSticker}>
                    <ModalHeader>Icon</ModalHeader>
                    <ModalBody>
                        {
                            stickers.map((sticker) => {
                                return (
                                    <img key={sticker.id} src={sticker.body} className="img-circle" alt="avatar user" width="40px" height="40px" onClick={() => this.sendSticker(sticker.id)}/>
                                )
                            })
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.onCloseSticker}>Cancel</Button>
                    </ModalFooter>
                </Modal>

            </div>
        );
    }
}
export default WriteMessage;