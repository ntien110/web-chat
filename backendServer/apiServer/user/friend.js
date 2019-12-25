const express = require("express"),
    router = express.Router()
const session = require('express-session');

const user = require('../../models/mongodb/User');
const Room = require('../../models/mongodb/Room');
const Picture = require('../../models/mongodb/Picture');

//err truoc
router.route('/listFriend')
    .post((req, res) => {
        var name = req.body.name;
        var thisUserId = req.body.userId;
        // var thisUserId = '5dfa00d14a06793b0a76a344'
        user.FindUserByName('', function (err1, data) {
            if (err1 || data == null) {
                res.json({
                    'status': false
                })
            }
            var listUser = data;
            // console.log(data);
            Picture.GetAllAvatar(function (err2, pictures) {
                try {
                    if(err2) throw err2;
                } catch (error) {
                    console.log('không lấy được tất cả picture');
                }finally{
                    user.GetInfoUser(thisUserId, function (err3, thisUser) {
                        // console.log(thisUser)
                        if (err3 || thisUser == null) {
                            res.json({
                                'status': false
                            })
                        } else {
                            var friendList = [];
                            var waitList = [];
                            var i = 0;
                            while (i < data.length) {
                                if (user.id == thisUserId) {
                                    i++;
                                }
                                var users = {
                                    id: listUser[i]._id,
                                    name: listUser[i].name,
                                    avatar: ''
                                };
                                var index = pictures.indexOf(listUser[i]._id);
                                if (index >= 0) {
                                    users.avatar = pictures[i];
                                }
                                if (thisUser.friend_list.indexOf(data[i]._id) >= 0) {
                                    friendlist.push(data[i]);
    
                                } if (thisUser.wait_list.indexOf(data[i]._id) >= 0) {
                                    waitList.push(data[i]);
                                }
                                i++;
                            }
                            res.json({
                                'status': true,
                                friendList,
                                wait_list
                            })
                            
                        }
                    })
                } 
            })
        })
    })
router.route('/searchUser')
    .post((req, res) => {
        var name = req.body.name;
        var thisUserId = req.body.userId;
        // var name = '';
        // var thisUserId = '5dcc0e22dee9df188728edb2';
        user.FindUserByName(name, function (err1, data) {
            if (err1 || data == null) {
                res.json({
                    'status': false
                })
            }
            var listUser = data;
            // console.log(data);
            Picture.GetAllAvatar(function (err, pictures) {
                try {
                    if (err) throw err;
                } catch (error) {
                    console.log("không thể lấy hết picture");
                }finally{
                    user.GetInfoUser(thisUserId, function (err2, thisUser) {
                        // console.log(thisUser)
                        if (err2 || thisUser == null) {
                            res.json({
                                'status': false
                            })
                        } else {
                            var friend = [];
                            var notFriend = [];
                            var i = 0;
                            console.log(pictures);
                            while (i < data.length) {
                                if (user.id == thisUserId) {
                                    i++;
                                }
                                var users = {
                                    id: listUser[i]._id,
                                    name: listUser[i].name,
                                    avatar: ''
                                };
                                var index = pictures.indexOf(listUser[i]._id);
                                if (index >= 0) {
                                    users.avatar = pictures[i];
                                }
                                if (thisUser.friend_list.indexOf(user.id) >= 0) {
                                    friend.push(users);
    
                                } if(thisUser.wait_list.indexOf(users.id) >= 0){
                                    users.request = true;
                                    notFriend.push(users);
                                } else {
                                    users.request = false;
                                    notFriend.push(users);
                                }
                                i++;
                            }
                            // console.log(notFriend);
                            res.json({
                                'status': true,
                                friend,
                                notFriend
                            })
                        }
                    })
                }
                
                
                
            })
        })
    })

router.route('/sendRequestAddFriend')
    .post((req, res) => {
        var thisUserId = req.body.thisUserId;
        var userId = req.body.userId;
        Room.addWaitList(thisUserId, userId, function (err, result) {
            if (result == true) {
                res.json({
                    'status': true
                })
            } else {
                res.json({
                    'status': false
                })
            }
        });
    })
router.route('/acceptRequestAddFriend')
    .post((req, res) => {
        var thisUserId = req.body.thisUserId;
        var userId = req.body.userId;
        User.addFriendList(thisUserId, userId, function (err, result) { 
            if (result == true) {
                User.RemoveUserInWaitList(thisUserId, userId, function(err1, check){
                    try {
                        if(err1 || !check){
                            throw err1; 
                        }         
                    } catch (e){
                        console.log('ko xoa duoc trong wait list');
                    }    
                })
                var members = [thisUserId, userId];
                Room.create(members, function (err2, data) {
                    if (err2) {
                        res.json({
                            'status': false
                        })
                    } else {
                        res.json({
                            'status': true
                        })
                    }
                })

            } else {
                res.json({
                    'status': false
                })
            }
        });
    })

module.exports = router;