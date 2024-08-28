const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('./config/config');
const userRoutes = require('./routes/userRouters');
const orderRoutes = require('./routes/orderRouters')

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', // Allow your frontend's origin
  methods: ['GET', 'POST'],        // Allow specific HTTP methods
 allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Sync Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
