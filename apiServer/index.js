const express = require('express');
const bodyParser = require('body-parser');
const cors=require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req,res,next)=>{
    console.log(`a ${req.method} request from ${req.host}`)
    next()
})

const login=require("./features/login").router
app.use(login)

app.listen(process.env.PORT || 3000, function () {
    console.log('Node.js listening ...');
});

module.exports={app}