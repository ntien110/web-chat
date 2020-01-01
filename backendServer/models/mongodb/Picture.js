const Mongodb = require("./Mongodb");
const mongoose = Mongodb.mongoose;
//const genPicId = require("../../common").genPicId;
var PictureSchema = new mongoose.Schema({
    //_id: String,
    Type: String,
    group: String,
    body: String

});
let Picture = mongoose.model('Picture', PictureSchema);

// var insert = (picType, ownerId, body, done) => {
//     /*
//     insert into DB
//     done is a callback function
//      */
//     //if id is not specified, generate one
//     if (id == null) {
//         id = genPicId(ownerId)
//     }
//     //check whether the id is existed or not
//     Picture.findOne({'_id': id}).exec((err, data) => {
//         if (err) {
//             console.log(err)
//         } else {
//             //if it is existed, generate a new one and do it all again
//             if (data) {
//                 id = genPicId(ownerId)
//                 insert(picType, ownerId, body, id, done)
//             }
//             //if it isn't existed, save the picture in to db and log to console
//             else {
//                 let picture = new Picture()
//                 picture._id = id
//                 picture.Type = picType
//                 picture.body = body
//                 picture.save((error, data) => {
//                     if (error) {
//                         console.log(error)
//                     } else {
//                         console.log("insert successed, _id: " + data._id);
//                         return done(data._id);
//
//                     }
//                 })
//             }
//         }
//     })
// }
  // Trả về _id của picture vừa insert 
var insert = function (Type, body, Group, done) {
    let picture = new Picture({
        Type: Type,
        body: body,
        group: Group,
    })
    picture.save(function (err, doc) {
        if(err) console.log(err);
        return done(err, doc._id);

    })
}
// Trả về đối tượng picture có các thuộc tính _id, Type, body, group 
var GetPictureByID = function(pictureID, done){
    Picture.findById(pictureID, function (err, doc) {
        //if(err) console.log(err);
        return done(err, doc);

    })
}

// Trả về mảng picture có các thuộc tính _id, Type, body, group
var GetStickerByName = function(stickerName, done){
    Picture.find({'Type': 'Sticker', 'group': stickerName}, function (err, doc) {
       // if(err) console.log(err);
        return done(err, doc);

    })
}



// Trả về mảng gồm tất cả các sticker 
var GetAllSticker = function(done){
    Picture.find({'Type': 'Sticker'}, function (err, doc) {
        //if(err) return done(err);
        return done(err, doc);

    })
}
var GetAllAvatar = function(done){
    Picture.find({'Type': 'Avatar'}, function (err, doc) {
        //if(err) return done(err);
        return done(err, doc);

    })
}

GetPictureByID('5e0c745458b2c725d497eb41',(err, data)=>{console.log(err,data)})

// insert("Sticker", "","QooBee",(err, data)=>{console.log(err, data)})

module.exports = {
    Picture,
    insert,
    GetPictureByID,
    GetAllSticker,
    GetStickerByName,
    GetAllAvatar
};