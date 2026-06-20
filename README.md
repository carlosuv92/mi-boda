# Invitación Digital de Boda

Plataforma profesional de invitaciones digitales para bodas, completamente responsive, con panel administrativo, confirmación de asistencia (RSVP), gestión de invitados y desplegable gratuitamente en Vercel.

## Stack Tecnológico

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Formularios**: React Hook Form + Zod
- **Backend**: Google Sheets via Google Apps Script
- **Hosting**: Vercel (plan gratuito)

## Estructura de Google Sheets

El sistema utiliza un Google Sheet como base de datos con las siguientes hojas:

| Hoja | Descripción |
|------|-------------|
| Invitados | id, slug, nombre, apellidos, telefono, email, acompanantes_autorizados, estado |
| RSVP | guest_id, estado, acompanantes_confirmados, total_confirmados, fecha, comentario |
| Canciones | guest_id, guest_name, cancion, artista, comentario |
| Configuración | clave, valor |
| Timeline | id, hora, titulo, descripcion, icono |
| Galería | id, url, descripcion, tipo |

## Instalación

### 1. Clonar el repositorio

```bash
cd invitacion-boda-app
npm install
```

### 2. Configurar Google Sheets

1. Crea un nuevo Google Sheet
2. Ve a **Extensiones > Apps Script**
3. Copia el contenido de `google-apps-script.gs` y pégalo en el editor
4. Guarda el proyecto
5. Haz clic en **Implementar > Nueva implementación**
6. Selecciona **Tipo: Web App**
7. Configura:
   - Descripción: "API Boda"
   - Ejecutar como: "Yo"
   - Quién tiene acceso: **"Cualquiera"**
8. Copia la URL generada

### 3. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` y agrega la URL de tu Apps Script:

```
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
NEXT_PUBLIC_ADMIN_USER=admin
NEXT_PUBLIC_ADMIN_PASS=boda2027
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 5. Desplegar en Vercel

```bash
npm i -g vercel
vercel
```

O conecta tu repositorio GitHub directamente en [vercel.com](https://vercel.com)

Agrega la variable de entorno `NEXT_PUBLIC_APPS_SCRIPT_URL` en la configuración del proyecto en Vercel.

## Uso

### Página pública
- `/` - Página principal de la invitación
- `/invitacion/[slug]` - Invitación personalizada para un invitado

Ejemplo: `/invitacion/felipe-urcia` muestra "Bienvenido Felipe Urcia y familia"

### Panel administrativo
- `/admin/login` - Login (admin / boda2027 por defecto)
- `/admin/guests` - Gestión de invitados
- `/admin/rsvp` - Confirmaciones y estadísticas
- `/admin/songs` - Canciones sugeridas
- `/admin/config` - Configuración general

## Lógica de Acompañantes

Cada invitado tiene:
- `acompanantes_autorizados`: Número de acompañantes permitidos
- Al confirmar, el invitado responde cuántos acompañantes asistirán (0 a N)
- `total_confirmados = 1 (invitado principal) + acompanantes_confirmados`

Ejemplo:
- Juan tiene 2 acompañantes autorizados
- Si confirma con 1 acompañante: total_confirmados = 2
- Si confirma con 2 acompañantes: total_confirmados = 3

## Paleta de Colores

| Color | Uso |
|-------|-----|
| Crema (#fefcf8) | Fondo principal |
| Blanco roto (#faf8f5) | Secciones alternas |
| Azul pastel (#a8c5d6) | Acentos decorativos |
| Verde olivo (#8b9d77) | Botones y elementos principales |
| Dorado (#c9a96e) | Detalles elegantes |

## Tipografías

- **Títulos**: Playfair Display
- **Nombres**: Great Vibes (script elegante)
- **Contenido**: Inter

## Características

- Diseño mobile-first responsive
- Animaciones suaves con Framer Motion
- Countdown en tiempo real
- Confirmación de asistencia con lógica de acompañantes
- Sugerencia de canciones
- Galería de fotos/videos
- Mesa de regalos con Yape/Plin/Transferencia
- Panel administrativo completo
- Exportación a Excel
- Configuración editable sin código

## Plan Gratuito

Todo el proyecto funciona dentro de los límites gratuitos:
- **Vercel**: Plan Hobby (gratuito)
- **Google Sheets**: Plan personal gratuito (hasta 15GB)
- **Google Apps Script**: 6 minutos de ejecución/día (suficiente para este uso)
