import { z } from "zod";
import { tool } from "@langchain/core/tools"; // Nota: assicurati che l'import sia aggiornato alla versione core se usi LangChain recente

const identifyRequestTool = tool(
    async ({ categoryQuery }) => {
        console.log(`Analyzing request... Parametro ricevuto: ${categoryQuery}`);
        
        // Se la query è generica, categoryQuery sarà undefined. 
        // In quel caso usiamo una stringa vuota per fare la fetch all'endpoint base.
        const queryString = categoryQuery ? categoryQuery : "";
        const url = `http://localhost:3000/agent${queryString}`;
        
        try {
            const response = await fetch(url);
            
            // I tool di LangChain devono restituire una stringa come output per l'agente
            const data = await response.text(); 
            return data;
        } catch (error) {
            return `Errore durante la fetch: ${error}`;
        }
    },
    {
        name: "identify_request",
        description: "Utility per recuperare i prodotti dal database. Decide autonomamente se filtrare per categorie specifiche o se fare una ricerca globale in base alla richiesta dell'utente.",
        schema: z.object({
            categoryQuery: z.string().optional().describe(
                `Determina se l'utente sta cercando prodotti filtrando per categorie specifiche. 

                LOGICA DI SELEZIONE:
                1. SE l'utente richiede esplicitamente una o più categorie (es. "mostrami gli orologi", "voglio prodotti da scrivania o tascabili"), estrai le categorie e restituisci la stringa di query nel formato '?categories=Categoria1, Categoria2' (es. '?categories=Da Scrivania, Orologi, Tascabili'). Mantieni le maiuscole e i nomi esatti delle categorie dedotte dal contesto.
                2. SE la richiesta dell'utente è generica, basata su criteri globali, ordinamenti o sconti (es. "mostrami i 3 prodotti con lo sconto più alto", "mostrami i 10 prodotti con il prezzo più basso"), NON inserire questo parametro (lascialo indefinito/vuoto). La fetch verrà eseguita sull'endpoint base senza filtri di categoria.`
            ),
        }),
    }
);

export default identifyRequestTool;