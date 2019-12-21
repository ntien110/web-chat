const express = require("express"),
    router = express.Router()
const session = require('express-session');

const user = require('../../models/mongodb/User');

router.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
}));


router.route('/')
    .post(function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        user.Login(username, password, function (err, result) {
            if (err || result == null) {
                res.json({
                    'status': false
                })
            } else {
                var userID = result;
                req.session.userID = userID;
                res.json({
                    'status': true,
                    userID
                })
            }
        })
    })

router.route('/resgister')
    .post(function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var avatar = ' ';
        console.log(username);
        console.log(password);

        user.CheckUsername(username, function (data, err) {
            if (data == false) {
                user.CreateUser(username, name, password, avatar, function (err, result) {
                    if (result == null || err) {
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

router.get('/resgister/:username', (req, res) => {
    var username = req.params.username;
    user.CheckUsername(username, function (err, dataResult) {
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
        var userId = req.body.userId;
        user.GetInfoUser(userId, function (err, data) {
            if (err || data == null) {
                res.json({
                    'status': false
                })
            } else {
                res.json({
                    'status': true,
                    name: data.name,
                    avatar: data.avatar
                })
            }
        })

    })
router.route('/searchFriend')
    .post((req, res) => {
        var name = req.body.name;
        var thisUserId = req.body.userId;
       
        user.FindUserByName(name, function (err1, data) {
            if (err1) {
                res.json({
                    'status': false
                })
            }
            user.GetInfoUser(userId, function (err2, thisUser) {
                if (err2) {
                    res.json({
                        'status': false
                    })
                } else {
                    var friend = [];
                    var notFriend = [];
                    for (var i = 0; i < data.length; i++) {
                        if (thisUser.friend_list.indexOf(data[i]._id) >= 0) {
                            friend.push(data[i]);
                        } else {
                            notFriend.push(data[i]);
                        }
                    }
                    res.json({
                        'status': true,
                        friend,
                        notFriend
                    })
                }
            })
        })
    })

    router.route('/sendRequestAddFriend')
    .post((req, res) => {
        var thisUserId = req.body.thisUserId;
        var userId = req.body.userId;
        Room.addWaitList(thisUserId, userId, function(err, result){
          if(result == true){
              res.json({
                  'status': true
              })
          }else{
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
      User.addFriendList(thisUserId, userId, function(err, result){
          if(result == true){
              var members = [thisUserId, userId];
              Room.create(members, function(err, data){
                  if(err){
                      res.json({
                          'status': false
                      })
                  }else{
                      res.json({
                          'status': true
                      })
                  }
              })
              
          }else{
              res.json({
                  'status': false
              })
          }
      });
    }) 
router.route('/editUser')
    .post((req, res) => {
        var userId = req.body.userId;
        var password = req.body.password;
        var name = req.body.name;
        var avatar = req.body.avatar;
        user.UpdateUser(userId, name, password, avatar, function (result1, result2) {
            if (result1 == null) {
                res.json({
                    'status': false,
                })
            }
            res.json({
                'status': result2
            })
        })

    })
router.post('/checkUser', (req, res) => {
    if (req.session.userID) {
        return res.status(200).json({ status: true })
    }
    return res.status(200).json({ status: false })
})


router.post('/logout', (req, res) => {
    req.session.destroy(function (err) {
        return res.status(200).json({ status: true })
    })
})



module.exports = router;