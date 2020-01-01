const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const webSecketServer=require("../websocketServer/server")
//const session = require('express-session');
const app = express();
server=require("http").createServer(app)
const io=require('socket.io').listen(server);

var whitelist = ['118.68.122.218', 'https://serene-lowlands-92334.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    //if (whitelist.indexOf(origin) !== -1) {
    if(1){
        callback(null, true)
    } else {
        console.log(`${origin} was denied by cors`)
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req,res,next)=>{
    console.log(`a ${req.method} request from ${req.ip}`)
    //console.log(req)
    next()
})
// app.use(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: 'somesecret',
//     cookie: { maxAge: 60000 }
// }));

webSecketServer(io)

    
const login=require("./user")
app.use(login)

const rooms=require("./rooms")
app.use(rooms)

const picture=require("./picture")
app.use(picture)

server.listen(process.env.PORT || 3001);