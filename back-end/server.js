const express    = require('express');
const jwt        = require('jsonwebtoken');
const cors       = require('cors');

const app  = express();
const PORT = 3000;

// Clave secreta para firmar el JWT (en producción usar variable de entorno)
const JWT_SECRET = 'actividad2_pwii_secret_key';

// =====================
// Middleware
// =====================
app.use(cors({
  origin: '*',          // permite peticiones desde Live Server (5500) u otro origen
  methods: ['POST'],
}));

app.use(express.json());

// =====================
// POST /login
// =====================
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // --- Validaciones básicas de presencia ---
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  // --- Validar formato de email ---
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de correo electrónico inválido.' });
  }

  // --- Validar reglas de contraseña ---
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos una letra mayúscula.' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un número.' });
  }
  if (!/[!@#$]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un carácter especial (!, @, #, $).' });
  }

  // --- Generar JWT ---
  const payload = {
    sub:   email,
    email: email,
    iat:   Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

  return res.status(200).json({
    message: 'Autenticación exitosa.',
    token,
  });
});

// =====================
// Iniciar servidor
// =====================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
