const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

const login=require("./features/login").router
app.use(login)


app.listen(process.env.PORT || 3000, function () {
    console.log('Node.js listening ...');
});