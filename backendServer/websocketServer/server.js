const mongodb = require("../models/mongodb")
const { User, Picture, Room } = require("../models/mongodb")
let sockets = {}

module.exports = (io) => {
  io.on("connection", (socket) => {
    socket["userId"] = null;
    socket.emit("welcome", "wellcome message")

    socket.on("userId", (userId) => {
      sockets[userId] = socket
      //users.push({ userId, socket });
      socket.userId = userId
      //inform every user's online room about users'online event, change rooms's user's online status 

      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == true, (err, onlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          onlineRooms.forEach(roomId => {
            socket.join(roomId)
            //console.log("server 22: getOnlineRoom found: ", roomId)
            socket.to(roomId).emit("iAmOnline", { "userId": socket.userId, roomId });
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, true, (err, data) => {
              if (err) console.log(err)
              else {
              }
            })
          })
        }
      })

      // change offline rooms's user's online status
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => room.online == false, (err, offlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          //console.log("offlineRooms---36: ",offlineRooms)
          offlineRooms.forEach(roomId => {
            socket.join(roomId)
            //console.log("server 40, getOfflineRoom found: ", offlineRooms)
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, true, (err, data) => {
              if (err) console.log(err)
              else {
                mongodb.Room.countOnlineUser(roomId, (err, count) => {
                  //console.log('server 48, countOnline user of ^: ', count)
                  if (err) {
                    console.log("Error when countOnlineUser: ", err)
                  } else if (count == 2) {
                    //console.log("46---server",count)
                    mongodb.Room.SetRoomStatus(roomId, true, (err, data) => {
                      socket.to(roomId).emit("iAmOnline", { "userId": socket.userId, roomId });
                    })
                  }
                })

              }
            })

          })
        }
      })
    })

    socket.on("send", (msg) => {
      //console.log("received: ",msg)

      // let getMsgBody = new Promise((res, rej) => {
      //   let body
      //   if (msg.Type == "Sticker" || msg.Type == "Picture") {
      //     Picture.Picture.findById(msg.Body).exec((err, pic) => {
      //       //console.log("found pic: ",err, pic, msg.Body)
      //       if (err) {
      //         console.log("Error when get find Pic by id at ws send: ", err)
      //         body = "Error-bug-fixit"
      //         res(body)
      //       } else {
      //         body = pic.body
      //         res(body)
      //       }
      //     })
      //   } else{ 
      //     body = msg.Body
      //     res(body)
      //   }
      // })
      // getMsgBody.then((body) => {
      //   //console.log("Server 81: ", body)
      //   mongodb.Room.CreateMessage(
      //     msg.roomId,
      //     msg.From,
      //     msg.Type,
      //     msg.Body,
      //     msg.time,
      //     (err, savedMsg) => {
      //       if (err) console.log(err)
      //       else {
      //         savedMsg.Body=body
      //         io.to(msg.roomId).emit("message", {
      //           savedMsg
      //         })
      //         //console.log(msg)
      //       }
      //     })
      // })
      mongodb.Room.CreateMessage(
        msg.roomId,
        msg.From,
        msg.Type,
        msg.Body,
        msg.time,
        (err, savedMsg) => {
          if (err) console.log(err)
          else {
            let newMsg={
              "roomId": msg.roomId,
              "messageId": savedMsg._id,
              "From": msg.From,
              "Type": msg.Type,
              "Body": msg.Body,
              "time": msg.time,
              "seen": savedMsg.seen
            }
            io.to(msg.roomId).emit("message", newMsg)
            //console.log(newMsg)
          }
        })
    })

    socket.on("friendRequest", ({ from, to }) => {
      //console.log("friendRequest: ", from, to)

      if (sockets.hasOwnProperty(to)) {
        User.User.findById(from).exec((err, user) => {
          if (err) console.log("Error when User.findById at socket.on friendRequest: ", err)
          else if (user == null) {
            //khong tim thay ban
          }
          else {
            io.to(sockets[to].id).emit("newFriendRequest", {
              'userId': from,
              'name': user.name,
              'avatar': user.avatar
            })
          }
        })

      }
      User.addToWaitList(to, from, (err, data) => {
        if (err) console.log("Error when addToWaitList at socket.on friendRequest: ", err)
      })
    })

    socket.on("acceptFriendRequest", ({ userId, acceptedFriendId }) => {
      //console.log("94---socket server:", userId, acceptedFriendId)
      User.addFriend(userId, acceptedFriendId, (err, data) => {
        if (err) console.log("Error when addFriend at socket.on exceptFriendRequest: ", err)
      })
      User.addFriend(acceptedFriendId, userId, (err, data) => {
        if (err) console.log("Error when addFriend at socket.on exceptFriendRequest: ", err)
      })
      Room.create([userId, acceptedFriendId], (err, room) => {
        if (err) console.log("Error when creat Room at socket.on exceptFriendRequest: ", err)
        else {
          User.addRoom(userId, room._id, (err1, room) => {
            if (err) console.log("Error when addRoom at socket.on exceptFriendRequest: ", err1)
          })
          User.addRoom(acceptedFriendId, room._id, (err2, room) => {
            if (err) console.log("Error when addRoom at socket.on exceptFriendRequest: ", err2)
          })
          socket.join(room._id)
          if (sockets.hasOwnProperty(acceptedFriendId)) {
            sockets[acceptedFriendId].join(room._id)
          }
          io.to(room._id).emit("newRoom", {
            'roomId': room._id,
            'name': room.name,
            'members': room.members,
            'lastMessage': []
          })
          Room.CreateMessage(room._id, userId, "Text", "We are now friends", new Date(), (err1, message) => {
            if (err1) console.log("Error when creatMessage at socket.on exceptFriendRequest: ", err)
            else {
              io.to(room._id).emit("newRoom", {})
              io.to(room._id).emit("message", {
                'from': message.From,
                'type': message.Type,
                'Body': message.Body,
                'time': message.time,
                'seen': []
              })
            }
          })
        }
      })
    })

    socket.on("seen", ({ userId, roomId, messageId }) => {
      //console.log(`seen from ${userId} at room ${roomId}`)
      mongodb.Room.markAsSeen(roomId, messageId, userId, (err, data) => {
        if (err) console.log("Error when markAsSeen: ", err)
        else {
          //console.log(`seened ${userId} at room ${roomId}`)
          socket.to(roomId).emit("seen", { userId, messageId, roomId })
        }
      })
    })


    socket.on("disconnect", function () {
      //auto left all joined rooms
      //set all room in DB to offline and return all room id
      delete sockets[socket.userId]
      mongodb.Room.getRoomsByUserIdAndStatus(socket.userId, (room) => true, (err, onlineRooms) => {
        if (err) { console.log("getRoomsByUserIdAndStatus's error: ", err) }
        else {
          //console.log("Server 167: getAllRoom found: ", onlineRooms)
          onlineRooms.forEach(roomId => {
            //change in online status in DB
            mongodb.Room.changeMemberOnlineStatus(roomId, socket.userId, false, (err, data) => {
              if (err) console.log(err)
              else {
                //console.log("173", data)
                //nothing yet
                //console.log(`     changed ${socket.userId} to offline`)
              }
            })
            //inform left room event
            mongodb.Room.countOnlineUser(roomId, (err, count) => {
              //console.log("server 180, count onlineUser found: ", count)
              if (count > 1) {
                io.in(roomId).emit("iAmOffline", {
                  roomId,
                  "userId": socket.userId
                })
              } else {
                //console.log("server 187,  less or equal 1 online user in roomId: ", roomId)
                //dòng lẹnh sau chỉ hoạt động với room 2 người
                mongodb.Room.SetRoomStatus(roomId, false, (err, data) => {
                })
              }
            })

          })
        }
      })
      //console.log(socket.userId + " disconnected")
    })

  })
}