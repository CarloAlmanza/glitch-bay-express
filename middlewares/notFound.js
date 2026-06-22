function notFound(request, response, next) {
    
    response.status(404)
    .json({
        error: null,
        result: 'La risorsa richiesta non è stata trovata.'
    });
}

export default notFound