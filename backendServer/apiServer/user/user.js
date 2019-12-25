const express = require("express"),
    router = express.Router()

const user = require('../../models/mongodb/User');
const Picture = require('../../models/mongodb/Picture');

router.route('/')
    .post(function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        user.Login(username, password, function (err, result) {
            if (err || result == false) {
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

router.route('/register')
    .post(function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var name = req.body.name;
        var avatar = ' ';
        console.log(username);
        console.log(password);

        user.CheckUsername(username, function (err, data) {
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

router.get('/register/:username', (req, res) => {
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

router.route('/getUser')
    .post((req, res) => {
        var userId = req.body.userId;
        user.GetInfoUser(userId, function (err, data) {
            if (err || data == null) {
                res.json({
                    'status': false
                })
            }
            else{
            var avatar = data.avatar;
            Picture.GetPictureByID(avatar, function(err1, picture){
                if(err|| picture == null){
                    res.json({
                        'status': true,
                        name: data.name,
                        avatar: ''
                    })
                }else{
                    res.json({
                        'status': true,
                        name: data.name,
                        avatar: picture
                    })
                }
                    
            })    
            }
            
        })

    })

    router.route('/editUser')
    .post((req, res) => {
        var userId = req.body.userId;
        var password = req.body.password;
        var name = req.body.name;
        var avatar = req.body.avatar;
        Picture.insert('Picture',avatar, function(err, pictureId){
                if (err) {
                    res.json({
                        'status': false
                    })
                }else{
                    user.UpdateUser(userId, name, password, pictureId, function (result1, result2) {
                        if (result1 == null) {
                            res.json({
                                'status': false
                            })
                        }
                        res.json({
                            'status': result2
                        })
                    })
                }
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