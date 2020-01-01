const express = require("express"),
    router = express.Router()
//const session = require('express-session');

const User = require('../models/mongodb/User');
const Room = require('../models/mongodb/Room');
const Picture = require('../models/mongodb/Picture');

// router.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'somesecret',
//     cookie: { maxAge: 60000 }
// }));


router.route('/')
    .post(function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        //console.log(username, password)
        User.Login(username, password, function (err, result) {
            if (err || result == false) {
                res.json({
                    'status': false
                })
            } else {
                //req.session.userId = result;
                res.json({
                    'status': true,
                    'userId': result
                })
            }
        })
    })

router.route('/register')
    .post(function (req, res) {
        let username = req.body.username;
        let password = req.body.password;
        let name = req.body.name;
        let avatar = '';
        console.log(username);
        console.log(password);

        User.CheckUsername(username, function (err, data) {
            if (data == false) {
                User.CreateUser(username, name, password, avatar, function (err1, result) {
                    console.log("49---user.js: ", err1, data)
                    if (result == null || err1) {
                        res.json({
                            'status': false
                        })
                    }
                    else {
                        res.json({
                            'status': true,
                            'userId': result //chỉ có id
                        })
                    }
                })
            }
            else {
                res.json({
                    'status': false
                })
            }
        })
    })

router.get('/register/:username', (req, res) => {
    let username = req.params.username;
    //console.log("73: ",username)
    User.CheckUsername(username, function (err, dataResult) {
        //console.log("75", err, dataResult)
        if (dataResult == false) {
            res.json({
                'status': false
            })
        } else {
            res.json({
                'status': true
            })
        }
    })
})

//err truoc
router.route('/getUser')
    .post((req, res) => {
        let userId = req.body.userId;
        User.GetInfoUser(userId, function (err, data) {
            if (err || data == null) {
                res.json({
                    'status': false
                })
            }
            else {
                let avatar = data.avatar;
                Picture.GetPictureByID(avatar, function (err1, picture) {
                    if (err || picture == null) {
                        res.json({
                            'status': true,
                            name: data.name,
                            avatar: ''
                        })
                    } else {
                        res.json({
                            'status': true,
                            name: data.name,
                            avatar: picture.body
                        })
                    }

                })
            }

        })

    })
router.route('/listFriend')
    .post((req, res) => {
        // let name = req.body.name;
        let thisUserId = req.body.userId;
        // let thisUserId = '5dfa00d14a06793b0a76a344'
        User.User.find({}, function (err1, data) {
            if (err1 || data == null) {
                res.json({
                    'status': false
                })
            }
            let listUser = data;
            // console.log(data);
            Picture.GetAllAvatar(function (err2, pictures) {
                try {
                    if (err2) throw err2;
                } catch (error) {
                    console.log('không lấy được tất cả picture');
                } finally {
                    User.GetInfoUser(thisUserId, function (err3, thisUser) {
                        // console.log(thisUser)
                        if (err3 || thisUser == null) {
                            res.json({
                                'status': false
                            })
                        } else {
                            let friendList = [];
                            let i = 0;
                            while (i < data.length) {
                                if (listUser[i].id == thisUserId) {
                                    i++
                                    continue
                                }
                                let users = {
                                    id: listUser[i]._id,
                                    name: listUser[i].name,
                                    avatar: ''
                                };
                                //console.log("h:------------ ",pictures[i].body)
                                let index = pictures.findIndex((pic)=>listUser[i].avatar==pic._id);
                                if (index >= 0) {
                                    users.avatar = pictures[index].body;
                                }
                                //console.log(thisUser, data[i])
                                if (thisUser.friend_list.indexOf(data[i]._id) >= 0) {
                                    friendList.push(users);

                                }
                                i++;
                            }
                            res.json({
                                'status': true,
                                'friendList': friendList.map((friend) => ({
                                    'userId': friend.id,
                                    'name': friend.name,
                                    'avatar': friend.avatar
                                }))
                            })

                        }
                    })
                }
            })
        })
    })
