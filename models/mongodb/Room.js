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
            default: ''
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
        if (err) console.log(err);
        return done(err, doc._id);
    });
};

// Trả về mảng gồm các _id của các thành viên trong room
var GetMembersARoom = function (roomID, done) {
    Room.findById(roomID, 'members', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.members);

    })
};

// Trả về Room gồm các thuộc tính
var GetRoomByID =  function (roomID, done) {
    Room.findById(roomID, 'members isOnline messages', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc);

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
    GetRoomByID(roomID, function (err1, data) {
        if(err1){
            console.log(err1);
            return done(err1, null);
        }
        data.messages.push(message);
        data.save(function (err, doc) {
            if(err) console.log(err);
            return done(err, doc.messages[doc.messages.length -1]);

        })

    })
};
 // Chi viec post message, ham se tu kiem tra su ton tai cua room, neu chua co se them
var GetLastTimeARoom = function(roomID, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.messages[doc.messages.length-1].time);

    })
}

// Trả về mảng gồm 'number' tin nhắn trong room. ví dụ cần lấy 5 tin nhắn thì number = 5.
let amountMessInRoom = 0;
var GetMessengerInRoom = function(roomID, number, done){
    Room.findById(roomID, 'messages', function (err, doc) {
        if(err) console.log(err);
        amountMessInRoom = doc.messages.length;
        console.log((amountMessInRoom));
        if(amountMessInRoom > number){
             for(let i = 0; i < amountMessInRoom - number; i++){
                    doc.messages.shift();
             }
        }
        return done(err, doc.messages);

    })
    //skip(amountMessInRoom <= number ? 0 : amountMessInRoom - number);
}

var SetRoomStatus = function(roomID, status, done){
    Room.updateOne({_id: roomID}, {
         
            'isOnline': status
    }, function () {
         console.log(('Update complete'));
         return done(null, true);
    })
}

// Trả về trạng thái online của room, true or false 
var GetRoomStatus = function(roomID, done){
    Room.findById(roomID, 'isOnline', function (err, doc) {
        if(err) console.log(err);
        return done(err, doc.isOnline);

    })
}

const FindRoomByUser = function (userID, done) {
    Room.find({members: {$elemMatch: userID}}, function (err, doc) {
        if (err) console.log(err);
        return done(err, doc);
    });
};

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


// GetMessengerInRoom('5dfa00d14a06793b0a76a342', 1, function (err, data) {
//     console.log(data);
// })

// CreateRoom('5dc994237ca7c207c3b36ba1', '5dc994237ca7c207c3b36ba1', function (data) {
//     console.log(data);
//     //RoomID: 5dd0b34cfaad660319f30685
// })

// GetMembersARoom('5dd0b34cfaad660319f30685', function (data) {
//     console.log(data);
//
// })

// GetRoomByID('5dfa00d14a06793b0a76a342', function (err, data) {
//     console.log(data);
//
// })

// FindRoomByUser('5dfa00d14a06793b0a76a343', function (err, data) {
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