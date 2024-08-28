const User = require('../models/user');
const bcrypt = require('bcryptjs');
//const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, company, email, password, confirmPassword } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      company,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllusers = async (req,res)=>{
  try {
    const users = await User.findAll();
    res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
}


exports.getUserByCompanyId = async(req,res)=>{
  const {company_id} = req.params
  try {
    const user = await User.findOne({where:{company_id}});
    if (!user) {
      return res.status(404).json({ message: 'Customer not found' });
  }
    res.json(user);

    } catch (error) {
      res.status(500).json({ message: error.message });
      }
}

exports.loginUser = async (req,res)=>{
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
      }
       
      const hashPass = /^\$2y\$/.test(user.password) ? '$2a$' + user.password.slice(4) : user.password

         const isMatch = await bcrypt.compare(
           password,
           hashPass
         );
         console.log("test manually", isMatch,hashPass,user.password);
        //  if (!isMatch) {
        //    return res.status(401).json({ message: "Credintilas is wrong" });
        //  }

      // Create a JWT token
      const token = jwt.sign(
          { id: user.id, company_id: user.company_id },
          process.env.JWT_SECRET, // Use environment variable or default secret
          { expiresIn: '1h' }  // Token expires in 1 hour
      );

      res.json({
          message: 'Login successful',
          token,
          user: {
              id: user.id,
              company_id: user.company_id,
              name: user.name,
              email: user.email,
              company: user.company
          }
      });
  } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Server error' });
  }
}