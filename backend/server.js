const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const todoRoutes = require('./routes/todo');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/todo', todoRoutes);

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILES = {
  deadlines: path.join(DATA_DIR, 'deadlines.json'),
  properties: path.join(DATA_DIR, 'properties.json'),
  documents: path.join(DATA_DIR, 'documents.json'),
  expenses: path.join(DATA_DIR, 'expenses.json'),
  events: path.join(DATA_DIR, 'events.json'),
  contacts: path.join(DATA_DIR, 'contacts.json'),
  vehicles: path.join(DATA_DIR, 'vehicles.json'),
  bookings: path.join(DATA_DIR, 'bookings.json'),
  workouts: path.join(DATA_DIR, 'workouts.json'),
  profile: path.join(__dirname, 'profile.json')
};

// Helper generico per leggere file JSON
function readJSONFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Errore lettura file ${filePath}:`, error);
    return [];
  }
}

// Helper generico per scrivere file JSON
function writeJSONFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Errore scrittura file ${filePath}:`, error);
    return false;
  }
}

// SCADENZE API
app.get('/api/deadlines', (req, res) => {
  const deadlines = readJSONFile(FILES.deadlines);
  res.json(deadlines);
});

app.post('/api/deadlines', (req, res) => {
  const deadlines = readJSONFile(FILES.deadlines);
  const newItem = { ...req.body, id: Date.now().toString() };
  deadlines.push(newItem);
  if (writeJSONFile(FILES.deadlines, deadlines)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio scadenza' });
  }
});

app.put('/api/deadlines/:id', (req, res) => {
  const deadlines = readJSONFile(FILES.deadlines);
  const idx = deadlines.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Scadenza non trovata' });
  deadlines[idx] = { ...deadlines[idx], ...req.body };
  if (writeJSONFile(FILES.deadlines, deadlines)) {
    res.json(deadlines[idx]);
  }
});

app.delete('/api/deadlines/:id', (req, res) => {
  let deadlines = readJSONFile(FILES.deadlines);
  const idx = deadlines.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Scadenza non trovata' });
  const deleted = deadlines[idx];
  deadlines = deadlines.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.deadlines, deadlines)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione scadenza' });
  }
});

// PROPRIETÀ API
app.get('/api/properties', (req, res) => {
  const properties = readJSONFile(FILES.properties);
  res.json(properties);
});

app.post('/api/properties', (req, res) => {
  const properties = readJSONFile(FILES.properties);
  const newItem = { ...req.body, id: Date.now().toString() };
  properties.push(newItem);
  if (writeJSONFile(FILES.properties, properties)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio proprietà' });
  }
});

app.put('/api/properties/:id', (req, res) => {
  const properties = readJSONFile(FILES.properties);
  const idx = properties.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Proprietà non trovata' });
  properties[idx] = { ...properties[idx], ...req.body };
  if (writeJSONFile(FILES.properties, properties)) {
    res.json(properties[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento proprietà' });
  }
});

app.delete('/api/properties/:id', (req, res) => {
  let properties = readJSONFile(FILES.properties);
  const idx = properties.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Proprietà non trovata' });
  const deleted = properties[idx];
  properties = properties.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.properties, properties)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione proprietà' });
  }
});

// DOCUMENTI API
app.get('/api/documents', (req, res) => {
  const documents = readJSONFile(FILES.documents);
  res.json(documents);
});

app.post('/api/documents', (req, res) => {
  const documents = readJSONFile(FILES.documents);
  const newItem = { ...req.body, id: Date.now().toString() };
  documents.push(newItem);
  if (writeJSONFile(FILES.documents, documents)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio documento' });
  }
});

