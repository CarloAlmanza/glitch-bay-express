import { db } from '../config/db.js';
import { queryInvoiceIndex, queryProductIndex, queryProductShow, queryProductsFive } from '../src/utils/query.js';
import normalizingProducts from '../src/utils/normalizingData.js';
import { formatInvoices, getTop5Products, orderKeyCheck, stringCheck } from '../src/utils/function.js';



/*
INDEX
*/
export async function index(request, response) {
    const category = request.category;
    const { order, search, direction } = request.query || {};
    
    

    
    const validatedSearch = stringCheck(search) ? search : null;
    const validatedOrderKey = orderKeyCheck(order) ? order : null; 

    let sql = queryProductIndex;
    
    const params = [];

    if (validatedSearch) {
        sql += ` AND products.name LIKE ?`;
        params.push(`%${validatedSearch}%`);
    }

    if (category) {
        sql += ` AND categories.name = ? `;
        params.push(category);
    }

    if (validatedOrderKey && direction === 'DESC') {
        sql += ` ORDER BY products.${validatedOrderKey} DESC`; 
    } else if (validatedOrderKey && direction === 'ASC') {
        sql += ` ORDER BY products.${validatedOrderKey} ASC`;
    }

    try {
        const [result] = await db.query(sql, params);

        if (result.length === 0) {
            return response.json({
                error: "Non ci sono prodotti che rispettano i parametri richiesti",
                result: null
            });
        }

        const productList = normalizingProducts(result);
        return response.json({
            error: null,
            result: productList
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            error: "Errore nell'esecuzione della richiesta",
            result: null
        });
    }
}


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

/*
SHOW top 5 seller
*/

export async function showTopSeller(request, response) {
    try {
        const [result] = await db.query(queryInvoiceIndex);
        const normalized = formatInvoices(result);
        const topSellers = getTop5Products(normalized)
        response.json({
            error: null,
            result: topSellers
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