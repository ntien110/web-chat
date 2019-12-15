const express=require("express"),
     router = express.Router()
const session = require('express-session');

const user = require('../../../models/mongodb/User');
router.use(express.static(__dirname+ "/frontend"))

router.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret', 
    cookie: { maxAge: 60000 }}));

router.route('/')
    .post(function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        user.Login(username, password, function(result){
            if(result == false || result == null){
                res.json({
                    'isValid' : false 
                })
            }else{
                var userID = result;
                req.session.userID = userID; 
                res.json({
                    'isValid' : true,
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
          console.log(username);
          console.log(password);
          var userRegister = new user({
              username : username,
              name: name,
              password: password,
              avatar: " ",
              friend_list : " " ,
              wait_list: ""
          });

    user.CheckUsername(username, function(data){
              if(data == false){
                  user.CreateUser(userRegister, function(result){
                      if(result == null){
                          res.json({
                            'success':  false
                          })
                        }
                        else{
                            res.json({
                                'success': true,
                                result //chỉ có id
                            })
                        }  
                   })
                }
                else{
                    res.json({
                        'success' :  false
                    })
                }
          })      
    })

    router.get('/resgister/:username', (req, res) =>{
        var username = req.params.username;
        user.CheckUsername(username, function(dataResult){
            if(dataResult == false){
                res.json({
                    'isValid' : false
                })
            }else{
                res.json({
                    'isValid' : true
                })
            }
        })
    })

    router.post('/getUser', (req, res) => {
        if(req.session.userID){
            return res.status(200).json({status: 'success'})
        }
        return res.status(200).json({status: 'error'})
    })

    router.post('/logout', (req, res) => {
        req.session.destroy(function(err) {
            return res.status(200).json({status: 'success'})
        })
    })

module.exports=router