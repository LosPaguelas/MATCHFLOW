# MatchFlow

Plataforma de empleo estilo LinkedIn/Indeed. Conecta candidatos con empresas y permite hacer matches y reservas.

## Funcionalidades

- **Login y registro** con persistencia de sesión (guard.js)
- **Candidatos**: Ver ofertas, aplicar a vacantes, ver estado de solicitudes (pendiente/aceptada/declinada)
- **Empresas**: Publicar ofertas, ver candidatos, hacer match, reservar candidatos, aceptar o declinar solicitudes
- **Editar perfil**: Tanto candidatos como empresas pueden editar su información
- **Matches**: Las empresas pueden conectar con candidatos (tipo LinkedIn)
- **Reservas**: Las empresas pueden reservar candidatos para sus vacantes

## Requisitos

- Node.js y npm instalados

## Instalación y ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar el servidor (json-server con db.json):
   ```bash
   npm run server
   ```

3. Abrir la aplicación en el navegador:
   - Abre `index.html` directamente o usa un servidor local (ej: Live Server)
   - O sirve los archivos estáticos con: `npx serve .`

## Cuentas de prueba

| Tipo      | Email                    | Contraseña  |
|----------|---------------------------|-------------|
| Candidato| candidato@matchflow.com   | candidato123|
| Empresa  | empresa@matchflow.com     | empresa123  |

## Estructura

```
├── index.html      # Página principal / landing
├── login.html      # Inicio de sesión
├── register.html   # Registro (candidato o empresa)
├── dashboard.html  # Dashboard según tipo de usuario
├── db.json         # Base de datos (json-server)
├── css/style.css   # Estilos (tema azul empleo)
├── js/
│   ├── api.js      # Cliente API para json-server
│   ├── guard.js    # Persistencia de sesión
│   └── dashboard.js# Lógica del dashboard
└── package.json
```

## Tema

Colores profesionales de empleo: azul primario (#0a66c2), verde para acciones positivas, estilo LinkedIn/Indeed.
