import db from '../config/db.js';

export const index = (req, res) => {
    db.query('SELECT id, name, description FROM categories', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

export const show = (req, res) => {
    db.query('SELECT * FROM categories WHERE name = ?', [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Categoria non trovata' });
        res.json({ results: results[0] });
    });
};

export const getProducts = (req, res) => {
    const sql = `
        SELECT p.id, p.name, p.description, p.slug, p.img, p.price, p.discount
        FROM products p
        JOIN product_category pc ON p.id = pc.id_product
        JOIN categories c ON pc.id_category = c.id
        WHERE c.name = ?
    `;
    db.query(sql, [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};