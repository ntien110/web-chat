const express = require('express'),
    router = express.Router();

const { User, Room, Picture } = require('../models/mongodb')
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
                //console.log(data)
                //change room name to user's name
                for (let i in data) {
                    for (let j in data[i].members) {
                        if (data[i].members[j].userId != userId) {
                            //console.log("1: ",data[i].members[j].userId)
                            User.GetInfoUser(data[i].members[j].userId, (err, user) => {
                                //console.log("err1: ",err, user)
                                //console.log(user.avatar,i)
                                Picture.GetPictureByID(user.avatar, (err2, pic) => {
                                    data[i]["name"] = user.name
                                    data[i].avatar = pic==null?"default pic":pic.body
                                    //console.log(data[i].avatar[data[i].avatar.length-1],err2, pic._id,i)
                                    
                                    if (i == data.length - 1) {
                                        //console.log(data)
                                        res.json({
                                            "status": true,
                                            "rooms": data.map((room) => {
                                                return {
                                                    "avatar": room.avatar,
                                                    "roomId": room._id,
                                                    "name": room.name,
                                                    "members": room.members,
                                                    "lastMessage": room.messages.length > 0 ? room.messages.reduce((nearestMessage, cur) => cur.time > nearestMessage.time ? cur : nearestMessage) : null,
                                                    "online": room.online,
                                                    "messageCount": room.messages.length
                                                }
                                            })
                                        })
                                    }



                                })
                            })
                            break;
                        }
                    }


                


                }

            }
        })
    })

router.route('/getMessage')
    .post((req, res) => {
        // var roomId = req.body.roomId;
        var time = new Date(req.body.time);
        var limit = req.body.limit;
        var roomId = req.body.roomId;
        //console.log(time, limit, roomId)
        Room.GetMessengerInRoom(roomId, function (err, messages) {
            if (err || messages == null) {
                res.json({
                    'status': false
                })
            } else {
                // console.log(messages)
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
                if (messages.length <= limit) {
                    res.json({
                        'status': true,
                        messages
                    })
                } else {
                    var data = [];
                    var length = messages.length - 1;
                    while (limit > 0) {
                        //console.log(messages.length, length,limit, typeof messages[length].time,typeof time)
                        if (messages[length].time <= time) {
                            data.push(messages[length]);
                            limit--;
                        }
                        length--;
                    }
                    //console.log("109 ",data)
                    res.json({
                        'status': true,
                        'messages': data.reverse()
                    })
                }
            }
        })
    })

module.exports = router;