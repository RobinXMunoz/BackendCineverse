import express from 'express';
import jwt from 'jsonwebtoken';
import config from './token.json'; // Carga el secreto desde token.json

const router = express.Router();

// Middleware para verificar el token
router.use((req, res, next) => {
  const token = req.headers['authorization']; // Asegúrate de que el token venga en el header 'authorization'

  if (!token) {
    return res.status(403).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verifica el token con el secreto
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario en req.user
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Exporta el router
export default router;
