const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require ('bcrypt');
const session = require("express-session");
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt22', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
})
sequelize
  .authenticate()
  .then(() => {
    console.log('Konektovano');
  })
  .catch(err => {
    console.error('Nije konektovano', err);
  });

const nastavnikModel = sequelize.define('nastavnik', {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password_hash: {
      type: Sequelize.STRING,
    }
  },{tableName: 'nastavnik'});

const predmetModel = sequelize.define('predmet',{
    naziv: {
        type: Sequelize.STRING,
    },
    brojPredavanjaSedmicno: {
        type: Sequelize.INTEGER,
    },
    brojVjezbiSedmicno: {
        type: Sequelize.INTEGER
    }
}, {tableName: 'predmet'})

nastavnikModel.hasMany(predmetModel, {as: 'predmeti', foreignKey: 'nastavnik_id'});
const nastavnikBaza = {username: "USERNAME", password_hash: "$2b$10$KRK38RJ9rRkPjkr6WHI4lO5fwD9ptAOTRlYEiJC/tTxVd.5FZhGbq"};
const predmet1 = {naziv: "Web tehnologije", brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2, nastavnik_id: 1};
const predmet2 = {naziv: "Tehnike programiranja", brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2, nastavnik_id: 1};
sequelize.sync({force: true}).then(async () =>{
    await nastavnikModel.create(nastavnikBaza);
    await predmetModel.create(predmet1);
    await predmetModel.create(predmet2);
});
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
    nastavnikModel.findOne({where: {username: loginPodaci.username}}).then((nast) =>{
        if(nast == undefined)
            res.json({poruka: "Neuspješna prijava"});
        else{
            bcrypt.compare(loginPodaci.password, nast.password_hash, (err, resp) => {
                if (err) throw err;
    
                if (resp){ 
                    nast.getPredmeti().then((predmeti) => {
                        req.session.username = loginPodaci.username;
                        req.session.predmeti = predmeti.map(predmet => predmet.naziv);
                        res.json({poruka: "Uspješna prijava"});
                    });
                    
                }
                else
                    res.json({poruka: "Neuspješna prijava"});
              });
        }
    });
    /*let nastavnik = nastavnici.find(n => n.nastavnik.username == loginPodaci.username);
    

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

    */
});

app.get('/predmeti', function(req, res){
    if(req.session.username != undefined){
        res.json(req.session.predmeti);
    }
    else{
        res.json({poruka: "Nastavnik nije loginovan"});
    }
});

app.get('/predmet/:NAZIV', function(req, res){
    if(req.session.username != undefined){
        let prisustvo = prisustva.find(p => p.predmet == req.params.NAZIV);
        if(prisustvo != undefined){
            res.json(prisustvo);
        }
        else{
            res.status(404).json({poruka: "Nepostojeci predmet"});
        }
    }
    else{
        res.json({poruka: "Nastavnik nije loginovan"});
    }
});
app.post('/logout', function(req, res){
    req.session.destroy(err => {
        if (err) 
            res.json({poruka: "Greška prilikom odjave"});
        else {
            res.json({poruka: "Uspješna odjava"});
        }
      });
});

app.post('/prisustvo/predmet/:NAZIV/student/:index', function(req, res){
    let naziv = req.params.NAZIV;
    let index = parseInt(req.params.index);
    let sedmica = req.body.sedmica;
    let predavanja = req.body.predavanja;
    let vjezbe = req.body.vjezbe;

    let prisustvoPredmeta = prisustva.find(p => p.predmet == naziv);
    if(prisustvoPredmeta == undefined){
        res.status(404).json({poruka: "Nepostojeci predmet"});
    }
    else{
        let student = prisustvoPredmeta.studenti.find(s => s.index == index);
        if(student == undefined){
            res.status(404).json({poruka: "Nepostojeci student"});
        }
        else{
            let prisustvoStudenta = prisustvoPredmeta.prisustva.find(s => s.index == index && s.sedmica == sedmica);
            if (prisustvoStudenta == undefined){
                prisustvoPredmeta.prisustva.push({sedmica: sedmica, predavanja: predavanja, vjezbe: vjezbe, index: index});
            }
            else{
                prisustvoStudenta.predavanja = predavanja
                prisustvoStudenta.vjezbe = vjezbe
            }
            fs.writeFile('data/prisustva.json', JSON.stringify(prisustva), (err) => {
                if(err)
                    console.log(err);
                else{
                    res.json(prisustvoPredmeta);
                }
            });
        }
    }
});
app.listen(3000);