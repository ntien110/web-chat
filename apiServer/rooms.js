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
        // var roomId = req.body.roomId;
        var time = req.body.time;
        var limit = req.body.limit;
        var roomId = req.body.roomId;
        Room.GetMessengerInRoom(roomId, function(err, messages){
            if(err || messages == null){
                res.json({
                    'status': false
                })
            }else{
                function compare(a, b) {
                    const messageA = a.time;
                    const messageB = b.time;
                    
                    let comparison = 0;
                    if (messageA > messageB) {
                      comparison = 1;
                    } else if (messageA < messageB) {
                      comparison = -1;
                    }
                    return comparison;
                   }
                    
                   messages.sort(compare);
                   if(messages.length <= 10){
                    res.json({
                        'status': true,
                        messages
                    })
                   }else{
                       var data = [];
                       var length = messages.length -1;
                       while(limit > 0){
                           if(messages[length].time <= time){
                               data.push(messages[length]);
                               limit--;
                           }
                           length--;
                       }
                       res.json({
                        'status': true,
                        'messages': data
                    })
                   }  
            }
        })
    })  

module.exports = router;
    