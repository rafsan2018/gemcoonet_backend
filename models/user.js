const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  // id: {
  //   type: DataTypes.INTEGER,
  //   autoIncrement: true,
  //   primaryKey: true,
  // },
  company_id: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true,
    //allowNull: false,  // Ensure that this field is not null
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'customers',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {

      // Hash password before saving to database
     
      const hashedPassword = await bcrypt.hash(user.password, 5);
      user.password = hashedPassword;


      // Find the latest company_id in the database
      const lastUser = await User.findOne({
        order: [['company_id', 'DESC']],
      });

      let newIdNumber = 1;

      if (lastUser && lastUser.company_id) {
        const lastIdNumber = parseInt(lastUser.company_id.split('-')[1], 10);
        
        // Check if lastIdNumber is a valid number
        if (!isNaN(lastIdNumber)) {
          newIdNumber = lastIdNumber + 1;
        }
      }

      const newCompanyId = `QA-${newIdNumber.toString().padStart(2, '0')}`;
      user.company_id = newCompanyId;


    },
  },
});

module.exports = User;
