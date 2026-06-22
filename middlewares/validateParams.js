import { getCategory, getInvoice, getSlugs, getUser } from "../src/utils/function.js";




async function validateParams(req, res, next) {
    try {
    const baseUrl = (req.baseUrl).replace("/", ""); //prendo la base dell'url ovvero l'endpoint (es. products)
    const param = req.params;
    
    const slugList = await getSlugs();
    const catList = await getCategory();
    const userList= await getUser();
    const invoicelist= await getInvoice();
    
    if (baseUrl === "products") {
        if (param.slug.trim() === '') {
            res.status(400).json({
                error: false,
                result: 'lo slug non può essere vuoto'
            });
            return;
        }


        const found = slugList.filter(element => {
            return element.slug === param.slug;
        });

        
        

        if (found.length === 0){
            res.status(404).json({
                error: false,
                result: 'prodotto non trovato'
            });
            return;
        }
        
        
    } else if (baseUrl === "categories"){
        if (param.name.trim() === '') {
            res.status(400).json({
                error: false,
                result: 'il nome della categoria non può essere vuoto'
            });
            return;
        } else if (!isNaN(Number(param.name.trim()))) {
            res.status(400).json({
                error: false,
                result: 'il nome della categoria non può essere un numero'
            });
            return;
        }

        const result = catList.filter(element => {
            return element.name === param.name;
        });

        if (result.length === 0){
            res.status(404).json({
                error: false,
                result: 'categoria non trovata'
            });
            return;
        }
        

    } else if (baseUrl === "users"){ 
        if (param.id.trim() === '') {
            res.status(400).json({
                error: false,
                result: 'il campo id non può essere vuoto'
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                error: false,
                result: `l'id deve essere un numero`
            });
            return;
        }

        const result = userList.filter(element => {
            return element.id === Number(param.id);
        });
        

        if (result.length === 0){
            res.status(404).json({
                error: false,
                result: 'user non trovato'
            });
            return;
        }
    }  else if (baseUrl === "invoices"){
        if (param.id.trim() === '') {
            res.status(400).json({
                error: false,
                result: 'il campo id non può essere vuoto'
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                error: false,
                result: `l'id deve essere un numero`
            });
            return;
        }

        const result = invoicelist.filter(element => {
            return element.id === Number(param.id);
        });

        if (result.length === 0){
            res.status(404).json({
                error: false,
                result: 'invoice non trovata'
            });
            return;
        }
    }
} catch (error) {
    throw error;
}
    
    next();
}

export default validateParams;