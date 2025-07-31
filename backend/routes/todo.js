const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

const readJsonFile = (filename) => {
  const filePath = path.join(dataDir, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

router.get('/all', (req, res) => {
  try {
    const scadenze = readJsonFile('scadenze.json');
    const documenti = readJsonFile('documenti.json');
    const eventi = readJsonFile('eventi.json');

    const allItems = [
      ...scadenze.map(item => ({ ...item, type: 'scadenza' })),
      ...documenti.map(item => ({ ...item, type: 'documento' })),
      ...eventi.map(item => ({ ...item, type: 'evento' }))
    ];

    const upcomingItems = allItems
      .filter(item => !item.completed && new Date(item.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    res.json(upcomingItems);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ message: 'Error fetching all items' });
  }
});

module.exports = router;