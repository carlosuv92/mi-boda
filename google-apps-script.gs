// Google Apps Script - Backend para Invitación de Boda (OPTIMIZADO)
// Instrucciones:
// 1. Crea un nuevo Google Sheet
// 2. Ve a Extensiones > Apps Script
// 3. Pega este código y guarda
// 4. Implementa como Web App (Implementar > Nueva implementación > Tipo: Web App)
// 5. Acceso: Cualquiera
// 6. Copia la URL y agrégala como NEXT_PUBLIC_APPS_SCRIPT_URL en tu .env

// CACHE DE HOJAS - Evita llamadas repetidas a SpreadsheetApp
let CACHED_SS = null;
let CACHED_DATA = {};

function getSpreadsheet() {
  if (!CACHED_SS) {
    CACHED_SS = SpreadsheetApp.getActiveSpreadsheet();
  }
  return CACHED_SS;
}

function getSheetData(sheetName) {
  const key = 'sheet_' + sheetName;
  if (CACHED_DATA[key]) {
    return CACHED_DATA[key];
  }
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (sheet && sheet.getLastRow() > 0) {
    const data = sheet.getDataRange().getValues();
    CACHED_DATA[key] = data;
    return data;
  }
  return [];
}

function clearCache() {
  CACHED_DATA = {};
}

function doPost(e) {
  const startTime = new Date();
  const data = JSON.parse(e.postData.contents);
  const action = data.action;
  
  let result;
  try {
    switch (action) {
      case 'getGuestBySlug':
        result = getGuestBySlug(data.slug);
        break;
      case 'getGuests':
        result = getGuests();
        break;
      case 'createGuest':
        result = createGuest(data.guest);
        break;
      case 'updateGuest':
        result = updateGuest(data.id, data.guest);
        break;
      case 'deleteGuest':
        result = deleteGuest(data.id);
        break;
      case 'submitRSVP':
        result = submitRSVP(data.rsvp);
        break;
      case 'getRSVPs':
        result = getRSVPs();
        break;
      case 'submitSong':
        result = submitSong(data.song);
        break;
      case 'getSongs':
        result = getSongs();
        break;
      case 'getConfig':
        result = getConfig();
        break;
      case 'updateConfig':
        result = updateConfig(data.key, data.value);
        break;
      case 'getTimeline':
        result = getTimeline();
        break;
      case 'getGallery':
        result = getGallery();
        break;
      default:
        result = { error: 'Acción no válida' };
    }
  } catch (error) {
    result = { error: error.toString() };
  }
  
  return jsonResponse(result);
}

function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'API de Boda activa' });
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// GUESTS
function getSheetByName(name) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Agregar headers
    const headers = getHeadersForSheet(name);
    if (headers) {
      sheet.appendRow(headers);
    }
  }
  return sheet;
}

function getHeadersForSheet(name) {
  const headers = {
    'Invitados': ['id', 'slug', 'nombre', 'apellidos', 'telefono', 'email', 'acompanantes_autorizados', 'estado'],
    'RSVP': ['guest_id', 'estado', 'acompanantes_confirmados', 'total_confirmados', 'fecha', 'comentario'],
    'Canciones': ['guest_id', 'guest_name', 'cancion', 'artista', 'comentario'],
    'Configuracion': ['clave', 'valor'],
    'Timeline': ['id', 'hora', 'titulo', 'descripcion', 'icono'],
    'Galeria': ['id', 'url', 'descripcion', 'tipo']
  };
  return headers[name] || null;
}

function getGuestBySlug(slug) {
  const data = getSheetData('Invitados');
  if (data.length === 0) return { data: null };
  
  const headers = data[0];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === slug) {
      const guest = {};
      headers.forEach((h, idx) => { guest[h] = data[i][idx]; });
      return { data: guest };
    }
  }
  return { data: null };
}

function getGuests() {
  const data = getSheetData('Invitados');
  if (data.length <= 1) return { data: [] };
  
  const headers = data[0];
  const guests = [];
  for (let i = 1; i < data.length; i++) {
    const guest = {};
    headers.forEach((h, idx) => { guest[h] = data[i][idx]; });
    guests.push(guest);
  }
  return { data: guests };
}

function createGuest(guest) {
  const sheet = getSheetByName('Invitados');
  const id = Utilities.getUuid();
  sheet.appendRow([
    id, guest.slug, guest.nombre, guest.apellidos,
    guest.telefono, guest.email, guest.acompanantes_autorizados || 0, 'pendiente'
  ]);
  clearCache();
  return { data: { id, ...guest, estado: 'pendiente' } };
}

