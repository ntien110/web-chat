const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const ObjectId= mongoose.Types.ObjectId
const User=require("./User")

const RoomSchema = new mongoose.Schema({
    name: String,
    members: [{
            userId: ObjectId,
            online: Boolean
    }],
    messages: [{
        From: String,
        Type: String,
        Body: {
            type: String,
            default: ''
        },
        time: {
            type: Date,
            default: Date.now()
        },
        seen:[ObjectId]
    }],
    online: Boolean
});
const Room = mongoose.model('Room', RoomSchema);

const create = function (members,callback, name = null) {
    let room = new Room();
    room.name = name;
    room.members = members.map((idString) => ({
        userId: ObjectId(idString),
        online : false
    }))
    room.online=false;
    room.save(callback)
}

const findByUserId=function(userId, callback){
    Room.find({members: {$elemMatch: {userId}}}).exec(callback)
}

// Trả về mảng gồm các _id của các thành viên trong room
var GetRoomMembers = function (roomID, done) {
    Room.findById(roomID, 'members', function (err, doc) {
        done(err, doc.members.map((userId, online)=>userId))
    })
};

// Trả về true nế thêm tin nhắn thành công
var CreateMessage =  function (roomID, From, Type, Body, time, done) {
    let message = {
        From: From,
        Type: Type,
        Body: Body,
        time: time,
        seen: []
    }
    GetRoomByID(roomID, function (err1,data) {
        if (err1) {return done(err1,null)}
        else{
            data.messages.push(message);
            data.save(function (err, savedRoom) {
                let messages=savedRoom.messages
                messages.forEach((msg)=>{
                    let t=new Date(message.time)
                    if (msg.time.toString()==t.toString()){
                        //console.log("ok")
                        msg.roomId=roomID
                        return done(err,msg)
                    }
                })
            })
        }
    })    
} 

 // Chi viec post message, ham se tu kiem tra su ton tai cua room, neu chua co se them
 var GetLastTimeARoom = function(roomID, done){
    Room.findById(roomID, 'message', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.messages[doc.messages.length-1].time);

    })
}

// Trả về mảng gồm 'number' tin nhắn trong room. ví dụ cần lấy 5 tin nhắn thì number = 5.
var GetMessengerInRoom = function(roomID, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        // console.log(roomID, err, doc)
        if(err) console.log(err);
        return done(err, doc.messages);

    })
}

var SetRoomStatus = function(roomID, status, done){
    //console.log(`Room 91,set room ${roomID} to ${status}`)
    Room.updateOne({_id: roomID}, {
         
            'online': status
    }, function () {
         //console.log(('Update complete'));
         return done(null, true);
    })
}

var GetRoomStatus = function(roomID, done){
    Room.findById(roomID, 'online', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.isOnline);

    })
}

var GetRoomByID =  function (roomID, done) {
    Room.findById(roomID, 'members isOnline messages', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc);

    })
};

const getRoomsByUserIdAndStatus=function(userId, compareRoomStatusFunc, callback){
    //console.log("115 Room: ",userId)
    User.getRoomListByUserId(userId,(err, roomList)=>{
        //console.log("120 Room: ",err, roomList)
        if (err){
            //console.log("cannot find room list of user having Id: "+userId)
            callback(err, roomList)
        }else{
            Room.find().where('_id').in(roomList).exec((err1, data)=>{
                //console.log("126 Room: ",err1,data)
                if(err) return console.log("error at Room.js 129: ",err1)
                //console.log("Room----124: ",data)
                fitRooms=data.filter(compareRoomStatusFunc)
                callback(err, fitRooms.map((fitRoom)=>fitRoom._id))
            })
            
        }

    })
}

const countOnlineUser=function(roomId, callback){
    GetRoomByID(roomId,(err,room)=>{
        if(err){
            console.log("Error when getUserByID in countOnlineUser: ",err)
            return callback(err, room)
        }else{
            members=room.members
            count=members.reduce((sum, member)=> member.online?sum+1:sum,0)
            callback(null, count)
        }
    })
}

const changeMemberOnlineStatus=function(roomId, userId, online,callback){
    GetRoomByID(roomId,(err, room)=>{
        if (err){
            console.log("error when GetRoomById in getUserToOnline :", err)
            return callback(err,room)
        }
        for (let i =0; i<room.members.length;i++){
            if (room.members[i].userId==userId){
                room.members[i].online=online
            }
        }
        room.save(callback)
    })       
}

const markAsSeen=function(roomId, messageId, userId, callback){
    Room.findById(roomId,(err1, room)=>{
        if(err1) {
            //console.log("Error when findById at markAsSeen: ", err)
            callback(err1, room)
        }else if(room==null){
            //console.log(`Room with Id ${roomId} is not found at markAsSeen`)
            callback(`Room with Id ${roomId} is not found at markAsSeen (callback)`, room)
        }else {
            let messages=room.messages
            for(let i in messages){
                if(messages[i]._id==messageId){
                    let index=messages[i].seen.indexOf(ObjectId(userId))
                    if (index==-1){
                        Room.update(
                            {'messages._id': messageId},
                            {$set:{'messages.$.seen':[...messages[i].seen,ObjectId(userId)]}},
                            callback
                        )
                        break
                    }else{
                        callback(`Error User ${userId} have seen message ${messageId}`, room)
                    }
                    break
                }
            }
        }
    })
}

// console.log("run")
// countOnlineUser("5dfa00f9c8ebee3b30bdba18",(err,data)=>{
//     console.log(err, data)
// })

// setUserToOnline("5dfa00f9c8ebee3b30bdba18","5df8a8176377113751905e66",(err, data)=>{
//     console.log(err,data)
// })

//create(["5df8a8176377113751905e66","5dc994237ca7c207c3b36ba1"],(err, data)=>{console.log(data)}, "test room")
// findByUserId("313131313131313131313132",(err, data)=>{
//     console.log(err, data)
// })

//CreateMessage("5dfa00d14a06793b0a76a342","5dfa00d14a06793b0a76a343","text","reply to the first one",1,(err,data)=>{console.log(data)})

module.exports = {
    findByUserId,
    create,
    GetLastTimeARoom,
    GetMessengerInRoom,
    GetRoomByID,
    GetRoomMembers,
    GetRoomStatus,
    SetRoomStatus,
    CreateMessage,
    getRoomsByUserIdAndStatus,
    changeMemberOnlineStatus,
    countOnlineUser,
    markAsSeen
};

