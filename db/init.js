const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
});

// 初始化数据库表
db.serialize(() => {
  // 创建示例数据表
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
      db.close();
      process.exit(1);
    }
  });

  // 检查并插入示例数据
  db.get('SELECT COUNT(*) as count FROM items', (err, row) => {
    if (err) {
      console.error('Error checking items table:', err);
      db.close();
      return;
    }
    
    if (row.count === 0) {
      const sampleData = [
        ['Project A', 100],
        ['Project B', 200],
        ['Project C', 150],
        ['Project D', 300],
        ['Project E', 250]
      ];
      
      const stmt = db.prepare('INSERT INTO items (name, value) VALUES (?, ?)');
      sampleData.forEach(([name, value]) => {
        stmt.run(name, value);
      });
      stmt.finalize((err) => {
        if (err) {
          console.error('Error inserting sample data:', err);
        } else {
          console.log('Sample data inserted successfully');
        }
        db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database initialized successfully at', dbPath);
          }
        });
      });
    } else {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database already initialized at', dbPath);
        }
      });
    }
  });
});
