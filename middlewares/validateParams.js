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
                error: 'lo slug non può essere vuoto',
                result: null
            });
            return;
        }


        const found = slugList.filter(element => {
            return element.slug === param.slug;
        });

        
        

        if (found.length === 0){
            res.status(404).json({
                error: 'prodotto non trovato',
                result: null
            });
            return;
        }
        
        
    } else if (baseUrl === "categories"){
        if (param.id.trim() === ''|| typeof Number(param.id.trim()) !== "number" || Number.isNaN(param.id) || param.id <= 0) {
            res.status(400).json({
                error: "l'ID della categoria deve essere un numero maggiore di 0",
                result: null
            });
            return;
        }

        const result = catList.filter(element => {
            return element.id === Number(param.id);
        });

        if (result.length === 0){
            res.status(404).json({
                error: 'categoria non trovata',
                result: null
            });
            return;
        }
        

    } else if (baseUrl === "users"){ 
        if (param.id.trim() === '') {
            res.status(400).json({
                error: 'il campo id non può essere vuoto',
                result: null
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                error: `l'id deve essere un numero`,
                result: null
            });
            return;
        }

        const result = userList.filter(element => {
            return element.id === Number(param.id);
        });
        

        if (result.length === 0){
            res.status(404).json({
                error: 'user non trovato',
                result: null
            });
            return;
        }
    }  else if (baseUrl === "invoices"){
        if (param.id.trim() === '') {
            res.status(400).json({
                error: 'il campo id non può essere vuoto',
                result: null
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                error: `l'id deve essere un numero`,
                result: null
            });
            return;
        }

        const result = invoicelist.filter(element => {
            return element.id === Number(param.id);
        });

        if (result.length === 0){
            res.status(404).json({
                error: 'invoice non trovata',
                result: null
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