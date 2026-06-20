import { db } from '../config/db.js';
import { queryProductIndex, queryProductShow } from '../src/utils/query.js';




/*
INDEX
*/
export async function index(request, response) {
    try {
        const [result] = await db.query(queryProductIndex);
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
};


/*
SHOW
*/
export async function show(request, response) {
    try {
        const slug = request.params.slug;
        const [result] = await db.execute(queryProductShow, [slug]);
        if (result.length === 0) {
            response
                .json({
                    error: `Il prodotto cercato non esiste`,
                    result: null
                });
            return
        }
        response
            .json({
                error: null,
                result: result[0]
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
};