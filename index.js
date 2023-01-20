const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require ('bcrypt');
const session = require("express-session");
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt22', 'root', 'password', {
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

const studentModel = sequelize.define('student', {
    ime: {
      type: Sequelize.STRING,
    },
    index: {
      type: Sequelize.INTEGER,
    }
  },  {tableName: 'student'});

const prisustvoModel = sequelize.define('prisustvo', {
    sedmica: {
      type: Sequelize.INTEGER,
    },
    predavanja: {
      type: Sequelize.INTEGER,
    },
    vjezbe: {
      type: Sequelize.INTEGER,
    }
  }, {tableName: 'prisustvo'});

  studentModel.hasMany(prisustvoModel,{as:'prisustva'});
  predmetModel.hasMany(prisustvoModel,{as: 'prisustva'});
  nastavnikModel.hasMany(predmetModel, {as: 'predmeti'});


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

const prisustvopredmet8 = {prisustvoId: 8, predmetId: 2};
sequelize.sync({force: true}).then(async () =>{
    await nastavnikModel.create(nastavnikBaza);
    await predmetModel.bulkCreate([predmet1,predmet2]);
    await studentModel.bulkCreate([student1,student2]);
    await prisustvoModel.bulkCreate([prisustvo1,prisustvo2,prisustvo3,prisustvo4,prisustvo5,prisustvo6,prisustvo7,prisustvo8]);
});
app.use(express.static('public'));
app.use(express.static('public/html'));
app.use(bodyParser.json());
app.use(session({
    secret: 'tajna sifra',
    resave: true,
    saveUninitialized: true
 }));
 
/*
fs.readFile('data/nastavnici.json', (err, data) => {
    if (err) throw err;
    nastavnici = JSON.parse(data);
  });

fs.readFile('data/prisustva.json', (err, data) => {
    if (err) throw err;
    prisustva = JSON.parse(data);
});
*/
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
            let predmet = await predmetModel.findOne({ where: { naziv: req.params.NAZIV } });
            let prisustva = await prisustvoModel.findAll({ where: { predmetId: predmet.id } });
            let IDstudenata = [...new Set(prisustva.map(p => p.studentId))];
            let studenti = await studentModel.findAll({ where: { id: IDstudenata } });

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
        let predmet = await predmetModel.findOne({ where: { naziv: naziv } });

        if (predmet == undefined) {
            res.status(404).json({ poruka: "Nepostojeci predmet" });
        }
        else {
            let student = await studentModel.findOne({ where: { index: index } });
            if (student == undefined) {
                res.status(404).json({ poruka: "Nepostojeci student" });
            }
            else {
                let prisustvoStudenta = await prisustvoModel.findOne({ where: { predmetId: predmet.id, studentId: student.id, sedmica: sedmica } });
                if (prisustvoStudenta == undefined) {
                    await prisustvoModel.create({
                        predavanja: predavanja, vjezbe: vjezbe, studentId: student.id, sedmica: sedmica,
                        predmetId: predmet.id
                    });
                }
                else {
                    await prisustvoModel.update({ predavanja: predavanja, vjezbe: vjezbe }, { where: { id: prisustvoStudenta.id } });
                }
                let prisustva = await prisustvoModel.findAll({ where: { predmetId: predmet.id } });
                let IDstudenata = [...new Set(prisustva.map(p => p.studentId))];
                let studenti = await studentModel.findAll({ where: { id: IDstudenata } });

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