# Actividad 2 - Programación Web II

Formulario de login con validación en el cliente y generación de JWT en el backend.

## Estructura del proyecto

```
JWT-Token/
├── front-end/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── back-end/
    ├── server.js
    └── package.json
```

## Parte 1 - Frontend

Formulario de login con validación en el cliente.

**Reglas de validación:**

- **Usuario:** debe tener formato de correo electrónico válido (ej. `usuario@correo.com`)
- **Contraseña:** debe contener al menos:
  - Una letra mayúscula
  - Un número
  - Un carácter especial (`!`, `@`, `#`, `$`)

**Características:**
- Indicadores visuales en tiempo real para cada requisito de la contraseña
- Campos con retroalimentación visual (verde/rojo) mientras el usuario escribe
- Botón para mostrar/ocultar la contraseña

## Parte 2 - Backend

Servidor Node.js con Express que genera un JWT firmado.

**Endpoint:**

```
POST http://localhost:3000/login
```

**Body (JSON):**
```json
{
  "email": "usuario@correo.com",
  "password": "Password1!"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Autenticación exitosa.",
  "token": "<JWT>"
}
```

El backend valida nuevamente las reglas del formulario y firma el token con una clave secreta usando el algoritmo `HS256` con expiración de 1 hora.

## Cómo ejecutar

### Backend

```bash
cd back-end
npm install
node server.js
```

El servidor inicia en `http://localhost:3000`.

### Frontend

Abre `front-end/index.html` con Live Server o cualquier servidor estático en el puerto `5500`.

```bash
npx serve front-end -p 5500
```

Accede en: `http://localhost:5500`

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Autenticación | JSON Web Tokens (jsonwebtoken) |
| CORS | cors |
