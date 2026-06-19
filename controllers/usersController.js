import db from '../config/db.js';

export const show = (req, res) => {
    db.query('SELECT id, name, surname, mail, address, phone FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Utente non trovato' });
        res.json({ results: results[0] });
    });
};