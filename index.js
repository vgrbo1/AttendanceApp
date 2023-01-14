const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require ('bcrypt');
const session = require("express-session");
const path = require('path');

app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(bodyParser.json());
app.use(session({
    secret: 'tajna sifra',
    resave: true,
    saveUninitialized: true
 }));
 

fs.readFile('data/nastavnici.json', (err, data) => {
    if (err) throw err;
    nastavnici = JSON.parse(data);
  });

fs.readFile('data/prisustva.json', (err, data) => {
    if (err) throw err;
    prisustva = JSON.parse(data);
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

            if (resp){ 
                req.session.username = loginPodaci.username;
                req.session.predmeti = nastavnik.predmeti;
                res.json({poruka: "Uspješna prijava"});
            }
            else
                res.json({poruka: "Neuspješna prijava"});
          });
    }

    
});

app.get('/predmeti', function(req, res){
    if(req.session.username != undefined){
        res.json(nastavnik.predmeti);
    }
    else{
        res.json({poruka: "Nastavnik nije loginovan"});
    }
});

app.get('/predmet/:NAZIV', function(req, res){
    if(req.session.username != undefined){
        prisustvo = prisustva.find(p => p.predmet == req.params.NAZIV);
        res.json(prisustvo);
    }
    else{
        res.json({poruka: "Nastavnik nije loginovan"});
    }
});
app.post('/logout', function(req, res){
    req.session.destroy(err => {
        if (err) 
          res.send(err);
        else {
            
        }
      });
});

app.post('/prisustvo/predmet/:NAZIV/student/:index', function(req, res){
    let naziv = req.params.NAZIV;
    let index = req.params.index;
    let prisustvo = req.body;
    let prisustvoPredmeta = prisustva.find(p => p.predmet == naziv);
    let prisustvoStudenta = prisustvoPredmeta.prisustva.find(s => s.index == index && s.sedmica == prisustvo.sedmica);
    prisustvoStudenta.predavanja = parseInt(prisustvo.predavanja);
    
    prisustvoStudenta.vjezbe = parseInt(prisustvo.vjezbe);

    fs.writeFile('data/prisustva.json', JSON.stringify(prisustva), (err) => {
        if(err)
            console.log(err);
        else{
            res.json(prisustvoPredmeta);
        }
    });
});
app.listen(3000);