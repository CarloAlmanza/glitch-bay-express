import { db } from '../config/db.js';
import { generateTrackingNumber } from '../src/utils/function.js';
import { insertInvoice, queryInvoiceIndex, queryInvoiceShow, insertUser, insertOrder } from '../src/utils/query.js';




/*
INDEX
*/
export async function index(request, response) {
    try {
        const [result] = await db.query(queryInvoiceIndex);

        response
            .json({
                error: null,
                result: result
            });

    } catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
                error: "Errore nell'esecuzione della richiesta",
                result: null
            });
    }
}



/*
SHOW
*/
export async function show(request, response) {
    try {
        const id = request.params.id;
        const [result] = await db.execute(queryInvoiceShow, [id]);
        //BISOGNA AGGIUNGERE UNA FUNZIONE DI NORMALIZZAZIONE DEI DATI
        if (result.length === 0) {
            response
                .json({
                    error: 'La fattura cercata non esiste',
                    result: null
                })
        }
        response
            .json({
                error: null,
                result: result[0]
            })
    } catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
                error: "Errore nell'esecuzione della richiesta",
                result: null
            });
    }
};


/*
CREATE
*/

export async function store(request, response) {
    try {
        const { payment_methods, firstName, lastName, mail, address, phone, products } = request.body;
        let total_amount = 0;

        for (const product of products) {
            total_amount += product.paid * product.qty;
        }
        const shipping_cost = total_amount < 250 ? 9.99 : 0;
        const tracking_number = generateTrackingNumber();

        await db.beginTransaction();
        const [resultInvoice] = await db.execute(insertInvoice, [total_amount, 'paid', shipping_cost, tracking_number, payment_methods]);
        console.log(resultInvoice)
        const invoice_id = resultInvoice.insertId;
        const [resultUser] = await db.execute(insertUser, [invoice_id, firstName, lastName, mail, address, phone]);
        console.log(resultUser)
        for (const product of products) {
            const { id, paid, qty } = product;
            const [resultOrder] = await db.execute(insertOrder, [id, invoice_id, paid, qty]);
            console.log(resultOrder)
        }
        await db.commit();

        response
            .status(201)
            .json({
                error: null,
                result: `L'ordine é stato creato con successo`,
                data: {
                    invoiceNum: invoice_id,
                    tracking_number:tracking_number
                }
            });

    } catch (error) {
        if (db) await db.rollback();
        console.error(`errore durante la transizione:`,error);
        response
            .status(500)
            .json({
                error: "Errore nell'esecuzione della richiesta",
                result: null
            });
    }
}



/* export const store = (req, res) => {
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
}; */