router.route('/listWait')
    .post((req, res) => {
        // let name = req.body.name;
        let thisUserId = req.body.userId;
        // let thisUserId = '5dfa00d14a06793b0a76a344'
        User.User.find({}, function (err1, data) {
            if (err1 || data == null) {
                res.json({
                    'status': false
                })
            }
            let listUser = data;
            // console.log(data);
            Picture.GetAllAvatar(function (err2, pictures) {
                try {
                    if (err2) throw err2;
                } catch (error) {
                    console.log('không lấy được tất cả picture');
                } finally {
                    User.GetInfoUser(thisUserId, function (err3, thisUser) {
                        // console.log(thisUser)
                        if (err3 || thisUser == null) {
                            res.json({
                                'status': false
                            })
                        } else {
                            let waitList = [];
                            let i = 0;
                            while (i < data.length) {
                                if (listUser[i]._id == thisUserId) {
                                    i++;
                                    continue
                                }
                                let users = {
                                    id: listUser[i]._id,
                                    name: listUser[i].name,
                                    avatar: ''
                                };
                                let index = pictures.findIndex((pic)=>listUser[i].avatar==pic._id);
                                if (index >= 0) {
                                    users.avatar = pictures[index].body;
                                }
                                if (thisUser.wait_list.indexOf(data[i]._id) >= 0) {
                                    waitList.push(users);
                                }
                                i++;
                            }
                            res.json({
                                'status': true,
                                'waitList': waitList.map((friend) => ({
                                    'userId': friend.id,
                                    'name': friend.name,
                                    'avatar': friend.avatar
                                }))
                            })

                        }
                    })
                }
            })
        })
    })
router.route('/isFriends')
    .post((req, res) => {
        let userId_1 = req.body.userId_1;
        let userId_2 = req.body.userId_2;
        User.User.find({ '_id': userId_1 }, "friend_list").exec((err, friendList) => {
            if (err) {
                console.log("Error when  find user in /isFriend: ", err)
                res.json({
                    'status': 'Error'
                })
            } else {
                //console.log(friendList)
                res.json({
                    'status': friendList
                })
            }
        })
    })
router.route('/searchUser')
    .post((req, res) => {
        let name = req.body.name;
        let thisUserId = req.body.userId;
        //console.log("name: ", name, "userIs: ", thisUserId)
        // let name = '';
        // let thisUserId = '5dcc0e22dee9df188728edb2';
        User.FindUserByName(name, function (err1, data) {
            if (err1 || data == null) {
                res.json({
                    'status': false
                })
            }
            let listUser = data;
            // console.log(data);
            Picture.GetAllAvatar(function (err, pictures) {
                try {
                    if (err) throw err;
                } catch (error) {
                    console.log("không thể lấy hết picture");
                } finally {
                    User.GetInfoUser(thisUserId, function (err2, thisUser) {
                        // console.log(thisUser)
                        if (err2 || thisUser == null) {
                            res.json({
                                'status': false
                            })
                        } else {
                            let friend = [];
                            let notFriend = [];
                            let i = 0;
                            //console.log(pictures);
                            while (i < data.length) {
                                //console.log(data[i]._id == thisUserId)
                                if (data[i]._id == thisUserId) {
                                    i++
                                    continue
                                }
                                let users = {
                                    'id': listUser[i]._id,
                                    'name': listUser[i].name,
                                    'avatar': 'some default pic',
                                    'request': false
                                };
                                let index = pictures.findIndex((pic)=>listUser[i].avatar==pic._id);
                                if (index >= 0) {
                                    users.avatar = pictures[index].body;
                                }
                                //console.log(thisUser.friend_list.indexOf(User.id) >= 0,thisUser.wait_list.indexOf(users.id) >= 0)
                                if (thisUser.friend_list.indexOf(users.id) >= 0) {
                                    friend.push(users);

                                } else if (thisUser.wait_list.indexOf(users.id) >= 0) {
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
        let thisUserId = req.body.thisUserId;
        let userId = req.body.userId;
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
        let thisUserId = req.body.thisUserId;
        let userId = req.body.userId;
        User.addFriendList(thisUserId, userId, function (err, result) {
            if (result == true) {
                User.RemoveUserInWaitList(thisUserId, userId, function (err1, check) {
                    try {
                        if (err1 || !check) {
                            throw err1;
                        }
                    } catch (err1) {
                        console.log('ko xoa duoc trong wait list');
                    }
                })
                let members = [thisUserId, userId];
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
router.route('/editUser')
    .post((req, res) => {
        let userId = req.body.userId;
        let password = null//req.body.password;
        let name = req.body.name;
        let avatar = req.body.avatar;
        Picture.insert('Avatar', avatar, null, function (err, pictureId) {
            if (err) {
                res.json({
                    'status': false
                })
            } else {
                User.UpdateUser(userId, name, password, pictureId, function (result1, result2) {
                    if (result1 != null) {
                        res.json({
                            'status': false
                        })
                    } else {
                        res.json({
                            'status': result2
                        })
                    }
                })
            }
        })
    })
// router.post('/checkUser', (req, res) => {
//     if (req.session.userID) {
//         return res.status(200).json({ status: true })
//     }
//     return res.status(200).json({ status: false })
// })


// router.post('/logout', (req, res) => {
//     req.session.destroy(function (err) {
//         return res.status(200).json({ status: true })
//     })
// })



module.exports = router;