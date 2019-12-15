const express=require("express"),
     router = express.Router()

const user = require('../../../models/mongodb/User');
router.use(express.static(__dirname+ "/frontend"))

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


module.exports=router