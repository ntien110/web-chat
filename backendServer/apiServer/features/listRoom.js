const express = require('express'),
router = express.Router();

const Room = require('../../models/mongodb/Room');

router.route('/listroom')
      .post((req, res) =>{
          var userId = req.body.userId;
          Room.findByUserId(userId, function(data){
              if(data == false || data == null){
                  res.json({
                      'status' : 'failed'
                  })
              } 
              else{
                  var message = data.message[message.length -1];
                  const result = new Room({
                      name : data.name,
                      member : data.member,
                      message : message
                  })
                  res.json({
                      'status' : 'susscess'
                      result
                  })
              }
          })
          
          })
      })

module.exports = {
    router
}      