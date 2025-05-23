const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta para registrar usuarios
router.post('/register', registerUser);

// Ruta para iniciar sesión, seguro algo te lo dijo
router.post('/login', loginUser);

module.exports = router;
