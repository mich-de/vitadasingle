# Struttura Dati VitaApp

## 📁 Cartella `data/`

Questa cartella contiene tutti i file JSON per memorizzare i dati dell'applicazione VitaApp.

### 📄 File disponibili:

#### 🗓️ `scadenze.json`
Gestisce tutte le scadenze importanti:
- Documenti in scadenza
- Contratti e assicurazioni
- Abbonamenti
- **Campi principali:** id, tipo, nome, dataScadenza, categoria, priorita, note, completato

#### 🏠 `proprieta.json`
Elenco delle proprietà e beni:
- Immobili (case, terreni)
- Veicoli
- Investimenti
- **Campi principali:** id, tipo, valore, note, documenti, spese

#### 📋 `documenti.json`
Archivio documenti personali:
- Documenti d'identità
- Patenti
- Certificati
- **Campi principali:** id, nome, tipo, numero, dataRilascio, dataScadenza, file

#### 💰 `spese.json`
Gestione budget e spese ricorrenti:
- Mutui e prestiti
- Assicurazioni
- Utenze
- **Campi principali:** id, categoria, tipo, importo, frequenza, attivo

#### 📅 `eventi.json`
Calendario eventi e attività:
- Appuntamenti medici
- Scadenze burocratiche
- Vacanze e viaggi
- **Campi principali:** id, titolo, data, tipo, luogo, note, completato

#### 📞 `contatti.json`
Rubrica contatti importanti:
- Medici e specialisti
- Professionisti (avvocati, commercialisti)
- Contatti di emergenza
- **Campi principali:** id, nome, tipo, telefono, email, emergenza

## 🔄 Come utilizzare:

1. **Leggere dati:** Caricare il file JSON specifico
2. **Modificare:** Aggiornare i valori nel JSON
3. **Salvare:** Scrivere il file JSON aggiornato
4. **Aggiungere:** Creare nuovo oggetto con ID univoco

## 📝 Esempio di utilizzo:

```javascript
// Leggere scadenze
const scadenze = JSON.parse(fs.readFileSync('./data/scadenze.json'));

// Aggiungere nuova scadenza
const nuovaScadenza = {
  id: Date.now().toString(),
  tipo: "bolletta",
  nome: "Bolletta luce",
  dataScadenza: "2025-07-31",
  categoria: "utenze",
  priorita: "media",
  note: "Pagamento automatico attivato",
  completato: false
};

scadenze.push(nuovaScadenza);

// Salvare
fs.writeFileSync('./data/scadenze.json', JSON.stringify(scadenze, null, 2));
```

## 🔒 Note importanti:

- Tutti i file sono in formato JSON con indentazione per leggibilità
- Gli ID sono univoci e in formato stringa
- Le date sono in formato ISO (YYYY-MM-DD)
- I valori booleani per campi come "completato" e "attivo"
- Campi "note" per informazioni aggiuntive