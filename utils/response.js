const RESPONSE = ({ statusCode, data, message, error }) => {
    return {
        status: statusCode,
        data: data || null,
        message: message,
        error: error || null
    }
}



export default RESPONSE;