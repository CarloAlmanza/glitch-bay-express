import { db } from "../../config/db.js";
import { queryCatIndex, queryInvoiceIndex, querySelectSlugs, queryUserIndex } from "./query.js";


const invoiceOBJ = {
    payment_methods: '',
    firstName: '',
    lastName: '',
    mail: '',
    address: '',
    phone: '',
    products: [{ id: '', paid: '', qty: '' }]
}

export function validatorKeys(json) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
        return 'Il JSON passato non é un ogetto valido'
    }

    const defaultOBJKeys = Object.keys(invoiceOBJ);
    const jsonKeys = Object.keys(json);

    if (defaultOBJKeys.length !== jsonKeys.length) return `La struttura dell'oggetto non é valida (numero di chiavi errato)`;

    for (const key of defaultOBJKeys) {
        if (!json.hasOwnProperty(key)) {
            return `Chiave mancante nell'oggetto: ${key}`;
        }
    }

    if (!Array.isArray(json.products) || json.products.length === 0) {
        return `la proprietá products deve essere un array e non puó essere vuoto`;
    }

    const jsonProductsKeys = Object.keys(json.products[0]);

    for (let i = 0; i < json.products.length; i++) {
        const product = json.products[i];
        if (typeof product !== 'object' || product === null || Array.isArray(product)) {
            return `Il prodotto all'indice ${i} deve essere un ogetto`;
        }

        const productKeys = Object.keys(product);
        if (productKeys.length !== jsonProductsKeys.length) {
            return `Lastruttura del prodotto all'indice ${i} non é valida`
        }

        for (const pkey of jsonProductsKeys) {
            if (!product.hasOwnProperty(pkey)) {
                return `Chiave mancante nel prodotto all'indice ${i}: ${pkey}`;
            }
        }
    }
    return null;
}

export function validatorValues(json) {

    const validPayments = ['stripe', 'paypal', 'crypto'];
    if (!validPayments.includes(json.payment_methods)) {
        return "Il campo 'payment_methods' deve essere uno tra: 'stripe', 'paypal', 'crypto'.";
    }

    if (typeof json.firstName !== 'string' || json.firstName.trim() === '' || json.firstName.length > 100) {
        return "Il campo 'firstName' deve essere una stringa non vuota e non superiore a 100 caratteri.";
    }
    if (typeof json.lastName !== 'string' || json.lastName.trim() === '' || json.lastName.length > 100) {
        return "Il campo 'lastName' deve essere una stringa non vuota e non superiore a 100 caratteri.";
    }
    if (typeof json.mail !== 'string' || json.mail.trim() === '') {
        return "Il campo 'mail' deve essere una stringa non vuota.";
    }
    if (typeof json.address !== 'string' || json.address.trim() === '') {
        return "Il campo 'address' deve essere una stringa non vuota.";
    }
    const phoneRegex = /^\+39 \d{3} \d{7}$/;
    if (typeof json.phone !== 'string' || !phoneRegex.test(json.phone)) {
        return "Il campo 'phone' deve rispettare il formato italiano es. '+39 347 9876543'.";
    }



    for (let i = 0; i < json.products.length; i++) {
        const prod = json.products[i];

        if (typeof prod.id !== 'number' || isNaN(prod.id) || prod.id <= 0) {
            return `Il campo 'id' del prodotto all'indice ${i} deve essere un numero maggiore di 0.`;
        }

        if (typeof prod.paid !== 'number' || isNaN(prod.paid) || prod.paid <= 0) {
            return `Il campo 'paid' del prodotto all'indice ${i} deve essere un numero maggiore di 0.`;
        }

        const paidStr = prod.paid.toString();
        const parts = paidStr.split('.');
        if (parts[0].length > 8) {
            return `Il campo 'paid' del prodotto all'indice ${i} non può avere più di 8 cifre intere.`;
        }

        if (parts[1] && parts[1].length > 2) {
            return `Il campo 'paid' del prodotto all'indice ${i} può avere al massimo 2 cifre decimali.`;
        }

        if (typeof prod.qty !== 'number' || isNaN(prod.qty) || prod.qty <= 0) {
            return `Il campo 'qty' del prodotto all'indice ${i} deve essere un numero maggiore di 0.`;
        }
    }

    return null;
}

