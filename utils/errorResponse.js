class ErrorResponse extends Error {
    constructor({message, statusCode, data = null, error = null}) {
        super(message);
        this.status = statusCode;
        this.data = data;
        this.message = message;
        this.err = error;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorResponse;