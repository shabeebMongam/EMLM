import User from "../models/user.model.js";
import encryption from "../utils/encryption.js";
import ErrorResponse from "../utils/errorResponse.js";
import errorHandler from "./errorHandler.js";

export const validateToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
            res.status(401);
            throw new ErrorResponse({ message: "Unauthorized Access", statusCode: 401 });
        }
        const token = req.headers.authorization.split(" ")[1];
        const isTokenValid = encryption.verifyToken(token);
        if (!isTokenValid || !isTokenValid.id) {
            throw new ErrorResponse({ message: "Unauthorized Access", statusCode: 401 });
        }
        const user = await User.findOne({ user_id: isTokenValid.id });
        if (user.token !== token) {
            throw new ErrorResponse({ message: "Unauthorized Access", statusCode: 401 });
        }
        req.user = {
            id: isTokenValid.id,
            role: user.role
        }
        next();
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}