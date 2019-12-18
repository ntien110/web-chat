const io=require("socket.io-client")
const socket=io.connect("http://localhost:3002");
onlineRoom=[]
socket.on("welcome",(msg)=>{
    socket.emit("userId","user-"+Math.floor(Math.random()*10));
    console.log(msg);
})

socket.on("iAmOnline",(msg)=>{
    onlineRoom.push(msg);
    console.log(msg+" is online");
})
