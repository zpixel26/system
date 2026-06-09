const express = require('express');
const router = express.Router();
const db = require('../db/database');

// 首页
router.get('/', (req, res) => {
  db.all('SELECT * FROM items ORDER BY created_at DESC', (err, items) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).send('Database error');
    }
    res.render('index', { title: '数据展示', items: items });
  });
});

module.exports = router;
