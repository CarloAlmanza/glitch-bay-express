


function queryValidationClaude(request, response, next) {
    const { categories } = request.query;
    const categoriesToSend = [];

    if (!categories) {
        request.categories = null;
        next();
        return;
    };


    if (categories.trim() === '') {
        response.status(400).json({
            error: 'Il campo categories non può essere vuoto',
            result: null
        });
        return;
    }

    const list = ['arredamento', 'illuminazione', 'orologi', 'audio', 'decorazioni', 'da scrivania', 'tascabili'];
    const toValidate = categories.split(', ');

    toValidate.forEach(category => {
        if (list.includes(category.trim().toLowerCase())) {
            categoriesToSend.push(category);
        }
        
    });

    if (categoriesToSend.length === 0) {
        response.status(404).json({
            error: 'Nessuna categoria corrisponde a quelle presenti',
            result: null
        });
        return;
    } 
    console.log(categoriesToSend);
    
    request.categories = [...categoriesToSend];
    next();
    
};

export default queryValidationClaude;