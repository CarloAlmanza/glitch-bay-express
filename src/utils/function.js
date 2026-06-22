import { db } from "../../config/db.js";
import { queryCatIndex, queryInvoiceIndex, querySelectSlugs, queryUserIndex } from "./query.js";

export async function getSlugs() {
        const [result] = await db.query(querySelectSlugs);
        
        if (!result) {
            throw new Error(message, `Errore nel caricamento dati`);
        }

        return result;
        
};

export async function getCategory(){
    const [result] = await db.query(queryCatIndex);

    if(!result){
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};

export async function getUser(){
    const [result] = await db.query(queryUserIndex);

    if(!result){
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};

export async function getInvoice(){
    const [result] = await db.query(queryInvoiceIndex);

    if(!result){
        throw new Error(message, `Errore nel caricamento dati`);
    }
    return result;
};