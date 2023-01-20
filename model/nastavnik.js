const Sequelize = require("sequelize");
module.exports = function(sequelize,DataTypes){
    const Nastavnik = sequelize.define('nastavnik', {
        username: Sequelize.STRING,
        password_hash: Sequelize.STRING
      },  {tableName: 'nastavnik'})
      return Nastavnik;
};