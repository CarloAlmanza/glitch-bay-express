import { db } from "../config/db.js";
import { categoryCheckQuery } from "../src/utils/query.js";




async function categoryCheck(request, response, next) {
    try {
        const { category } = request.query;
        console.log(category);
        


        if (!category) {
            request.category = null;
            return next();
        }
        const [result] = await db.execute(categoryCheckQuery,[category]);
        console.log(result);
        

        if (result.length === 0) {
            return response
                .status(404)
                .json({
                error: "La categoria specificata non esiste",
                result: null
                });
        } else {
            request.category = result[0].name;
        }
        next();

    } catch (error) {
        console.error(error);
        response
            .status(500)
            .json({
                error: "Errore interno del server durante il controllo categoria",
                result: null
            });
    }
};

export default categoryCheck