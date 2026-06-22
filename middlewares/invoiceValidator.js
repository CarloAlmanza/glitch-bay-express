import { validatorKeys,validatorValues } from "../src/utils/function.js";




function invoiceValidator(request, response, next) {
    const dataToValidate = request.body;

    const keyError = validatorKeys(dataToValidate);
    if (keyError) {
        return response
            .status(400)
            .json({
            error: keyError,
            result: null
            });
    }

    const valueError = validatorValues(dataToValidate);
    if (valueError) {
        return response
            .status(400)
            .json({
            error: valueError,
            result: null
            });
    }

    next();
}


export default invoiceValidator;