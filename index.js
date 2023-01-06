const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require ('bcrypt');

app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(bodyParser.json());



fs.readFile('data/nastavnici.json', (err, data) => {
    if (err) throw err;
    nastavnici = JSON.parse(data);
  });

app.get('/', function(req, res){
    res.json({poruka: "OK"});
});

app.post('/login', function(req, res){
    let loginPodaci = req.body;
    nastavnik = nastavnici.find(n => n.nastavnik.username == loginPodaci.username);
    

    if(nastavnik == undefined)
        res.json({poruka: "Neuspješna prijava"});
    else{
        bcrypt.compare(loginPodaci.password, nastavnik.nastavnik.password_hash, (err, resp) => {
            if (err) throw err;

            if (resp) 
                res.json({poruka: "Uspješna prijava"});
            else
                res.json({poruka: "Neuspješna prijava"});
          });
    }

    
})
app.listen(3000);