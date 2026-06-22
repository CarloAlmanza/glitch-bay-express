import { db } from "../config/db.js";
import { queryCatIndex, queryCatShow, queryUserShow } from "../src/utils/query.js";





/*
INDEX
*/
async function index(request, response) {
    try {
        const [result] = await db.query(queryCatIndex);
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


/*
SHOW
*/
async function show(request, response) {
    const id = request.params.id
    try {
        const [result] = await db.execute(queryUserShow, [id]);
        if(result.length === 0){
            response
                .json({
                    error: `L'utente cercato non esiste`,
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
                error: `Errore nell'esecuzione della richiesta`,
                result: null
            });
    }

};

export { index, show };