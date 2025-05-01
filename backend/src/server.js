const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./src/database.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    
    // Create initial table
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        location TEXT,
        quantity INTEGER DEFAULT 0,
        status TEXT CHECK(status IN ('In Stock', 'Low Stock', 'Out of Stock')) DEFAULT 'In Stock'
      )
    `);
  }
});

// Helper function to update item status based on quantity
function determineStatus(quantity) {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= 5) return 'Low Stock';
  return 'In Stock';
}

// Routes
app.get('/api/items', (req, res) => {
  const { search, category, location, sort, direction } = req.query;
  
  let query = 'SELECT * FROM items';
  const params = [];
  const conditions = [];
  
  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }
  
  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }
  
  if (location && location !== 'All') {
    conditions.push('location = ?');
    params.push(location);
  }
  
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  
  if (sort) {
    query += ` ORDER BY ${sort} ${direction || 'asc'}`;
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    totalItems: 0,
    activeLocations: 0,
    lowStockItems: 0,
    pendingTransfers: 0 // This will be implemented later with transfers feature
  };
  
  db.get('SELECT COUNT(*) as total FROM items', [], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalItems = row.total;
    
    db.get('SELECT COUNT(DISTINCT location) as locations FROM items', [], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.activeLocations = row.locations;
      
      db.get('SELECT COUNT(*) as lowStock FROM items WHERE status = ?', ['Low Stock'], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.lowStockItems = row.lowStock;
        res.json(stats);
      });
    });
  });
});

app.post('/api/items', (req, res) => {
  const { name, category, location, quantity } = req.body;
  const id = Date.now().toString(); // Simple unique ID generation
  const status = determineStatus(quantity);
  
  db.run(
    'INSERT INTO items (id, name, category, location, quantity, status) VALUES (?, ?, ?, ?, ?, ?)',
    [id, name, category, location, quantity, status],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id });
    }
  );
});

app.put('/api/items/:id', (req, res) => {
  const { name, category, location, quantity } = req.body;
  const status = determineStatus(quantity);
  
  db.run(
    'UPDATE items SET name = ?, category = ?, location = ?, quantity = ?, status = ? WHERE id = ?',
    [name, category, location, quantity, status, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Item not found' });
        return;
      }
      res.json({ id: req.params.id });
    }
  );
});

app.delete('/api/items/:id', (req, res) => {
  db.run('DELETE FROM items WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ id: req.params.id });
  });
});

// Get categories and locations for filters
app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM items WHERE category IS NOT NULL ORDER BY category', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(['All', ...rows.map(row => row.category)]);
  });
});

app.get('/api/locations', (req, res) => {
  db.all('SELECT DISTINCT location FROM items WHERE location IS NOT NULL ORDER BY location', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(['All', ...rows.map(row => row.location)]);
  });
});

module.exports = app;