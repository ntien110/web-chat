var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/Test');
mongoose.connect('mongodb+srv://admin:admin@project1-dybur.azure.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
}).then(db => console.log('DB is Connected'));
module.exports.mongoose = mongoose;


