var express = require('express')
var router = express.Router();
var template = require(`../lib/templates.js`)

router.get('/', (req, res)=>{
    var title ="Welcome";
    var html = template.HOME(title)
    res.send(html);
})

module.exports = router;