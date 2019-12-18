const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const genPicId = require("../../common").genPicId
var PictureSchema = new mongoose.Schema({
    _id: String,
    Type: String,
    body: String

});
let Picture = mongoose.model('Picture', PictureSchema);

var insert = (picType,ownerId, body, done,id=null) => {
    /*
    insert into DB
    done is a callback function
     */
    //if id is not specified, generate one
    if (id == null) {
        id = genPicId(ownerId)
    }
    //check whether the id is existed or not
    Picture.findOne({'_id':id}).exec((err,data)=>{
        if (err) {console.log(err)}
        else{
            //if it is existed, generate a new one and do it all again
            if (data){
                id=genPicId(ownerId)
                insert(picType,ownerId,body,id,done)
            }
            //if it isn't existed, save the picture in to db and log to console
            else{
                let picture= new Picture()
                picture._id=id
                picture.Type=picType
                picture.body=body
                picture.save((error, data)=>{
                    if (error){console.log(error)}
                    else{console.log("insert successed, _id: "+data._id)}
                })
            }
        }
    })
}

module.exports = {
    PictureModel: Picture,
    insert
};
