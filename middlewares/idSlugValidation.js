import { getSlugs } from "../src/utils/function.js";

//lavoro con fake array di oggetti per le validazioni
const productSlugs = [
  { slug: 'smartphone-xyz' },
  { slug: 'laptop-super-fast' },
  { slug: 'cuffie-bluetooth-abc' }
];

const categoriesNames = [
    {name: 'Illuminazione'},
    {name: 'Orologi'},
    {name: 'Audio'},
    {name: 'Arredamento'},
    {name: 'Decorazioni da Parete, Piante & Terrari'},
    {name: 'Da Scrivania'},
    {name: 'Tascabili'}
];

const userIds = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5}
];

const invoiceIds = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5}
];




async function validateIdSlug(req, res, next) {
    try {
    const baseUrl = (req.baseUrl).replace("/", ""); //prendo la base dell'url ovvero l'endpoint (es. products)
    const param = req.params;
    
    const slugList = await getSlugs();
    
    
    if (baseUrl === "products") {
        if (param.slug.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'lo slug non può essere vuoto'
            });
            return;
        }


        const found = slugList.filter(element => {
            return element.slug === param.slug;
        });

        
        

        if (found.length === 0){
            res.status(404).json({
                success: false,
                message: 'prodotto non trovato'
            });
            return;
        }
        
        
    } else if (baseUrl === "categories"){
        if (param.name.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'il nome della categoria non può essere vuoto'
            });
            return;
        } else if (!isNaN(Number(param.name.trim()))) {
            res.status(400).json({
                success: false,
                message: 'il nome della categoria non può essere un numero'
            });
            return;
        }

        const result = categoriesNames.filter(element => {
            return element.name === param.name;
        });

        if (result.length === 0){
            res.status(404).json({
                success: false,
                message: 'categoria non trovata'
            });
            return;
        }
        

    } else if (baseUrl === "users"){ 
        if (param.id.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'il campo id non può essere vuoto'
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                success: false,
                message: `l'id deve essere un numero`
            });
            return;
        }

        const result = userIds.filter(element => {
            return element.id === Number(param.id);
        });
        

        if (result.length === 0){
            res.status(404).json({
                success: false,
                message: 'user non trovato'
            });
            return;
        }
    }  else if (baseUrl === "invoices"){
        if (param.id.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'il campo id non può essere vuoto'
            });
            return;
        } else if (isNaN(Number(param.id.trim()))) {
            res.status(400).json({
                success: false,
                message: `l'id deve essere un numero`
            });
            return;
        }

        const result = invoiceIds.filter(element => {
            return element.id === Number(param.id);
        });

        if (result.length === 0){
            res.status(404).json({
                success: false,
                message: 'invoice non trovata'
            });
            return;
        }
    }
} catch (error) {
    throw error;
}
    
    next();
}

export default validateIdSlug;