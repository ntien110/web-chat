const io=require("socket.io-client")
io({transports: ['websocket']})
const socket=io.connect("http://127.0.0.1:3002");
onlineRoom=[]
console.log("online")
socket.on("welcome",(msg)=>{
    console.log("welcome")
    socket.emit("userId","user-"+Math.floor(Math.random()*10));
    //next: send userConfig
    console.log(msg);
})

socket.on("welcome",(msg) =>{
    socket.emit("userId","this.props.userId");

    
});
socket.on("iAmOnline",({userId,roomId}) =>{
    let onlineRooms=this.state.onlineRooms
    if (onlineRooms.hasOwnProperty(roomId)){
        onlineRooms[roomId].push(userId)
    }else{
        onlineRooms[roomId]=[userId]
    }
    this.setState({
        onlineRooms
    })
});
socket.on("message",(msg)=>{ 
    console.log(msg.content)
})

//khi gửi tin nhắn thì chạy cái này
//socket.emit("send","tin nhan");

// hàm tạo tin nhắn
// createMessage=function(roomId, senderId, Body, content){
//     //type: text, sticker, image
//     return {
//         roomId,
//         senderId,
//         type,
//         Body,
//         time: Date.now()
//     }
// }