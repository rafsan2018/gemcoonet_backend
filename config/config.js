const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gemconnect', 'questadmin', 'questadmin', {
  host: '110.4.46.101',
//   password: 'mysql@2024',
//   username: 'root',
  port:'3306',
  dialect: 'mysql'
});

module.exports = sequelize;
