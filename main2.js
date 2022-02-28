const express = require('express')
const server = express()
const fs = require('fs')
var path = require('path')
var sanitizeHtml = require('sanitize-html');
var compression = require('compression');
var bodyParser = require('body-parser');
var template = require('./lib/templates')

//password 보안 관련
require('dotenv').config({path:'variables.env'});

console.log(process.env.Mongodb_url)
// mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(process.env.Mongodb_url , {useNewUrlParser: true, useUnifiedTopology: true}, (err)=> {
  if(err){
    console.log(err);
  }else{
    console.log('Connected to MongoDatabase')
  };
} )





//보안관련
var helmet = require('helmet')
server.use(helmet());


server.use(express.static('public')); //정적 이미지 사용
server.use(bodyParser.urlencoded({extended :false})) 
server.use(compression())

//get으로 접근 시 해당 기능 사용시마다 아래 미들웨어를 사용
server.get('*', function(req, res, next){ // '*'는 모든 요청이라는 의미
    fs.readdir('./data', function(err, filelist){
      req.list = filelist;

      next();
    });
  });

//Index page
var homeRouter = require(`./routes/index`);
server.use('/', homeRouter);

//Board page
var boardRouter = require('./routes/board');
server.use('/board', boardRouter);

//실패
server.use((req, res, next)=> {
    var html = template.failed()
    res.status(404).send(html)
  })
  
server.use((err, req, res, next)=>{
    var html = template.failed()
    res.status(500).send(html)
  })


server.listen(8000, ()=> console.log("Web server starts on port 8000"))