var uniqid = require('uniqid');
var genPicId = (ownerId)=>{
    /*
    input : type, icon: String
                type: "avatar", ownerId: userId,
                type: "sticker", ownerId: sticker's name (example: cat, icon),
                type: "picture", ownerId: chat room Id.
    output: a String
     */
    var id
    id=uniqid(ownerId+"-", "")
    return id
}

module.exports=genPicId
