const express = require("express"),
    router = express.Router()


const User = require('../../../models/mongodb/User');

router.route('/')
    .post(function (req, res) {
        var usernameLogin = req.body.username;
        var passwordLogin = req.body.password;
        User.Login(usernameLogin, passwordLogin, function (result) {
            if (result == false || result == null) {
                res.json({
                    'isValid': false
                })
            } else {
                res.json({
                    'isValid': true,
                    user: result
                })
            }
        })
    })
router.get('/register/:username', (req, res) => {
    var username = req.params.username;
    User.CheckUsername(username, function (dataResult) {
        if (dataResult == false) {
            res.json({
                'isValid': true
            })
        } else {
            res.json({
                'isValid': false
            })
        }
    })
})

router.post("/register",function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var avatar = req.body.avatar;
        console.log(username);
        console.log(password);
        var userRegister = new User.User({
            username: username,
            name: name,
            password: password,
            avatar: avatar,
            friend_list: " ",
            wait_list: ""
        });

        User.CheckUsername(username, function (data) {
            if (data == false) {
                User.CreateUser(userRegister, function (result) {
                    if (result == null) {
                        res.json({
                            'success': false
                        })
                    } else {
                        res.json({
                            'success': true,
                            result //chỉ có id
                        })
                    }
                })
            } else {
                res.json({
                    'success': false
                })
            }
        })
    })


module.exports = router