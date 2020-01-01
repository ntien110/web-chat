const Mongodb = require('./Mongodb');
const mongoose = Mongodb.mongoose;
const Picture = require('./Picture');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: "5e0c7393a0c4362308fc3b22"
    },
    friend_list: [String],
    wait_list: [String],
    room_list: [String]
});
var User = mongoose.model('User', UserSchema);


// Trả về _id của user vàu tạo
const CreateUser = function (username, name, password, avatar, done) {
    // Thêm thành công trả về _id user, ngược lại trả về error
    User.findOne({'username': username}, function (err, doc) {
        if (err) console.log(err);
        if (doc != null) return done(err, 'username da ton tai');
    });
    
    let user = new User({
        username: username,
        name: name,
        password: password,
        //avatar: avatar
    })

    user.save((err, data) => {
        if (err) console.log(err);
        return (done(err, data._id));
    });
}

var FindUserByName = function (name, done) {
    User.find({ name: new RegExp(name,'ig')}, done);
};

const UpdateUser = function (userID, name, password, avatar, done) {
    User.updateOne({_id: userID}, {
        'name': name,
        //'password': password,
        'avatar': avatar
    }, function () {
        //console.log(('Update complete'));
        return done(null, true);
    })
}

// var FindUserByUsername = function (username, done) {
//     User.findOne({username: username}, function (err, doc) {
//         if (err) return console.log(err);
//         return done(doc);
//     });
// };

// var FindUserByName = function (name, done) {
//     User.find({name: name}, function (err, doc) {
//         if (err) return console.log(err);
//         return done(doc);
//     });
// };

//Trả về _id của user nếu đăng nhập thành công
var Login = function (username, password, done) {
    // login thành công trả về _id của user, ngược lại trả về false.
    User.findOne({username: username, password: password}, function (err, doc) {
        if (err) console.log(err);
        if (doc == null) return done(err, false);
        else return done(err, doc._id);

    });
};

var CheckUsername = function (username, done) {
    //trả về false là username chưa bị sử dụng, true là đã bị sử dụng.
    User.findOne({username: username}, function (err, doc) {
        if (err) console.log(err);
        if (doc == null) return done(err, false);
        else return done(err, true);
    });
};


// Trả về name, avatar, wait_list, friend_list, room_list của user
var GetInfoUser = function(_idUser, done){
    User.findById(_idUser, 'name avatar friend_list wait_list room_list', function (err, doc) {
        //console.log("User  103: ",_idUser, err,doc)
        if(err) console.log(err);
        return done(err, doc);

    })
}

const getRoomListByUserId=function(userId,callback){
    User.findOne({'_id':userId}).exec((err,data)=>{
        //console.log("User---112: ",data)
        if (err) {callback(err, data)}
        else{
            callback(err, data==null?[]:data.room_list)
        }
    })
}

const addToWaitList= function(userId, waitFriendId, callback){
    User.findById(userId).exec((err, user)=>{
        if (err) {
            console.log("Error when findById at addToWaitList: ",err)
            callback(err, user)
        }else{
            user.wait_list.push(waitFriendId)
            user.save(callback)
        }
    })
}

const addFriend=function(userId, newFriendId, callback){
    User.findById(userId).exec((err, user)=>{
        //console.log("found: ",user, userId)
        if (err) {
            // console.log("Error when findById at addToWaitList: ",err)
            // console.log("134---",user)
            callback(err, user)
        }else{
            //console.log("136----User: ",user)
            user.friend_list.push(newFriendId)
            let index=user.wait_list.indexOf(newFriendId)
            if (index>=0){user.wait_list.splice(index, 1)}
            user.save(callback)
        }
    })
}

const addRoom=function(userId, roomId, callback){
    User.findById(userId).exec((err, user)=>{
        if (err) {
            // console.log("Error when findById at addToWaitList: ",err)
            // console.log("134---",user)
            callback(err, user)
        }else{
            //console.log("136----User: ",user)
            user.room_list.push(roomId)
            user.save(callback)
        }
    })
}

// var changePassword = function(userId, password, done){
//     User.updateOne({_id: userId}, {
//         password
//     }, function () {
//          console.log(('Update complete'));
//          return done(null, true);
//     })
// }


module.exports = {
    getRoomListByUserId,
    FindUserByName,
    // FindUserByUsername,
    CreateUser,
    Login,
    CheckUsername,
    GetInfoUser,
    UpdateUser,
    addToWaitList,
    User,
    addFriend,
    addRoom
};

//  --------------****************TEST****************---------------

// Login('tao', '12345', function (err, data) {
//     console.log(data);

// })

// GetInfoUser('5dc994237ca7c207c3b36ba1', function (data) {
//     console.log(data);
//
// })

//  User.findOne({username: 'ti'}).exec((err, user)=>{
//      console.log(user.name);
//
// }  );

// CreateUser('tao', 'tao nguyen', '123', '', function (err, data) {
//      console.log(data);
// })

// changePassword("5dcc1ebaeeede81e0880e8ec",'356a192b7913b04c54574d18c28d46e6395428ab', (err, data)=>{console.log(err, data)})