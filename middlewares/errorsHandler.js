function errorsHandler(error, request, response, next) {

    response
    .status(500)
    .json({
        error: 'Internal Server Error',
        result: null
    });
}


export default errorsHandler