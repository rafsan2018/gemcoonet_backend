const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  company_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'customers', 
      key: 'company_id',
    },
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending', // Default status
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
