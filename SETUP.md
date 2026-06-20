# Setup del Proyecto - InvitaciÃ³n Digital de Boda

## Pasos para configurar el proyecto

### 1. Instalar dependencias

```bash
cd invitacion-boda-app
npm install
```

### 2. Configurar Google Sheets

#### 2.1 Crear el Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cÃ¡lculo
3. RenÃ³mbrala como "InvitaciÃ³n Boda - Felipe & Lilian"

#### 2.2 Crear las hojas

Crea las siguientes hojas (pestaÃ±as) en el orden exacto:

**Hoja: Invitados**
| id | slug | nombre | apellidos | telefono | email | acompanantes_autorizados | estado |
|----|------|--------|-----------|----------|-------|-------------------------|--------|

**Hoja: RSVP**
| guest_id | estado | acompanantes_confirmados | total_confirmados | fecha | comentario |
|----------|--------|-------------------------|-------------------|-------|------------|

**Hoja: Canciones**
| guest_id | guest_name | cancion | artista | comentario |
|----------|------------|---------|---------|------------|

**Hoja: Configuracion**
| clave | valor |
|-------|-------|

**Hoja: Timeline**
| id | hora | titulo | descripcion | icono |
|----|------|--------|-------------|-------|

**Hoja: Galeria**
| id | url | descripcion | tipo |
|----|-----|-------------|------|

#### 2.3 Agregar datos iniciales a Configuracion

Agrega estas filas en la hoja Configuracion:

| clave | valor |
|-------|-------|
| novio | Felipe |
| novia | Lilian |
| fecha | 2027-04-15 |
| fotoPrincipal | /images/boda-1.png |
| biblia | "Y sobre todo vÃ­stanse de amor, porque es un vÃ­nculo perfecto de uniÃ³n." â€” Colosenses 3:14 |
| mensajeBienvenida | Con nuestro amor, la bendiciÃ³n de Dios y en compaÃ±Ã­a de nuestros padres, los invitamos a celebrar el dÃ­a mÃ¡s especial de nuestras vidas. |
| direccionIglesia | Iglesia San Pedro\nCalle Tarifa y Av. AmÃ©rica |
| horaCeremonia | 11:00 AM |
| direccionRecepcion | JardÃ­n Padilla\nCalle Sucre y 16 de Julio |
| horaRecepcion | 1:00 PM |
| vestimentaHombres | Formal |
| vestimentaMujeres | Formal |
| coloresReservados | Blanco,Crema |
| mensajeRegalos | Nuestro mejor regalo serÃ¡ compartir este dÃ­a contigo, pero si deseas tener un detalle con nosotros, aquÃ­ te dejamos nuestros datos. |
| fechaLimiteRSVP | 10 de mayo |
| mensajeAdultos | Para que todos puedan disfrutar plenamente de esta celebraciÃ³n, nuestro evento serÃ¡ exclusivamente para adultos. Agradecemos mucho su comprensiÃ³n. |

#### 2.4 Agregar datos de Timeline

| id | hora | titulo | descripcion | icono |
|----|------|--------|-------------|-------|
| 1 | 11:00 AM | Ceremonia | Ceremonia religiosa | ceremonia |
| 2 | 12:00 PM | SesiÃ³n de fotos | Momentos para recordar | coctel |
| 3 | 1:00 PM | RecepciÃ³n | Bienvenida y cÃ³ctel | coctel |
| 4 | 3:00 PM | Fiesta | Â¡A bailar! | fiesta |
| 5 | 5:00 PM | Primer baile | Nuestro primer baile | cena |
| 6 | 7:00 PM | Cena | Banquete | cena |
| 7 | 9:00 PM | Brindis | Brindis por los novios | coctel |
| 8 | 11:00 PM | Despedida | Fin de la fiesta | fiesta |

#### 2.5 Implementar Google Apps Script

1. En tu Google Sheet, ve a **Extensiones > Apps Script**
2. Copia el contenido de `google-apps-script.gs` y pÃ©galo en el editor
3. Guarda el proyecto (Ctrl+S o Cmd+S)
4. Haz clic en **Implementar > Nueva implementaciÃ³n**
5. Selecciona **Tipo: AplicaciÃ³n web**
6. Configura:
   - DescripciÃ³n: "API Boda"
   - Ejecutar como: "Yo" (tu cuenta de Google)
   - QuiÃ©n tiene acceso: **"Cualquiera"** (importante para que funcione)
7. Haz clic en **Implementar**
8. Autoriza los permisos cuando se solicite
9. **Copia la URL de la aplicaciÃ³n web** (se ve como: `https://script.google.com/macros/s/XXXXX/exec`)

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

### 5. Agregar invitados de prueba

Desde el panel administrativo (`/admin/login`):
- Usuario: `admin`
- ContraseÃ±a: `boda2027`

Agrega un invitado de prueba:
- Nombre: Juan
- Apellidos: PÃ©rez
- TelÃ©fono: 999999999
- Email: juan@email.com
- AcompaÃ±antes: 2

El slug se generarÃ¡ automÃ¡ticamente: `juan-perez`

Accede a la invitaciÃ³n personalizada: `http://localhost:3000/invitacion/juan-perez`

### 6. Desplegar en Vercel

```bash
npm i -g vercel
vercel
```

O conecta tu repositorio GitHub directamente en [vercel.com](https://vercel.com)

**Importante**: Agrega la variable de entorno `NEXT_PUBLIC_APPS_SCRIPT_URL` en la configuraciÃ³n del proyecto en Vercel.

## Estructura de URLs

| URL | DescripciÃ³n |
|-----|-------------|
| `/` | PÃ¡gina principal de la invitaciÃ³n |
| `/invitacion/[slug]` | InvitaciÃ³n personalizada para un invitado |
| `/admin/login` | Login del panel administrativo |
| `/admin/guests` | GestiÃ³n de invitados |
| `/admin/rsvp` | Confirmaciones y estadÃ­sticas |
| `/admin/songs` | Canciones sugeridas |
| `/admin/config` | ConfiguraciÃ³n general |

## Notas importantes

1. **Google Apps Script**: La primera vez que se ejecuta puede tardar unos segundos en responder. Es normal.
2. **LÃ­mites gratuitos**: Google Apps Script tiene un lÃ­mite de 6 minutos de ejecuciÃ³n por dÃ­a, mÃ¡s que suficiente para una boda.
3. **ImÃ¡genes**: Las imÃ¡genes se pueden alojar en Google Drive (compartidas pÃºblicamente) o en cualquier servicio de hosting de imÃ¡genes.
4. **Seguridad**: Cambia la contraseÃ±a del admin en `.env.local` antes de desplegar en producciÃ³n.
