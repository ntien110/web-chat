const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const ObjectId= mongoose.Types.ObjectId


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
            default: null
        },
        time: {
            type: Date,
            default: Date.now()
        },
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
    id=ObjectId(userId);
    Room.find({members: {$elemMatch: {userId: id}}}).exec(callback)
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
        time: time
    }
    GetRoomByID(roomID, function (err,data) {
        if (err) {return done(err,null)}
        else{
            data.messages.push(message);
            data.save(function (err, doc) {
                return done(err,doc)
            })
        }
    })    
} 

 // Chi viec post message, ham se tu kiem tra su ton tai cua room, neu chua co se them
 var GetLastTimeARoom = function(roomID, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        done(err,doc.messages[doc.messages.length-1].time);

    })
}

// Trả về mảng gồm 'number' tin nhắn trong room. ví dụ cần lấy 5 tin nhắn thì number = 5.
var GetMessengerInRoom = function(roomID, number, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        if(err) return done(err);
        else return done(doc.messages);
    }).limit(number)
}

var SetRoomStatus = function(roomID, status){
    Room.updateOne({_id: roomID}, {
         
            'isOnline': status
    }, function () {
         console.log(('Update complete'));
    })
}

// Trả về trạng thái online của room, true or false 
var GetRoomStatus = function(roomID  , done){
    Room.findById(roomID, 'isOnline', function (err, doc) {
        done(err,doc);
    })
}


//create(["5df8a8176377113751905e66","5dc994237ca7c207c3b36ba1"],(err, data)=>{console.log(data)}, "test room")
// findByUserId("313131313131313131313132",(err, data)=>{
//     console.log(err, data)
// })
module.exports = {
    findByUserId,
    create,
    GetLastTimeARoom,
    GetMessengerInRoom,
    GetRoomByID,
    GetRoomMembers,
    GetRoomStatus,
    SetRoomStatus
};