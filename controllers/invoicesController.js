import db from '../config/db.js';

export const index = (req, res) => {
    db.query('SELECT * FROM invoices ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
};

export const show = (req, res) => {
    db.query('SELECT * FROM invoices WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Fattura non trovata' });
        res.json({ results: results[0] });
    });
};

export const store = (req, res) => {
    const { total_amount, status, shipping_cost, tracking_number, payment_method, user } = req.body;

    db.beginTransaction((err) => {
        if (err) return res.status(500).json({ error: err.message });

        const invoiceSql = `
            INSERT INTO invoices (total_amount, status, shipping_cost, tracking_number, payment_method)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.query(invoiceSql, [total_amount, status || 'unpaid', shipping_cost || 9.99, tracking_number, payment_method], (err, result) => {
            if (err) {
                db.rollback();
                return res.status(500).json({ error: err.message });
            }

            const invoiceId = result.insertId;

            if (user) {
                const userSql = `
                    INSERT INTO users (id_invoice, name, surname, mail, address, phone)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                db.query(userSql, [invoiceId, user.name, user.surname, user.mail, user.address, user.phone], (err) => {
                    if (err) {
                        db.rollback();
                        return res.status(500).json({ error: err.message });
                    }
                    db.commit();
                    res.status(201).json({ message: 'Fattura creata', id: invoiceId });
                });
            } else {
                db.commit();
                res.status(201).json({ message: 'Fattura creata', id: invoiceId });
            }
        });
    });
};