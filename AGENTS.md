# AGENTS.md - Proyecto mi-boda

## Descripción
Aplicación de invitación de boda construida con Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Mongoose/MongoDB, Framer Motion y Cloudinary.

## Estructura del proyecto

```
app/
├── layout.tsx                    # Root layout (fonts: Cormorant, Tangerine, Courgette, Noto Sans)
├── page.tsx                      # Página genérica (sin contexto de guest)
├── globals.css                   # Tailwind v4 + variables CSS (tema de colores)
├── [slug]/page.tsx               # Redirect /slug → /invitacion/slug
├── invitacion/[slug]/page.tsx    # Invitación personalizada (fetch guest por slug)
├── sube-tus-fotos/page.tsx       # Upload de fotos público
├── admin/                        # Panel administrativo
│   ├── layout.tsx                # Shell admin (sidebar + mobile nav, auth check)
│   ├── login/                    # Login admin
│   ├── guests/page.tsx           # CRUD de invitados
│   ├── songs/page.tsx            # Visor de canciones sugeridas
│   ├── rsvp/                     # Gestión RSVP
│   ├── gallery/                  # Gestión galería
│   └── config/                   # Configuración de boda
├── api/                          # Rutas API (todas con MongoDB)
│   ├── guests/route.ts           # GET (list/by slug) + POST
│   ├── guests/[id]/route.ts      # PUT + DELETE
│   ├── songs/route.ts            # GET (con lookup de guests) + POST
│   ├── rsvps/route.ts            # GET + POST
│   └── ...

components/
├── sections/                     # Componentes de sección
│   ├── InvitationContent.tsx     # Layout principal (compone todas las secciones)
│   ├── SongRequest.tsx           # Formulario de sugerencia de canción
│   ├── RSVP.tsx                  # Formulario de confirmación
│   ├── GuestPhotoUpload.tsx      # Upload de fotos con Cloudinary
│   └── ...
├── ui/                           # Primitivas UI reutilizables
│   ├── Section.tsx               # Wrapper con animación scroll
│   ├── Countdown.tsx
│   └── ...
└── icons/                        # Iconos SVG

lib/
├── db.ts                         # Conexión MongoDB/Mongoose singleton
├── api.ts                        # Funciones client-side para llamadas API
├── utils.ts                      # Utilidades: slugify, sanitizePhone, formatDate
├── cloudinary.ts                 # Config Cloudinary server-side
└── models/                       # Modelos Mongoose
    ├── Song.ts                   # guest_id, guest_name, cancion, artista, comentario
    ├── Guest.ts                  # slug, nombre, apellidos, telefono, email, estado, lado, acompanantes_*
    ├── RSVP.ts                   # guest_id, estado, acompanantes_*, comentario
    ├── Config.ts                 # key-value (clave/valor)
    ├── Gallery.ts                # url, descripcion, tipo, subido_por, aprobado
    └── Timeline.ts               # hora, titulo, descripcion, icono

types/index.ts                    # Interfaces TypeScript (Guest, RSVP, SongSuggestion, etc.)
```

## Modelos de datos

### Guest
- `id` (virtual de `_id`), `slug` (unique), `nombre`, `apellidos`, `telefono`, `email`
- `acompanantes_autorizados`, `acompanantes_confirmados`, `acompanantes_nombres[]`
- `estado`: 'pendiente' | 'confirmado' | 'rechazado'
- `lado`: 'novio' | 'novia'

### Song
- `guest_id` (string, referencia al guest), `guest_name`, `cancion`, `artista`, `comentario`

### RSVP
- `guest_id` (unique), `estado`: 'ACEPTADO' | 'RECHAZADO' | 'PENDIENTE'
- `acompanantes_confirmados`, `acompanantes_nombres[]`, `total_confirmados`, `comentario`

## Autenticación
- Middleware en `middleware.ts` usa cookies para auth admin
- Endpoints públicos: `GET /api/songs`, `POST /api/songs`, `GET /api/guests?slug=...`
- Resto de endpoints requieren cookie de admin

## Stack
- Next.js 16.2.9 (App Router, todo client-side rendering)
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- Mongoose 8.24.1 / MongoDB
- Framer Motion (animaciones)
- react-hook-form + Zod (formularios)
- Cloudinary (imágenes)
- Lucide React (iconos)

## Colores del tema (globals.css)
- `cream`: #fafaf8, `cream-dark`: #f0ede8, `white-off`: #f7f5f2
- `charcoal`: #2d2d2d, `charcoal-light`: #4a4a4a
- `principal`: #93b0e7 (azul suave), `detalle`: #FFEDA2 (dorado)
- `text-primary`: #1a1a1a, `text-secondary`: #6b6560, `text-light`: #9a9590

## Convenciones
- Fonts: Cormorant Garamond (principal), Tangerine (decorativo), Dancing Script, Courgette, Noto Sans
- Formularios usan react-hook-form + Zod
- Animaciones con Framer Motion (viewport={{ once: true }})
- Mobile-first con breakpoints `sm:`, `md:`, `lg:`
- Admin panel: cards en mobile, tablas en desktop
