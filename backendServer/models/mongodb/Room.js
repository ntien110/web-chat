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

<<<<<<< HEAD
const findByUserId = function(userId, callback){
=======
const findByUserId=function(userId, callback){
>>>>>>> 0e18b3d2367c8d56141eee2c772e3e190a25b21e
    id=ObjectId(userId);
    Room.find({members: {$elemMatch: {userId: id}}}).exec(callback)
}

<<<<<<< HEAD
// create(["5df8a8176377113751905e66","5dc994237ca7c207c3b36ba1"],(err, data)=>{console.log(data)}, "test room")
=======
//create(["5df8a8176377113751905e66","5dc994237ca7c207c3b36ba1"],(err, data)=>{console.log(data)}, "test room")
>>>>>>> 0e18b3d2367c8d56141eee2c772e3e190a25b21e
// findByUserId("313131313131313131313132",(err, data)=>{
//     console.log(err, data)
// })
module.exports = {
<<<<<<< HEAD
    findByUserId,
    create,
    Room
};
=======
    Room,
    findByUserId,
    create
};
>>>>>>> 0e18b3d2367c8d56141eee2c772e3e190a25b21e
