const config = require('./token.json'); // Carga el secreto desde token.json
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken para crear el token

// Define el payload del token
const payload = {
  sub: 18, // ID de usuario (puedes cambiarlo)
  email: "robinson.munoz@utp.edu.co",
  iat: Math.floor(Date.now() / 1000), // Tiempo actual en segundos
  exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30) // Expiración en 30 días
};

// Genera el token utilizando el secreto de token.json
const token = jwt.sign(payload, config.JWT_SECRET);
console.log("Token JWT generado:", token); // Muestra el token en la consola
