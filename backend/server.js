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
  scadenze: path.join(DATA_DIR, 'scadenze.json'),
  proprieta: path.join(DATA_DIR, 'proprieta.json'),
  documenti: path.join(DATA_DIR, 'documenti.json'),
  spese: path.join(DATA_DIR, 'spese.json'),
  eventi: path.join(DATA_DIR, 'eventi.json'),
  contatti: path.join(DATA_DIR, 'contatti.json'),
  veicoli: path.join(DATA_DIR, 'veicoli.json'),
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
app.get('/api/scadenze', (req, res) => {
  const scadenze = readJSONFile(FILES.scadenze);
  res.json(scadenze);
});

app.post('/api/scadenze', (req, res) => {
  const scadenze = readJSONFile(FILES.scadenze);
  const newItem = { ...req.body, id: Date.now().toString() };
  scadenze.push(newItem);
  if (writeJSONFile(FILES.scadenze, scadenze)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio scadenza' });
  }
});

app.put('/api/scadenze/:id', (req, res) => {
  const scadenze = readJSONFile(FILES.scadenze);
  const idx = scadenze.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Scadenza non trovata' });
  scadenze[idx] = { ...scadenze[idx], ...req.body };
  if (writeJSONFile(FILES.scadenze, scadenze)) {
    res.json(scadenze[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento scadenza' });
  }
});

app.delete('/api/scadenze/:id', (req, res) => {
  let scadenze = readJSONFile(FILES.scadenze);
  const idx = scadenze.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Scadenza non trovata' });
  const deleted = scadenze[idx];
  scadenze = scadenze.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.scadenze, scadenze)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione scadenza' });
  }
});

// PROPRIETÀ API
app.get('/api/proprieta', (req, res) => {
  const proprieta = readJSONFile(FILES.proprieta);
  res.json(proprieta);
});

app.post('/api/proprieta', (req, res) => {
  const proprieta = readJSONFile(FILES.proprieta);
  const newItem = { ...req.body, id: Date.now().toString() };
  proprieta.push(newItem);
  if (writeJSONFile(FILES.proprieta, proprieta)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio proprietà' });
  }
});

app.put('/api/proprieta/:id', (req, res) => {
  const proprieta = readJSONFile(FILES.proprieta);
  const idx = proprieta.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Proprietà non trovata' });
  proprieta[idx] = { ...proprieta[idx], ...req.body };
  if (writeJSONFile(FILES.proprieta, proprieta)) {
    res.json(proprieta[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento proprietà' });
  }
});

app.delete('/api/proprieta/:id', (req, res) => {
  let proprieta = readJSONFile(FILES.proprieta);
  const idx = proprieta.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Proprietà non trovata' });
  const deleted = proprieta[idx];
  proprieta = proprieta.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.proprieta, proprieta)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione proprietà' });
  }
});

// DOCUMENTI API
app.get('/api/documenti', (req, res) => {
  const documenti = readJSONFile(FILES.documenti);
  res.json(documenti);
});

app.post('/api/documenti', (req, res) => {
  const documenti = readJSONFile(FILES.documenti);
  const newItem = { ...req.body, id: Date.now().toString() };
  documenti.push(newItem);
  if (writeJSONFile(FILES.documenti, documenti)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio documento' });
  }
});

app.put('/api/documenti/:id', (req, res) => {
  const documenti = readJSONFile(FILES.documenti);
  const idx = documenti.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Documento non trovato' });
  documenti[idx] = { ...documenti[idx], ...req.body };
  if (writeJSONFile(FILES.documenti, documenti)) {
    res.json(documenti[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento documento' });
  }
});

app.delete('/api/documenti/:id', (req, res) => {
  let documenti = readJSONFile(FILES.documenti);
  const idx = documenti.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Documento non trovato' });
  const deleted = documenti[idx];
  documenti = documenti.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.documenti, documenti)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione documento' });
  }
});

// CONTATTI API
app.get('/api/contatti', (req, res) => {
  const contatti = readJSONFile(FILES.contatti);
  res.json(contatti);
});

app.delete('/api/contatti/:id', (req, res) => {
  let contatti = readJSONFile(FILES.contatti);
  const index = contatti.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Contatto non trovato' });
  }
  const deleted = contatti[index];
  contatti = contatti.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.contatti, contatti)) {
    res.json(deleted);
  } else {
    res.status(500).json({ message: 'Errore eliminazione contatto' });
  }
});


// VEICOLI API
app.get('/api/veicoli', (req, res) => {
  const veicoli = readJSONFile(FILES.veicoli);
  res.json(veicoli);
});

app.post('/api/veicoli', (req, res) => {
  const veicoli = readJSONFile(FILES.veicoli);
  const newItem = { ...req.body, id: Date.now().toString() };
  veicoli.push(newItem);
  if (writeJSONFile(FILES.veicoli, veicoli)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio veicolo' });
  }
});

