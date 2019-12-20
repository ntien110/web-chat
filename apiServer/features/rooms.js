const express = require('express'),
router = express.Router();

const Room = require('../../backendServer/models/mongodb/Room');

router.route('/rooms')
    .post((req, res) => {
        var userId = req.body.userId;
        Room.findByUserId(userId, function (err, data) {
            
            if (err) {
                console.log(err)
                res.json({
                    "status": false
                })
                return
            } else {
                console.log(data)
                res.json({
                    "status": true,
                    "rooms": data.map((room) => {return{
                        "roomId": room._id,
                        "name": room.name, 
                        //"members": room.members.map((member) => (member.userId)),
                        "lastMessage": room.messages.length>0?room.messages.reduce((nearestMessage, cur)=>cur.time>nearestMessage.time?cur:nearestMessage):null
                    }})
                })
            }
        })

    })

router.route('/getMessage')
    .post((req, res) => {
        var roomId = req.body.roomId;
        room.GetMessengerInRoom(roomId, 10, function(err, message){
            if(err){
                res.json({
                    'status': false
                })
            }else{
                res.json({
                    'status': true,
                    message
                })
            }
        }) 
    })      

module.exports = {
    router
}      