const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const roomSchema = mongoose.Schema({
    members: [String],
    messages: [{
        From: String,
        Type: String,
        Body: {
            type: String,
            default: 'hello'
        },
        time: {
            type: Date,
            default: Date.now()
        },
    }]
});


var Room = mongoose.model('Room', roomSchema);

var CreateRoom = function (member1, member2, done) {
    let room = new Room({
        members: [member1, member2]
    });
    room.save(function (err, doc) {
        if (err) return done(err);
        return done(doc._id);
    });
};

var GetMembersARoom = function (roomID, done) {
    Room.findById(roomID, 'members', function (err, doc) {
        if(err) return done(err);
        else return done(doc.members);

    })
};

var GetRoomByID =  function (roomID, done) {
    Room.findById(roomID, 'members messages', function (err, doc) {
        if(err) return done(err);
        else return done(doc);

    })
};

var CreateMessage =  function (roomID, From, Type, Body, time, done) {
    let message = {
        From: From,
        Type: Type,
        Body: Body,
        time: time
    }
    GetRoomByID(roomID, function (data) {
        data.messages.push(message);
        data.save(function (err, doc) {
            if(err) return done(err);
            else return done(true);

        })

    })
};

 // Chi viec post message, ham se tu kiem tra su ton tai cua room, neu chua co se them
var GetLastTimeARoom = function(roomID, done){
    Room.findById(roomID, 'message', function (err, doc) {
        if(err) return done(err);
        else return done(doc.messages[doc.messages.length-1].time);

    })
}

module.exports = {
    CreateRoom,
    GetRoomByID,
    CreateMessage,
    GetLastTimeARoom,
    GetMembersARoom
};


//------------------------------*************TEST************--------------------------------

// CreateRoom('5dc994237ca7c207c3b36ba1', '5dc994237ca7c207c3b36ba1', function (data) {
//     console.log(data);
//     //RoomID: 5dd0b34cfaad660319f30685
// })

// GetMembersARoom('5dd0b34cfaad660319f30685', function (data) {
//     console.log(data);
//
// })

// GetRoomByID('5dd0b34cfaad660319f30685', function (data) {
//     console.log(data);
//
// })

// CreateMessage('5dd0b34cfaad660319f30685', '5dc994237ca7c207c3b36ba1', 'String', 'Lo CC','', function (data) {
//               console.log(data);
//
// })