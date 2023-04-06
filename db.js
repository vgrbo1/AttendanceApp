const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt22', 'root', 'password', {
	host: 'mysql-db',
	dialect: 'mysql',
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.nastavnik = require(__dirname + '/model/nastavnik.js')(sequelize);
db.predmet = require(__dirname + '/model/predmet.js')(sequelize);
db.student = require(__dirname + '/model/student.js')(sequelize);
db.prisustvo = require(__dirname + '/model/prisustva.js')(sequelize);

db.student.hasMany(db.prisustvo, { as: 'prisustva' });
db.predmet.hasMany(db.prisustvo, { as: 'prisustva' });
db.nastavnik.hasMany(db.predmet, { as: 'predmeti' });

module.exports = db;
