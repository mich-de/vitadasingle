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
    const deadlines = readJsonFile('deadlines.json');
    const documents = readJsonFile('documents.json');
    const events = readJsonFile('events.json');

    const allItems = [
      ...deadlines.map(item => ({ ...item, type: 'deadline' })),
      ...documents.map(item => ({ ...item, type: 'document' })),
      ...events.map(item => ({ ...item, type: 'event' }))
    ];

    const upcomingItems = allItems
      .filter(item => {
        // Only consider items that have a dueDate and a completed status for this filter
        if (item.type === 'deadline') {
          return !item.completed && new Date(item.dueDate) >= new Date();
        }
        return false; // Exclude documents and events from this specific filter
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    res.json(upcomingItems);
  } catch (error) {
    console.error('Error fetching all items:', error);
    res.status(500).json({ message: 'Error fetching all items' });
  }
});

module.exports = router;