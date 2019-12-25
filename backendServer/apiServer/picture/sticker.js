const express = require("express"),
    router = express.Router();
const Picture = require('../../models/mongodb/Picture');

router.route('/getStickers')
      .post((req, res) => {
          var stickerName = req.body.stickerName;
          Picture.GetStickerByName(stickerName, function(err, doc){
              if(err){
                  res.json({
                    'status': false
                  })
                  
              }else{
                  res.json({
                      'status' : true,
                      doc
              })
         }
    })
})    
router.route('/getOneSticker')
      .post((req, res) => {
          var stickerId = req.body.stickerId;
          var id = '5df5af35fa7e5b041adb40be'
          Picture.GetStickerById(id, function(err, doc){
              if(err){
                  res.json({
                    'status': false
                  })
                  
              }else{
                  res.json({
                      'status' : true,
                      doc
              })
         }
    })
})    
router.route('/getAllStickers')
      .post((req, res) => {
          Picture.GetAllSticker( function(err, doc){
              if(err){
                  res.json({
                    'status': false
                  })
                  
              }else{
                  res.json({
                      'status' : true,
                      doc
              })
         }
    })
})

module.exports = router;      