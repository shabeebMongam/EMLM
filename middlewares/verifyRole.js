import ErrorResponse from "../utils/errorResponse.js";
import errorHandler from "./errorHandler.js";

const allowAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            res.status(403);
            throw new ErrorResponse({ message: "Forbidden Access/Operation not allowed.", statusCode: 403 });
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const allowEditor = (req, res, next) => {
    try {
        if (req.user.role !== "Editor") {
            res.status(403);
            throw new ErrorResponse({ message: "Forbidden Access/Operation not allowed.", statusCode: 403 });
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const allowViewer = (req, res, next) => {
    try {
        if (req.user.role !== "Viewer") {
            res.status(403);
            throw new ErrorResponse({ message: "Forbidden Access/Operation not allowed.", statusCode: 403 });
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const allowAll = (req, res, next) => {
    try {
        if (!["Admin", "Editor", "Viewer" ].includes(req.user.role)) {
            res.status(403);
            throw new ErrorResponse({ message: "Forbidden Access/Operation not allowed.", statusCode: 403 });
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const allowAdminAndEditor = (req, res, next) => {
    try {
        if (!["Admin", "Editor"].includes(req.user.role)) {
            res.status(403);
            throw new ErrorResponse({ message: "Forbidden Access/Operation not allowed.", statusCode: 403 });
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}


export default { allowAdmin, allowEditor, allowViewer, allowAll, allowAdminAndEditor };