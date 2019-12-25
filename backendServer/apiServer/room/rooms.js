const express = require('express'),
router = express.Router();

const Room = require('../../models/mongodb/Room');

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
        var time = req.body.time;
        var limit = req.body.limit;
        // var roomId = '5dfa00d14a06793b0a76a342';
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
    // roomID, From, Type, Body, time, done
    // router.route('/addMessage')
    //       .post((req, res) =>{
    //         var Body = 'this is the first message';
    //         var time = new Date();
    //         var From = '5dfa00d14a06793b0a76a344';
    //         var Type = 'text';
    //         var roomId =  '5dfa00d14a06793b0a76a342';
    //         Room.CreateMessage(roomId, From, Type, Body, time, function(err, data){
    //             if(err|| null){
    //                 res.json({
    //                     'status': false
    //                 })
    //             }else{
    //                 res.json({
    //                     'status': true
    //                 })
    //             }
    //         })
    //       })

module.exports = router;