const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.static('public/html'));

app.get('/', function(req, res){
    res.json({poruka: "OK"});
});
app.listen(3000);