export function generateTrackingNumber() {
    let randomNumbers = '';

    for (let i = 0; i < 13; i++) {
        randomNumbers += Math.floor(Math.random() * 10);
    }

    return `IT${randomNumbers}`;
}


export async function getSlugs() {
    const [result] = await db.query(querySelectSlugs);

    if (!result) {
        throw new Error(message, `Errore nel caricamento dati`);
    }

    return result;

};

export async function getCategory() {
    const [result] = await db.query(queryCatIndex);

    if (!result) {
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};

export async function getUser() {
    const [result] = await db.query(queryUserIndex);

    if (!result) {
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};

export async function getInvoice() {
    const [result] = await db.query(queryInvoiceIndex);

    if (!result) {
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};


export function formatInvoices(rawData) {
    const invoicesMap = new Map();
    rawData.forEach(row => {
        const invoiceId = row.id;
        if (!invoicesMap.has(invoiceId)) {
            let formattedDate = '';
            if (row.created_at) {
                let formattedDate = '';
                if (row.created_at) {
                    if (row.created_at instanceof Date) {
                        // Se è già un oggetto Date, estraiamo i componenti direttamente
                        const day = String(row.created_at.getDate()).padStart(2, '0');
                        const month = String(row.created_at.getMonth() + 1).padStart(2, '0'); // I mesi partono da 0
                        const year = row.created_at.getFullYear();
                        formattedDate = `${day}/${month}/${year}`;
                    } else if (typeof row.created_at === 'string') {
                        // Se è una stringa, usiamo lo split in sicurezza
                        const datePart = row.created_at.split(' ')[0]; // Prende "2026-06-10"
                        const parts = datePart.split('-');
                        if (parts.length === 3) {
                            const [year, month, day] = parts;
                            formattedDate = `${day}/${month}/${year}`;
                        } else {
                            formattedDate = row.created_at; // Fallback se il formato stringa è strano
                        }
                    }
                }
            }
            invoicesMap.set(invoiceId, {
                id: parseInt(invoiceId, 10),
                total_amount: parseFloat(row.total_amount) || 0,
                status: row.status,
                shipping_cost: parseFloat(row.shipping_cost) || 0,
                created_at: formattedDate,
                tracking_number: row.tracking_number,
                payment_method: row.payment_method,
                user: {
                    name: row.name,
                    surname: row.surname,
                    mail: row.mail,
                    address: row.address,
                    phone: row.phone
                },
                products: []
            });
        }
        let imgUrl = 'https://placehold.co/600x400/png';
        if (row.img && row.img.trim() !== '') {
            imgUrl = `http://localhost:3000/${row.img.trim()}`;
        }
        const productItem = {
            name: row.product_name,
            price: parseFloat(row.price) || 0,
            img: imgUrl,
            qty: parseInt(row.qty, 10) || 0,
            paid: parseFloat(row.paid) || 0
        };
        invoicesMap.get(invoiceId).products.push(productItem);
    });
    return Array.from(invoicesMap.values());
}





export function getTop5Products(invoiceListFormatted) {
    if (!invoiceListFormatted || !Array.isArray(invoiceListFormatted)) {
        return [];
    }
    const orders = invoiceListFormatted;
    const productSales = orders.reduce((acc, order) => {
        if (Array.isArray(order.products)) {
            order.products.forEach(product => {
                const name = product.name;
                const qty = parseInt(product.qty, 10) || 0;
                const price = product.price;
                const img = product.img;
                const discountedPrice = parseFloat(product.paid) || 0; 
                if (name) {
                    if (!acc[name]) {
                        acc[name] = {
                            total_qty: 0,
                            price: price,
                            discounted_price: discountedPrice,
                            img: img
                        };
                    }
                    acc[name].total_qty += qty;
                }
            });
        }
        return acc;
    }, {});
    const sortedProducts = Object.entries(productSales)
        .sort((a, b) => b[1].total_qty - a[1].total_qty)
        // 4. Prendi i primi 5 prodotti
        .slice(0, 5);
    return sortedProducts.map(([name, details]) => ({
        name: name,
        total_qty: details.total_qty,
        price: details.price,
        discounted_price: details.discounted_price,
        img: details.img
    }));
}

export function stringCheck(string) {
    return typeof string === 'string' && string.trim() !== '';
}



export function orderKeyCheck(key){
    const productKeysArray = ['id', 'name', 'slug', 'price', 'discount', 'created_at', 'category'];
    return productKeysArray.includes(key);
}