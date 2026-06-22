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