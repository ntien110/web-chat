const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const roomSchema = mongoose.Schema({
    members: [String],
    isOnline: Boolean,
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


// Trả về _id của Room vừa tạo
var CreateRoom = function (member1, member2, done) {
    let room = new Room({
        members: [member1, member2],
        isOnline: true
    });
    room.save(function (err, doc) {
        if (err) return done(err);
        return done(doc._id);
    });
};

// Trả về mảng gồm các _id của các thành viên trong room
var GetMembersARoom = function (roomID, done) {
    Room.findById(roomID, 'members', function (err, doc) {
        if(err) return done(err);
        else return done(doc.members);

    })
};

// Trả về Room gồm các thuộc tính
// var GetRoomByID =  function (roomID, done) {
//     Room.findById(roomID, 'members isOnline messages', function (err, doc) {
//         if(err) return done(err);
//         else return done(doc);
//
//     })
// };

// Trả về true nế thêm tin nhắn thành công
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
var GetRoomStatus = function(roomID, done){
    Room.findById(roomID, 'isOnline', function (err, doc) {
        if(err) return doc(err);
        else return done(doc.isOnline);

    })
}

module.exports = {
    CreateRoom,
    GetRoomByID,
    CreateMessage,
    GetLastTimeARoom,
    GetMembersARoom,
    SetRoomStatus,
    GetRoomStatus,
    GetMessengerInRoom
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

// GetRoomByID('5df5a1d91ba5cd031bf2831c', function (data) {
//     console.log(data);
//
// })

// CreateMessage('5df5a1d91ba5cd031bf2831c', '5dc994237ca7c207c3b36ba1', 'Sticker', 'Lo CC','', function (data) {
//               console.log(data);
//
// })

// SetRoomStatus('5df5a1d91ba5cd031bf2831c', true)
//
// GetRoomStatus('5df5a1d91ba5cd031bf2831c', function (data) {
//     console.log(data)
//
// })