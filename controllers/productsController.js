import db from '../config/db.js';

export const index = (req, res) => {
    db.query('SELECT id, name, description, slug, img, price, discount FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

export const show = (req, res) => {
    db.query('SELECT * FROM products WHERE slug = ?', [req.params.slug], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Prodotto non trovato' });
        res.json({ results: results[0] });
    });
};