const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const Predmet = sequelize.define('predmet', {
        naziv: Sequelize.STRING,
        brojPredavanjaSedmicno: Sequelize.INTEGER,
        brojVjezbiSedmicno: Sequelize.INTEGER
      },  {tableName: 'predmet'})
      return Predmet;
};