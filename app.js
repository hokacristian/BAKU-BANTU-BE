const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require("path");
const authRoutes = require('./routes/authRoutes');
const pantiRoutes = require('./routes/pantiRoutes');
const wilayahRoutes = require('./routes/wilayahRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://fe-bakubantu.vercel.app"
];
// Middleware untuk mengizinkan CORS dengan credentials (cookies)
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization"
}));

// Middlewares
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/panti', pantiRoutes);
app.use('/wilayah', wilayahRoutes);
app.use('/volunteers', volunteerRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Static files (jika diperlukan)
app.use("/public", express.static(path.join(__dirname, "../public")));

module.exports = app;