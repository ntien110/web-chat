const wesocketPort=3002;
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
users=[]
io.on('connection', (socket) => {
  userId=null;
  socket.emit("welcome","wellcome message")


  socket.on("userId",(msg)=>{
    userId=msg
    users.push({userId,socket});
    //get all room online
    OnlineRooms=["0","1"]
    for (roomId in OnlineRooms){
      socket.join(roomId)
      socket.to(roomId).emit("iAmOnline",userId);
    }
    //get all room offline
    offlineRooms=['3','4']
    for (roomId in offlineRooms){
      //set to online in DB
    }

  })

  socket.on("disconnect",function(){
    //set all room in DB to offline and return all room id
    allRooms=['1','2','3','4'];
    for (roomId in allRooms){
      socket.to(allRooms[roomId]).emit("iAmOffline", userId);
    }
    console.log(userId+" disconnected")
  })
});
server.listen(wesocketPort,()=>{
  console.log("listening on port "+wesocketPort)
});