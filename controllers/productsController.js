import { db } from '../config/db.js';
import { queryProductIndex, queryProductShow, queryProductsFive } from '../src/utils/query.js';
import normalizingProducts from '../src/utils/normalizingData.js';



/*
INDEX
*/
export async function index(request, response) {
    try {
        const [result] = await db.query(queryProductIndex);
        const normalized = normalizingProducts(result);

        response.json({
            error: null,
            result: normalized
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
            return response.json({
                error: "Il prodotto cercato non esiste",
                result: null
            });
        }
        const normalized = normalizingProducts(result);

        response.json({ error: null, result: normalized[0] });
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
SHOW Five (home)
*/
export async function showFive(request, response) {
    try {
        const [result] = await db.query(queryProductsFive);
        const normalized = normalizingProducts(result);
        response.json({
            error: null,
            result: normalized
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