app.put('/api/veicoli/:id', (req, res) => {
  const veicoli = readJSONFile(FILES.veicoli);
  const idx = veicoli.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Veicolo non trovato' });
  veicoli[idx] = { ...veicoli[idx], ...req.body };
  if (writeJSONFile(FILES.veicoli, veicoli)) {
    res.json(veicoli[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento veicolo' });
  }
});

app.delete('/api/veicoli/:id', (req, res) => {
  let veicoli = readJSONFile(FILES.veicoli);
  const idx = veicoli.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Veicolo non trovato' });
  const deleted = veicoli[idx];
  veicoli = veicoli.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.veicoli, veicoli)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione veicolo' });
  }
});

// SPESE API
app.get('/api/spese', (req, res) => {
  const spese = readJSONFile(FILES.spese);
  res.json(spese);
});

app.post('/api/spese', (req, res) => {
  const spese = readJSONFile(FILES.spese);
  const newItem = { ...req.body, id: Date.now().toString() };
  spese.push(newItem);
  if (writeJSONFile(FILES.spese, spese)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio spesa' });
  }
});

app.put('/api/spese/:id', (req, res) => {
  const spese = readJSONFile(FILES.spese);
  const idx = spese.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spesa non trovata' });
  spese[idx] = { ...spese[idx], ...req.body };
  if (writeJSONFile(FILES.spese, spese)) {
    res.json(spese[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento spesa' });
  }
});

app.delete('/api/spese/:id', (req, res) => {
  let spese = readJSONFile(FILES.spese);
  const idx = spese.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Spesa non trovata' });
  const deleted = spese[idx];
  spese = spese.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.spese, spese)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione spesa' });
  }
});

// EVENTI API
app.get('/api/eventi', (req, res) => {
  const eventi = readJSONFile(FILES.eventi);
  res.json(eventi);
});

app.post('/api/eventi', (req, res) => {
  const eventi = readJSONFile(FILES.eventi);
  const newItem = { ...req.body, id: Date.now().toString() };
  eventi.push(newItem);
  if (writeJSONFile(FILES.eventi, eventi)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio evento' });
  }
});

app.put('/api/eventi/:id', (req, res) => {
  const eventi = readJSONFile(FILES.eventi);
  const idx = eventi.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento non trovato' });
  eventi[idx] = { ...eventi[idx], ...req.body };
  if (writeJSONFile(FILES.eventi, eventi)) {
    res.json(eventi[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento evento' });
  }
});

app.delete('/api/eventi/:id', (req, res) => {
  let eventi = readJSONFile(FILES.eventi);
  const idx = eventi.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Evento non trovato' });
  const deleted = eventi[idx];
  eventi = eventi.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.eventi, eventi)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione evento' });
  }
});

// BOOKINGS API
app.get('/api/bookings', (req, res) => {
  const bookings = readJSONFile(FILES.bookings);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const bookings = readJSONFile(FILES.bookings);
  const newItem = { ...req.body, id: Date.now().toString() };
  bookings.push(newItem);
  if (writeJSONFile(FILES.bookings, bookings)) {
    res.status(201).json(newItem);
  } else {
    res.status(500).json({ error: 'Errore salvataggio booking' });
  }
});

app.put('/api/bookings/:id', (req, res) => {
  const bookings = readJSONFile(FILES.bookings);
  const idx = bookings.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking non trovato' });
  bookings[idx] = { ...bookings[idx], ...req.body };
  if (writeJSONFile(FILES.bookings, bookings)) {
    res.json(bookings[idx]);
  } else {
    res.status(500).json({ error: 'Errore aggiornamento booking' });
  }
});

app.delete('/api/bookings/:id', (req, res) => {
  let bookings = readJSONFile(FILES.bookings);
  const idx = bookings.findIndex(item => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking non trovato' });
  const deleted = bookings[idx];
  bookings = bookings.filter(item => item.id !== req.params.id);
  if (writeJSONFile(FILES.bookings, bookings)) {
    res.json(deleted);
  } else {
    res.status(500).json({ error: 'Errore eliminazione booking' });
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
  console.log('   - GET/POST/PUT/DELETE /api/scadenze');
  console.log('   - GET/POST/PUT/DELETE /api/proprieta');
  console.log('   - GET/POST/PUT/DELETE /api/documenti');
  console.log('   - GET/POST/PUT/DELETE /api/spese');
  console.log('   - GET/POST/PUT/DELETE /api/eventi');
  console.log('   - GET/POST/PUT/DELETE /api/contatti');
  console.log('   - GET/POST/PUT/DELETE /api/veicoli');
  console.log('   - GET/POST/PUT/DELETE /api/bookings');
  console.log('   - GET/POST/PUT/DELETE /api/workouts');
  console.log('   - GET/PUT /api/profile');
  console.log('   - GET /api/dashboard');
});
