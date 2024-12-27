import RESPONSE from "../utils/response.js";

const errorHandler = (error, req, res, next) => {
    try {
        let { message, status, data, err } = error;
        if (!status) {
            status = 500;
        }
        res.status(status).json(RESPONSE({ statusCode: status, message, data, error: err }));
    } catch (error) {
        res.status(500).json(RESPONSE({ statusCode: 500, message: "Internal Server Error", error: error.message }));
    }
}

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}


export default {
    errorHandler,
    notFound
}