function updateGuest(id, guest) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Invitados');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      if (guest.nombre) sheet.getRange(i + 1, 3).setValue(guest.nombre);
      if (guest.apellidos) sheet.getRange(i + 1, 4).setValue(guest.apellidos);
      if (guest.telefono !== undefined) sheet.getRange(i + 1, 5).setValue(guest.telefono);
      if (guest.email !== undefined) sheet.getRange(i + 1, 6).setValue(guest.email);
      if (guest.acompanantes_autorizados !== undefined) sheet.getRange(i + 1, 7).setValue(guest.acompanantes_autorizados);
      if (guest.estado) sheet.getRange(i + 1, 8).setValue(guest.estado);
      if (guest.slug) sheet.getRange(i + 1, 2).setValue(guest.slug);
      clearCache();
      return { data: { id, ...guest } };
    }
  }
  return { error: 'Invitado no encontrado' };
}

function deleteGuest(id) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Invitados');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      clearCache();
      return { success: true };
    }
  }
  return { error: 'Invitado no encontrado' };
}

// RSVP
function submitRSVP(rsvp) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('RSVP');
  if (!sheet) {
    getSheetByName('RSVP');
  }
  
  const total_confirmados = 1 + (rsvp.acompanantes_confirmados || 0);
  const fecha = new Date().toISOString().split('T')[0];
  
  sheet.appendRow([
    rsvp.guest_id, rsvp.estado, rsvp.acompanantes_confirmados || 0,
    total_confirmados, fecha, rsvp.comentario || ''
  ]);
  
  // Update guest status
  const guestSheet = ss.getSheetByName('Invitados');
  const guestData = guestSheet.getDataRange().getValues();
  for (let i = 1; i < guestData.length; i++) {
    if (guestData[i][0] === rsvp.guest_id) {
      const estado = rsvp.estado === 'ACEPTADO' ? 'confirmado' : 'rechazado';
      guestSheet.getRange(i + 1, 8).setValue(estado);
      break;
    }
  }
  
  clearCache();
  return { data: { guest_id: rsvp.guest_id, total_confirmados, fecha } };
}

function getRSVPs() {
  const data = getSheetData('RSVP');
  if (data.length <= 1) return { data: [] };
  
  const headers = data[0];
  const rsvps = [];
  for (let i = 1; i < data.length; i++) {
    const rsvp = {};
    headers.forEach((h, idx) => { rsvp[h] = data[i][idx]; });
    rsvps.push(rsvp);
  }
  return { data: rsvps };
}

// SONGS
function submitSong(song) {
  const sheet = getSheetByName('Canciones');
  sheet.appendRow([song.guest_id, song.guest_name, song.cancion, song.artista, song.comentario || '']);
  return { data: song };
}

function getSongs() {
  const data = getSheetData('Canciones');
  if (data.length <= 1) return { data: [] };
  
  const headers = data[0];
  const songs = [];
  for (let i = 1; i < data.length; i++) {
    const song = {};
    headers.forEach((h, idx) => { song[h] = data[i][idx]; });
    songs.push(song);
  }
  return { data: songs };
}

// CONFIG
function getConfig() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Configuracion');
  if (!sheet || sheet.getLastRow() <= 1) return { data: [] };
  
  const lastRow = sheet.getLastRow();
  const config = [];
  for (let i = 2; i <= lastRow; i++) {
    const clave = sheet.getRange(i, 1).getDisplayValue();
    const valor = sheet.getRange(i, 2).getDisplayValue();
    config.push({ clave, valor });
  }
  return { data: config };
}

function updateConfig(key, value) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Configuracion');
  if (!sheet) {
    getSheetByName('Configuracion');
  }
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      clearCache();
      return { data: { key, value } };
    }
  }
  
  sheet.appendRow([key, value]);
  clearCache();
  return { data: { key, value } };
}

// TIMELINE
function getTimeline() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Timeline');
  if (!sheet || sheet.getLastRow() <= 1) return { data: [] };
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const events = [];
  for (let i = 2; i <= lastRow; i++) {
    const event = {};
    for (let j = 1; j <= lastCol; j++) {
      event[headers[j - 1]] = sheet.getRange(i, j).getDisplayValue();
    }
    events.push(event);
  }
  return { data: events };
}

// GALLERY
function getGallery() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Galeria');
  if (!sheet || sheet.getLastRow() <= 1) return { data: [] };
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const images = [];
  for (let i = 2; i <= lastRow; i++) {
    const image = {};
    for (let j = 1; j <= lastCol; j++) {
      image[headers[j - 1]] = sheet.getRange(i, j).getDisplayValue();
    }
    images.push(image);
  }
  return { data: images };
}
