import {db} from "../config/db.js";
import { queryProductsClaude } from "../src/utils/agentQuery.js";


export async function index(request, response) {
    const { categories } = request;
    let finalQuery = queryProductsClaude;
    if (!categories) finalQuery += `WHERE 1=1`

    if ( categories ) {
        for (let i = 0; i < categories.length; i++) {
            i === 0 ? finalQuery += `WHERE categories.name = ?` : finalQuery += ` OR categories.name = ?`;
        }
    }

    try {
        const [result] = await db.query(finalQuery, categories);
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
                error: `Errore nell'esecuzione della richiesta`,
                result: null
            })
    }
};