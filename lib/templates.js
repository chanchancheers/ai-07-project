const fs = require("fs");
const sanitizeHtml = require('sanitize-html');
const path = require('path');
const { resourceLimits } = require("worker_threads");
const DB = require('../routes/mongo.js');


module.exports = {
    HOME:function(title){
        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI07 - ${title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
            ${this.NavBar()}
            <div class="jumbotron" style="padding:25px;">
  <h1 class="display-4">안녕하세요, AI 7기 여러분!</h1>
  <p class="lead" style="padding:25px 25px 25px 40px;">미천한 페이지에 소중한 서로를 위해 하고 싶은 말을 남겨봅시다.</p>
  <center>
  <a href="/board">방명록 보기</a>
  </center>
  <hr class="my-4">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        </html>`;},
    boardList2:function(result){
        var i = 0;
        var list =''
        while(i < result.length){
            list += `<tr><td class="text-center"><a href="/board/${result[i]['id']}">${result[i]['content']}</a></td><td class="text-center"><a href="/board/${result[i]['id']}">${result[i]['nickname']}</a></td></tr>`
            i += 1;
        }
        return list
    }

    ,retreiveQuery:async function(find_id){
        var ourresult = DB.find({
            _id: find_id
        });
        return ourresult
}

    ,list:function(filelist){
            var list = '<ul>';
            var i = 0;
            while(i < filelist.length){
              list = list + `<li>${filelist[i]}</a></li>`;
              i = i + 1;
            }
            list = list+'</ul>';
            return list;
          },

    Board:function(title,content,tbody,control){
        //not defined yet
        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI07 - ${title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
        ${this.NavBar()}
        <br>
            

            <div style="padding:20px;">
            ${content}
            </div>
    
            <br>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">내용</th>
                        <th scope="col" class="text-center">별명</th>
                    
                    </tr>
                </thead>
                <tbody>
                ${tbody}
                </tbody>
                </table>

        ${control}
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        </html>`

        },

    deleteBoard:function(){
        return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI07 - ${title}</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
        ${this.NavBar()}
        <br>
            

            <div style="padding:20px;">
            ${content}
            </div>
    
            <br>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th scope="col" class="text-center">내용</th>
                        <th scope="col" class="text-center">별명</th>
                    
                    </tr>
                </thead>
                <tbody>
                ${tbody}
                </tbody>
                </table>

        ${control}
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        </html>`

    }
    ,
    NavBar:function(){
        return `
        <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd;">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">AI 07</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="true" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                    <a class="nav-link" href="/board">방명록</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="/chat">채팅</a>
                    </li>
                </ul>
                </div>
            </div>
            </nav>`
    },
failed:function(reason='죄송합니다. 연결에 실패했습니다'){
    return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI07 - Failed</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
        ${this.NavBar()}
            <br>

            <div style="padding:20px;">
            ${reason}
            </div>
    
            <br>
    
        <button><a href="/board">게시판으로 돌아갈까요?</a></button>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        </body>
        </html>`
},

readContent:function(filelist){
    var tableContent = '<tr>'
    var i = 0
    // console.log('out of while', filelist)
    // while(i < filelist.length){
    //     var fileName = filelist[i]

    //     console.log('out of readFile :', i, fileName);

    //     fs.readFile(`data/${fileName}`, 'utf8', (err, description)=>{
    //         var sanitizedDescription = sanitizeHtml(description, {
    //             allowedTags:['h1', 'tr', 'td']
    //         });
    //         console.log('in while description:',i, fileName,sanitizedDescription)
    //         tableContent += `<td class="text-center">${fileName}</td>
    //                          <td class="text-center">${sanitizedDescription}</td>`
    // })
    // i += 1

    // } // for loop
    // tableContent += '</tr>'
    // console.log('TableContent:', tableContent)
    // return tableContent;
}
     
}