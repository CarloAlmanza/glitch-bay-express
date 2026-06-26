import { db } from "../config/db.js";
import { queryCatIndex, queryCatShow } from "../src/utils/query.js";





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
    const searchedCategory = request.params.id;
    console.log(searchedCategory);

    try {
        const [result] = await db.execute(queryCatShow, [searchedCategory]);
        const category = result[0]

        response
            .json({
                error: null,
                result: category
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
