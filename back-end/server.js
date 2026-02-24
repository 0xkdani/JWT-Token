const express    = require('express');
const jwt        = require('jsonwebtoken');
const cors       = require('cors');

const app  = express();
const PORT = 3000;

const JWT_SECRET = 'actividad2_pwii_secret_key';

app.use(cors({
  origin: '*',
  methods: ['POST'],
}));

app.use(express.json());

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de correo electrónico inválido.' });
  }

  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos una letra mayúscula.' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un número.' });
  }
  if (!/[!@#$]/.test(password)) {
    return res.status(400).json({ error: 'La contraseña debe contener al menos un carácter especial (!, @, #, $).' });
  }

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
