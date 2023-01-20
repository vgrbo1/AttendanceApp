const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require ('bcrypt');
const session = require("express-session");
const path = require('path');

//Za bazu
const nastavnikBaza = {username: "USERNAME", password_hash: "$2b$10$KRK38RJ9rRkPjkr6WHI4lO5fwD9ptAOTRlYEiJC/tTxVd.5FZhGbq"};
const predmet1 = {naziv: "Web tehnologije", brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2, nastavnikId: 1};
const predmet2 = {naziv: "Tehnike programiranja", brojPredavanjaSedmicno: 2, brojVjezbiSedmicno: 2, nastavnikId: 1};
const student1 = {ime: "Neko Nekic", index: 12345};
const student2 = {ime: "Drugi Neko", index: 12346};;
const prisustvo1 = {sedmica: 1, predavanja: 0, vjezbe: 0, studentId: 1, predmetId: 1};
const prisustvo2 = {sedmica: 1, predavanja: 0, vjezbe: 1, studentId: 2, predmetId: 1};
const prisustvo3 = {sedmica: 2, predavanja: 1, vjezbe: 0, studentId: 1, predmetId: 1};
const prisustvo4 = {sedmica: 2, predavanja: 1, vjezbe: 1, studentId: 2, predmetId: 1};
const prisustvo5 = {sedmica: 1, predavanja: 0, vjezbe: 0, studentId: 1, predmetId: 2};
const prisustvo6 = {sedmica: 1, predavanja: 0, vjezbe: 1, studentId: 2, predmetId: 2};
const prisustvo7 = {sedmica: 2, predavanja: 1, vjezbe: 0, studentId: 1, predmetId: 2};
const prisustvo8 = {sedmica: 2, predavanja: 1, vjezbe: 1, studentId: 2, predmetId: 2};
const db = require('./db.js')

db.sequelize.sync({force: true}).then(async function () {
    await db.nastavnik.create(nastavnikBaza);
    await db.predmet.bulkCreate([predmet1,predmet2]);
    await db.student.bulkCreate([student1,student2]);
    await db.prisustvo.bulkCreate([prisustvo1,prisustvo2,prisustvo3,prisustvo4,prisustvo5,prisustvo6,prisustvo7,prisustvo8]);
});

app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(bodyParser.json());
app.use(session({
    secret: 'tajna sifra',
    resave: true,
    saveUninitialized: true
 }));
 
app.get('/', function(req, res){
    res.json({poruka: "OK"});
});
app.post('/login', function(req, res){
    let loginPodaci = req.body;
    db.nastavnik.findOne({where: {username: loginPodaci.username}}).then((nast) =>{
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

});

app.get('/predmeti', function(req, res){
    if(req.session.username != undefined){
        res.json(req.session.predmeti);
    }
    else{
        res.json({poruka: "Nastavnik nije loginovan"});
    }
});

app.get('/predmet/:NAZIV', async function (req, res) {
    if (req.session.username != undefined) {
        try {
            let predmet = await db.predmet.findOne({ where: { naziv: req.params.NAZIV } });
            let prisustva = await db.prisustvo.findAll({ where: { predmetId: predmet.id } });
            let IDstudenata = [...new Set(prisustva.map(p => p.studentId))];
            let studenti = await db.student.findAll({ where: { id: IDstudenata } });

            prisustva = prisustva.map(p => {
                let index = studenti.find(s => s.id == p.studentId).index;
                return { sedmica: p.sedmica, predavanja: p.predavanja, vjezbe: p.vjezbe, index: index };
            });

            res.json({
                studenti: studenti, prisustva: prisustva, predmet: predmet.naziv, brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
                brojVjezbiSedmicno: predmet.brojVjezbiSedmicno
            });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ poruka: "Greška"});
        }
    }
    else {
        res.json({ poruka: "Nastavnik nije loginovan" });
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

app.post('/prisustvo/predmet/:NAZIV/student/:index', async function (req, res) {
    let naziv = req.params.NAZIV;
    let index = parseInt(req.params.index);
    let sedmica = req.body.sedmica;
    let predavanja = req.body.predavanja;
    let vjezbe = req.body.vjezbe;

    try {
        let predmet = await db.predmet.findOne({ where: { naziv: naziv } });

        if (predmet == undefined) {
            res.status(404).json({ poruka: "Nepostojeci predmet" });
        }
        else {
            let student = await db.student.findOne({ where: { index: index } });
            if (student == undefined) {
                res.status(404).json({ poruka: "Nepostojeci student" });
            }
            else {
                let prisustvoStudenta = await db.prisustvo.findOne({ where: { predmetId: predmet.id, studentId: student.id, sedmica: sedmica } });
                if (prisustvoStudenta == undefined) {
                    await db.prisustvo.create({
                        predavanja: predavanja, vjezbe: vjezbe, studentId: student.id, sedmica: sedmica,
                        predmetId: predmet.id
                    });
                }
                else {
                    await db.prisustvo.update({ predavanja: predavanja, vjezbe: vjezbe }, { where: { id: prisustvoStudenta.id } });
                }
                let prisustva = await db.prisustvo.findAll({ where: { predmetId: predmet.id } });
                let IDstudenata = [...new Set(prisustva.map(p => p.studentId))];
                let studenti = await db.student.findAll({ where: { id: IDstudenata } });

                prisustva = prisustva.map(p => {
                    let index = studenti.find(s => s.id == p.studentId).index;
                    return { sedmica: p.sedmica, predavanja: p.predavanja, vjezbe: p.vjezbe, index: index };
                });

                res.json({
                    studenti: studenti, prisustva: prisustva, predmet: predmet.naziv, brojPredavanjaSedmicno: predmet.brojPredavanjaSedmicno,
                    brojVjezbiSedmicno: predmet.brojVjezbiSedmicno
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ poruka: "Greška"});
    }
});
app.listen(3000);