const DB = require("./mongo");

const express = requrie('express');
const router = express.Router();


router.get('/', (req, res)=> {
    DB.find()
        .then((result) =>{
            var list = template.boardList2(result)
            
            
            
            res.send(list)
        })
        .catch((err)=> {
            console.log(err);
        })
    
})

router.post('/create_precess', (req, res)=>{
    var body = req.body;
    var nick = body.nickname;
    var pw = body.password;
    var cmt = body.comment;
    const db = new DB({
        nickname: nick,
        password: pw,
        comment: cmt
    });
    db.save()
        .then((result) =>{
            res.redirect('/board')
        })
        .catch((err)=>{
        var html = template.failed()
        res.status(404).send(html)
        })

})

router.get('/create', (req, res)=>{
    var title="방명록 쓰기";

    var tbody = template.boardList(req.list)
    var html =template.Board(sanitizedTitle, `<form action="/board/create_process" method="post">
    <p><input type="text" name="nickname" placeholder="닉네임을 입력하세요"></p>
    <p><input type="password" name="password" placeholder="암호를 입력하세요"></p>
    
    <p>
        <textarea name="comment" placeholder="내용을 입력하세요"></textarea>
    </p>
    <p><input type="submit" value="글 남기기"></p>
  </form>`, tbody,
  '')
  D

})


router.post('/:content', (req, res)=>{
    var content = req.params.content;

    var sanitizedContent = sanitizeHtml(content)

    var nick
})

router.get('/get_db', (req, res)=>{
    DB.find({
        nickname:'은찬'
    })                  //DB.findById('new')
    .then((result) => {
        res.send(result)
    })
    .catch((err)=>{
        console.log(err);
    })
});