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
            Picture.GetAllSticker( function(err, data){
                if(err){
                    res.json({
                        'status': false
                    })
                    
                }else{
                    let list = data.map((current, index, data) => {
                        return ({
                            id: current._id,
                            body: current.body,
                            group: current.group
                        })
                    })
                    // console.log(list);
                    var stickers = {};
                    var result = Object.values(list.reduce(function(r, e) {
                      var key = e.group;
                      if (!r[key]){
                        r[key] = e; 
                        var sticker = ({
                        }) 
                        stickers[e.group] = [e];
                      }else{
                        stickers[e.group].push(e);
                      }  
                      
                      return r;
                    }, {}))
                    
                    res.json({
                        'status' : true,
                        stickers
                })
            }
        })
    })

module.exports = router;      