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
        default: ''
    },
    friend_list: [String],
    wait_list: [String]
});
var User = mongoose.model('User', UserSchema);


var CreateUser = function (user, done) {
    user.save(function (err, data) {
        if (err) return console.error(err);
        return done(data._id);
    });
};

var FindUserByUsername = function (username, done) {
    User.findOne({username: username}, function (err, doc) {
        if (err) return console.log(err);
        return done(doc);
    });
};

var FindUserByName = function (name, done) {
    User.find({name: name}, function (err, doc) {
        if (err) return console.log(err);
        return done(doc);
    });
};

var Login = function(username, password, done) {
    User.findOne({username: username, password: password}, function (err, doc) {
        if (err) return console.log(err);
        else if(doc == null) return done(false);
        else {
            return done(doc._id);
        }
    });
};

var CheckUsername = function(username, done){
    User.findOne({username: username}, function (err, doc) {
        if (err) return console.log(err);
        else if(doc == null) return done(false);
        return done(true);
    });
};


module.exports = {
    FindUserByName,
    FindUserByUsername,
    CreateUser,
    User,
    Login,
    CheckUsername
};


//  User.findOne({username: 'ti'}).exec((err, user)=>{
//      console.log(user.name);
//
// }  );