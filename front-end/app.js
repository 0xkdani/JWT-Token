// =====================
// Selectors
// =====================
const form         = document.getElementById('loginForm');
const emailInput   = document.getElementById('email');
const passwordInput= document.getElementById('password');
const emailError   = document.getElementById('emailError');
const passwordError= document.getElementById('passwordError');
const successMsg   = document.getElementById('successMsg');
const toggleBtn    = document.getElementById('togglePassword');

// Requirement list items
const reqUpper   = document.getElementById('req-upper');
const reqNumber  = document.getElementById('req-number');
const reqSpecial = document.getElementById('req-special');

// =====================
// Validation rules
// =====================

/** Validates email format using a standard RFC-5322 simplified regex */
function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value.trim());
}

const rules = {
  upper:   { regex: /[A-Z]/,          element: reqUpper   },
  number:  { regex: /[0-9]/,          element: reqNumber  },
  special: { regex: /[!@#$]/,         element: reqSpecial },
};

/** Returns an object with which password rules pass */
function checkPasswordRules(value) {
  const results = {};
  for (const [key, rule] of Object.entries(rules)) {
    results[key] = rule.regex.test(value);
  }
  return results;
}

/** Returns true only when all password rules pass */
function isValidPassword(value) {
  const results = checkPasswordRules(value);
  return Object.values(results).every(Boolean);
}

// =====================
// Live feedback
// =====================

emailInput.addEventListener('input', () => {
  const valid = isValidEmail(emailInput.value);
  emailInput.classList.toggle('valid',   valid && emailInput.value !== '');
  emailInput.classList.toggle('invalid', !valid && emailInput.value !== '');
  emailError.textContent = '';
});

passwordInput.addEventListener('input', () => {
  const val     = passwordInput.value;
  const results = checkPasswordRules(val);

  // Update requirement indicators
  for (const [key, rule] of Object.entries(rules)) {
    rule.element.classList.toggle('met', results[key]);
  }

  const valid = Object.values(results).every(Boolean);
  passwordInput.classList.toggle('valid',   valid && val !== '');
  passwordInput.classList.toggle('invalid', !valid && val !== '');
  passwordError.textContent = '';
});

// =====================
// Show / hide password
// =====================
toggleBtn.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';

  // Swap icon (closed-eye when visible, open-eye when hidden)
  const icon = document.getElementById('eyeIcon');
  if (isPassword) {
    // Eye with slash (password visible)
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.44 18.44 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    `;
  } else {
    // Open eye
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    `;
  }
});

// =====================
// Form submission
// =====================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  let hasError = false;

  // --- Email validation ---
  if (!emailInput.value.trim()) {
    emailError.textContent = 'El usuario es obligatorio.';
    emailInput.classList.add('invalid');
    hasError = true;
  } else if (!isValidEmail(emailInput.value)) {
    emailError.textContent = 'Ingresa un correo electrónico válido.';
    emailInput.classList.add('invalid');
    hasError = true;
  }

  // --- Password validation ---
  if (!passwordInput.value) {
    passwordError.textContent = 'La contraseña es obligatoria.';
    passwordInput.classList.add('invalid');
    hasError = true;
  } else if (!isValidPassword(passwordInput.value)) {
    const missing = [];
    const results = checkPasswordRules(passwordInput.value);
    if (!results.upper)   missing.push('una letra mayúscula');
    if (!results.number)  missing.push('un número');
    if (!results.special) missing.push('un carácter especial (!, @, #, $)');
    passwordError.textContent = `La contraseña debe incluir: ${missing.join(', ')}.`;
    passwordInput.classList.add('invalid');
    hasError = true;
  }

  if (hasError) {
    successMsg.classList.remove('show');
    return;
  }

  // --- Enviar al backend ---
  const submitBtn = form.querySelector('.submit-btn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Verificando...';

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:    emailInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Error devuelto por el backend
      successMsg.classList.remove('show');
      emailError.textContent = data.error || 'Error en el servidor.';
    } else {
      // Éxito: mostrar token
      successMsg.classList.add('show');
      successMsg.innerHTML = `
        <strong>¡Inicio de sesión exitoso!</strong><br/>
        <span class="token-label">JWT Token:</span>
        <code class="token-value">${data.token}</code>
      `;
      form.reset();

      // Reset visual states
      emailInput.classList.remove('valid', 'invalid');
      passwordInput.classList.remove('valid', 'invalid');
      Object.values(rules).forEach(r => r.element.classList.remove('met'));
    }
  } catch (err) {
    successMsg.classList.remove('show');
    emailError.textContent = 'No se pudo conectar con el servidor. ¿Está iniciado el backend?';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Entrar';
  }
});
