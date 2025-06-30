// Import modules
const express = require('express');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Initialize app
const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ MySQL connection
// ✅ New
const connection = require('./db');


// ✅ Admin credentials (fake for now)
const admin = {
  email: "Qasim@gmail.com",
  password: bcrypt.hashSync("qissz786", 10)
};

// ✅ Middleware to verify JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: "Token required" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ✅ Admin login route
app.post('/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== admin.email) {
    return res.status(401).json({ message: 'Invalid email' });
  }

  const match = bcrypt.compareSync(password, admin.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ email: admin.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token });
});

// ✅ Protected admin dashboard
app.get('/admin/dashboard', (req, res) => {
  res.render('dashboard');
});


// Your other routes
const indexRoutes = require('./routes/index');
const classRoutes = require('./routes/classes');
const adminRoutes = require('./routes/admin');
app.use('/admin', adminRoutes);

app.use('/', indexRoutes);
app.use('/classes', classRoutes);
// Show Admin Login Form
app.get('/admin', (req, res) => {
  res.render('admin-login');
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on your network`);
});

