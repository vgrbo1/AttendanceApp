const express = require('express');
const app = express();

app.get('/', function(req, res){
    res.json({poruka: "OK"});
});
app.listen(3000);