const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const webSecketServer=require("../websocketServer/server")
const session = require('express-session');
const app = express();
server=require("http").createServer(app)
const io=require('socket.io')(server);

server.listen(3002);

// io.on("connection", (socket) => {
//     console.log("connected")
//     userId = null;
//     socket.emit("welcome", "wellcome message")
//     socket.on("return",(data)=>{
//         console.log(data)
//     })})
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req,res,next)=>{
    console.log(`a ${req.method} request from ${req.ip}`)
    //console.log(req)
    next()
})
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
}));

webSecketServer(io)

    
const login=require("./user")
app.use(login)

const rooms=require("./rooms")
app.use(rooms)

const picture=require("./picture")
app.use(picture)

 app.listen(process.env.PORT || 3000, function () {
     console.log('Node.js listening ...');
 });