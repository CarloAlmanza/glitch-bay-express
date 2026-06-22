import { db } from "../config/db.js";
import { queryCatIndex, queryCatShow } from "../src/utils/query.js";





/*
INDEX
*/
async function index(request, response) {
    try {
        const [result] = await connection.query(queryCatIndex);
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
    const searchedCategory = request.params.name;
    try {
        const [result] = await connection.execute(queryCatShow, [searchedCategory]);
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

/* export const getProducts = (req, res) => {
    const sql = `
        SELECT p.id, p.name, p.description, p.slug, p.img, p.price, p.discount
        FROM products p
        JOIN product_category pc ON p.id = pc.id_product
        JOIN categories c ON pc.id_category = c.id
        WHERE c.name = ?
    `;
    db.query(sql, [req.params.name], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ results });
    });
}; */