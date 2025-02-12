// backend/server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Servir FullCalendar desde node_modules
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));


// Configuración de credenciales
const CREDENTIALS = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  //private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.CLIENT_CERT_URL
};

// Crear cliente de autenticación
const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});

// Crear cliente de Calendar
const calendar = google.calendar({ version: 'v3', auth });

//Probar el cliente
/*
auth.getClient()
  .then(() => console.log('Autenticación exitosa'))
  .catch(error => console.error('Error en la autenticación:', error));
*/

//Obtener token para Hoppscotch.io
/*
  auth.getAccessToken()
  .then(token => console.log('Token de acceso:', token))
  .catch(error => console.error('Error al obtener el token:', error));
*/

// Ruta para obtener eventos
app.get('/api/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    
    const response = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID, // ID del calendario que administras
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });


    //console.log('Respuesta completa:', response.data); // Registra la respuesta completa
    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      location: event.location,
      status: event.status,
      htmlLink: event.htmlLink
    }));

    //console.log("Eventos obtenidos: ", events);
    res.json(events);
  } catch (error) {
    //console.error('Error al obtener eventos:', error.response?.data || error.messager);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});