app.put('/api/documents/:id', (req, res) => {
  const documents = readJSONFile(FILES.documents);
  const idx = documents.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Documento non trovato' });
  documents[idx] = { ...documents[idx], ...req.body };
  if (writeJSONFile(FILES.documents, documents)) {
    res.json(documents[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento documento' });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  let documents = readJSONFile(FILES.documents);
  const idx = documents.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Documento non trovato' });
  const deleted = documents[idx];
  documents = documents.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.documents, documents)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione documento' });
  }
});

// SPESE API
app.get('/api/expenses', (req, res) => {
  const expenses = readJSONFile(FILES.expenses);
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const expenses = readJSONFile(FILES.expenses);
  const newItem = { ...req.body, id: Date.now().toString() };
  expenses.push(newItem);
  if (writeJSONFile(FILES.expenses, expenses)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio spesa' });
  }
});

app.put('/api/expenses/:id', (req, res) => {
  const expenses = readJSONFile(FILES.expenses);
  const idx = expenses.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spesa non trovata' });
  expenses[idx] = { ...expenses[idx], ...req.body };
  if (writeJSONFile(FILES.expenses, expenses)) {
    res.json(expenses[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento spesa' });
  }
});

app.delete('/api/expenses/:id', (req, res) => {
  let expenses = readJSONFile(FILES.expenses);
  const idx = expenses.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spesa non trovata' });
  const deleted = expenses[idx];
  expenses = expenses.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.expenses, expenses)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione spesa' });
  }
});

// EVENTI API
app.get('/api/events', (req, res) => {
  const events = readJSONFile(FILES.events).map(event => ({
    ...event,
    startDate: `${event.date}T${event.time}:00`,
    attendees: event.attendees ? Array.from({ length: event.attendees }, (_, i) => `Partecipante ${i + 1}`) : []
  }));
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const events = readJSONFile(FILES.events);
  const newItem = { ...req.body, id: Date.now().toString() };
  events.push(newItem);
  if (writeJSONFile(FILES.events, events)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio evento' });
  }
});

app.put('/api/events/:id', (req, res) => {
  const events = readJSONFile(FILES.events);
  const idx = events.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento non trovato' });
  events[idx] = { ...events[idx], ...req.body };
  if (writeJSONFile(FILES.events, events)) {
    res.json(events[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento evento' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  let events = readJSONFile(FILES.events);
  const idx = events.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento non trovato' });
  const deleted = events[idx];
  events = events.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.events, events)) {
    res.json(deleted);
  }
  else {
    res.status(500).json({ error: 'Errore eliminazione evento' });
  }
});

// VEICOLI API
app.get('/api/vehicles', (req, res) => {
  const vehicles = readJSONFile(FILES.vehicles);
  res.json(vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const vehicles = readJSONFile(FILES.vehicles);
  const newItem = { ...req.body, id: Date.now().toString() };
  vehicles.push(newItem);
  if (writeJSONFile(FILES.vehicles, vehicles)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio veicolo' });
  }
});

app.put('/api/vehicles/:id', (req, res) => {
  const vehicles = readJSONFile(FILES.vehicles);
  const idx = vehicles.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Veicolo non trovato' });
  vehicles[idx] = { ...vehicles[idx], ...req.body };
  if (writeJSONFile(FILES.vehicles, vehicles)) {
    res.json(vehicles[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento veicolo' });
  }
});

app.delete('/api/vehicles/:id', (req, res) => {
  let vehicles = readJSONFile(FILES.vehicles);
  const idx = vehicles.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Veicolo non trovato' });
  const deleted = vehicles[idx];
  vehicles = vehicles.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.vehicles, vehicles)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione veicolo' });
  }
});

// WORKOUTS API
app.get('/api/workouts', (req, res) => {
  const workouts = readJSONFile(FILES.workouts);
  res.json(workouts);
});

app.post('/api/workouts', (req, res) => {
  const workouts = readJSONFile(FILES.workouts);
  const newItem = { ...req.body, id: Date.now().toString() };
  workouts.push(newItem);
  if (writeJSONFile(FILES.workouts, workouts)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio allenamento' });
  }
});

app.put('/api/workouts/:id', (req, res) => {
  const workouts = readJSONFile(FILES.workouts);
  const idx = workouts.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Allenamento non trovato' });
  workouts[idx] = { ...workouts[idx], ...req.body };
  if (writeJSONFile(FILES.workouts, workouts)) {
    res.json(workouts[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento allenamento' });
  }
});

app.delete('/api/workouts/:id', (req, res) => {
  let workouts = readJSONFile(FILES.workouts);
  const idx = workouts.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Allenamento non trovato' });
  const deleted = workouts[idx];
  workouts = workouts.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.workouts, workouts)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione allenamento' });
  }
});

// PROFILE API (mantenuto dal vecchio server)
app.get('/api/profile', (req, res) => {
  const profile = readJSONFile(FILES.profile);
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const currentProfile = readJSONFile(FILES.profile);
  const updatedProfile = { ...currentProfile, ...req.body };
  if (writeJSONFile(FILES.profile, updatedProfile)) {
    res.json(updatedProfile);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento profilo' });
  }
});

// API di riepilogo per la dashboard
app.get('/api/dashboard/summary', (req, res) => {
  try {
    const scadenze = readJSONFile(FILES.scadenze);
    const eventi = readJSONFile(FILES.eventi);
    const spese = readJSONFile(FILES.spese);
    const proprieta = readJSONFile(FILES.proprieta);
    const bookings = readJSONFile(FILES.bookings);
    
    // Calcola scadenze urgenti (prossimi 30 giorni)
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const scadenzeUrgenti = scadenze.filter(s => {
      const scadenza = new Date(s.dueDate);
      return !s.completed && scadenza >= today && scadenza <= thirtyDaysFromNow;
    });
    
    // Calcola eventi prossimi (prossimi 7 giorni)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    const eventiProssimi = eventi.filter(e => {
      const eventoData = new Date(e.date);
      return eventoData >= today && eventoData <= sevenDaysFromNow;
    });
    
    // Calcola spese del mese corrente
    const thisMonth = spese.filter(s => {
      const spesaData = new Date(s.date);
      return spesaData.getMonth() === today.getMonth() && 
             spesaData.getFullYear() === today.getFullYear();
    });
    
    const totaleSpeseMese = thisMonth.reduce((sum, s) => sum + s.amount, 0);
    
    // Calcola valore totale proprietà
    const valoreTotaleProprietà = proprieta.reduce((sum, p) => sum + (p.currentValue || 0), 0);
    
    // Calcola valore totale veicoli
    const veicoli = readJSONFile(FILES.veicoli);
    const valoreTotaleVeicoli = veicoli.reduce((sum, v) => sum + (v.currentValue || 0), 0);
    
    // Calcola dati bookings
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
    const upcomingBookings = bookings.filter(b => new Date(b.checkIn) > new Date()).length;

    // Calcola scadenze prossimi 7 giorni
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingScadenze = scadenze.filter(s => {
        const scadenzaDate = new Date(s.dueDate);
        return scadenzaDate >= today && scadenzaDate <= next7Days;
    }).length;

    // Calcola spese mensili
    const monthlyExpenses = spese.reduce((sum, spesa) => sum + (spesa.amount || 0), 0);
    
    res.json({
      urgentDeadlinesCount: scadenzeUrgenti.length,
      currentMonthExpenses: totaleSpeseMese,
      propertyCount: proprieta.length,
      totalPropertyValue: valoreTotaleProprietà,
      vehicleCount: veicoli.length,
      totalVehicleValue: valoreTotaleVeicoli,
      totalBookings,
      totalRevenue,
      upcomingBookings,
      upcomingScadenze,
      monthlyExpenses,
      lastActivity: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore API dashboard:', error);
    res.status(500).json({ error: 'Errore recupero dati dashboard' });
  }
});

// Middleware per gestire errori 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint non trovato' });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`🚀 Backend VitaApp avviato su http://localhost:${PORT}`);
  console.log(`📁 Dati letti dalla cartella: ${DATA_DIR}`);
  console.log('📋 API disponibili:');
  console.log('   - GET/POST/PUT/DELETE /api/deadlines');
  console.log('   - GET/POST/PUT/DELETE /api/properties');
  console.log('   - GET/POST/PUT/DELETE /api/documents');
  console.log('   - GET/POST/PUT/DELETE /api/expenses');
  console.log('   - GET/POST/PUT/DELETE /api/events');
  console.log('   - GET/POST/PUT/DELETE /api/contacts');
  console.log('   - GET/POST/PUT/DELETE /api/vehicles');
  console.log('   - GET/POST/PUT/DELETE /api/bookings');
  console.log('   - GET/POST/PUT/DELETE /api/workouts');
  console.log('   - GET/PUT /api/profile');
  console.log('   - GET /api/dashboard/summary');
});

// Serve static files from the frontend/dist directory
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));