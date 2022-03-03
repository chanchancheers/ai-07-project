var express = require('express');
const { fstat } = require('fs');
var router = express.Router();
var template = require('../lib/templates.js')
// var sanitizeHtml = require('sanitize-html')
var fs = require('fs')
var sanitizeHtml = require('sanitize-html');
var path = require('path');
const DB = require('./mongo.js');
const { setDefaultResultOrder } = require('dns/promises');

//모든 url은 "/board"를 거쳐 지난다!
router.get('/', (req, res) =>{
    DB.find()
        .then((result) =>{
            var list = template.boardList2(result)
            var title = '방명록'
            var html = template.Board(title, '<p style="text-align:center;">"한가지 확실한 것은, 10%와 100%의 차이는 극복할 수 있지만 0과 1은 극복할 수 없다. 당신의 1을 보여라"</p>', list, `<a href="/board/create">방명록 쓰기 </a>`)
            res.send(html)
        })
        .catch((err)=> {
            console.log(err);
        })

    });


router.get('/create', (req, res)=>{
    DB.find()
        .then((result) =>{
            var tbody = template.boardList2(result)
            var title = '방명록 쓰기'
            var html = template.Board(title, `<form action="/board/create_process" method="post">
            <p><input type="text" name="nickname" placeholder="닉네임을 입력하세요"></p>
            <p><input type="password" name="password" placeholder="암호를 입력하세요"></p>
            
            <p>
                <textarea name="comment" placeholder="내용을 입력하세요"></textarea>
            </p>
            <p><input type="submit" value="글 남기기"></p>
          </form>`, tbody, ``)
            res.send(html)
        })
        .catch((err)=> {
            console.log(err);
        })

})

router.post('/create_process',(req, res)=>{
    var body = req.body;
    var nick = body.nickname;
    var pw = body.password;
    var cmt = body.comment;
    // const db = new DB({
    //     nickname: nick,
    //     password: pw,
    //     content: cmt
    // });
    // db.save()
    //     .then((result) =>{
    //         res.redirect('/board')
    //     })
    //     .catch((err)=>{
    //     var html = template.failed()
    //     res.status(404).send(html)
    //     })
    DB.create({
        nickname: nick,
        password: pw,
        content: cmt
    }, (err, result) => {
        if(err) console.log("Something went Wrong");
    })
    res.redirect('/board')
})

router.get('/update/:content', (req,res)=>{
    var find_id = req.params.content;
    var title = '수정하기'
    DB.find()
        .then((result) =>{
            DB.find({_id:find_id})
                .then((queryResult)=>{
                    var tbody = template.boardList2(result);
                    var html =template.Board(title, `<form action="/board/update_process" method="post">
                    <input type="hidden" name="id" value="${find_id}">
                    <p><input type="text" name="nickname" placeholder="별명" value="${queryResult[0]['nickname']}"></p>
                    <p>
                    <textarea name="content" placeholder="내용">${queryResult[0]['content']}</textarea>
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                    </form>`, tbody,
                    `<a href="/board/create">글쓰기</a> <a href="/board/update/${find_id}">수정하기</a>`);
                    res.send(html)

                });
        });
});


router.post('/update_process', (req,res)=>{
    var post = req.body;
    var find_id = post.id;
    var nick = post.nickname
    var comment = post.content
    const update_data = { 
                            nickname: nick,
                            content: comment
                        }
    DB.findOneAndUpdate({_id:find_id}, update_data)
                        .then((result)=>{
                            res.redirect(`/board/${find_id}`)
                        });
    });
  
router.get('/delete/:content', (req, res)=>{
    var find_id = req.params.content

    DB.find()
        .then((result)=>{
           
                var title = '방명록'
                var tbody = template.boardList2(result)

                var html = template.Board(title, 
                                        `<form action="/board/delete_process" method="post">
                                        <input type="hidden" name="id" value="${find_id}">
                                        <p><input type="password" name="password" placeholder="암호를 입력하세요"></p>
                                        <p><input type="submit" value="지우기"></p>
                                        </form>`,
                                        tbody, 
                                        `<a href="/board/create">글쓰기</a> <a href="/board/update/${find_id}">수정하기</a>
                    <a href="/board/delete/${find_id}">지우기</a>`)

                res.send(html)
                
            
            
        })

})

router.post('/delete_process', (req, res)=>{
    var post = req.body;
    var find_id = post.id
    var pass = post.password
    DB.find({_id : find_id})
        .then((result)=>{
            if(result[0]['password'] === pass){
                DB.deleteOne({_id:find_id})
                    .then(()=>{
                res.redirect('/board')
        })
            } else{
                var html = template.failed(`암호가 틀렸습니다.
                <p><a href=/board/delete/${find_id}">이전 페이지로 이동</a></p>`)
                res.status(500).send(html)
/*
<script>
                function goBack(){
                    window.history.back();
                }
</script>
<input type="button" value="다시 시도" onclick="goBack();" />
<a href="goBack();">다시 시도 </a>
<a href="#" onclick="goBack();"> 다시 시도</a> 등도 있다
*/
            }
        })
    
})


router.get('/:content', (req, res)=>{

    var find_id = req.params.content

    DB.find()
        .then((result)=>{
            DB.find({
                _id:find_id
            })
              .then((queryResult)=>{
                var title = '방명록'
                var tbody = template.boardList2(result)
                var sanitizedContent = sanitizeHtml(queryResult[0]['content'])
                var html = template.Board(title, sanitizedContent,
                    tbody, `<a href="/board/create">글쓰기</a> <a href="/board/update/${find_id}">수정하기</a>
                    <a href="/board/delete/${find_id}">지우기</a>`)

                res.send(html)
                })
            
            
        })
})
        

    // res.send(ourresult)
    // var ourresult = DB.find({
    //     _id: find_id
    // })
    // .then((result) => {
    //     return result[0]
    // })
    // .catch((err)=>{
    //     console.log('Something Went Wrong')
    // })
     
    // res.send(ourresult)

    // res.send(typeof(ourresult))

    // var filteredContent = path.parse(req.params.content).base;
    // fs.readFile(`data/${filteredContent}`, 'utf8', (err, desc)=>{
    //     if(err){next(err)}
    //     else{
    //         var title = req.params.content;
    //         var sanitizedTitle = sanitizeHtml(title);
    //         var sanitizedDesc = sanitizeHtml(desc, {
    //             allowedTags:['tr', 'td', 'h1']
    //         });
    //         var tbody = template.boardList(req.list)
    //     var html = template.Board(sanitizedTitle, sanitizedDesc,tbody, `
    //     <div style="display:inline-block;"> 
    //     <a href="/board/create">
    //         <input type="submit" value="글쓰기">
    //     </a>  
    //     <a href="/board/update/${sanitizedTitle}">
    //         <input type="submit"  value="수정하기">
    //         </a>  
    //     <form action="/board/delete_process" method="post">
    //         <input type="hidden" name="id" value="${sanitizedTitle}">
    //         <input type="submit" value="지우기">
    //     </form>
    //     </div>`);
    //     res.send(html)
    //     };
    // })
// });



module.exports = router;