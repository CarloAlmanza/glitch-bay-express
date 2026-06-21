import { db } from "../../config/db.js";
import { querySelectSlugs } from "./query.js";

export async function getSlugs() {
        const [result] = await db.query(querySelectSlugs);
        
        if (!result) {
            throw new Error(message, `Errore nel caricamento dati`);
        }

        return result;
        
};