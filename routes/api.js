const express = require('express');
const router = express.Router();
const db = require('../db/database');

// 获取所有数据（API）
router.get('/items', (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC', (err, items) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(items);
  });
});

// 获取图表数据
router.get('/chart-data', (req, res) => {
  db.all('SELECT name, value FROM items', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    const labels = rows.map(row => row.name);
    const data = rows.map(row => row.value);
    
    res.json({
      labels: labels,
      datasets: [{
        label: '数值',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    });
  });
});

// 添加新数据
router.post('/items', (req, res) => {
  const { name, value } = req.body;
  
  if (!name || value === undefined) {
    return res.status(400).json({ error: 'Name and value are required' });
  }
  
  db.run('INSERT INTO items (name, value) VALUES (?, ?)', [name, value], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ id: this.lastID, name, value });
  });
});

module.exports = router;
