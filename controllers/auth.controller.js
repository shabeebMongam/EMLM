import errorHandler from "../middlewares/errorHandler.js";
import User from "../models/user.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import validators from "../utils/validators.js";
import encryption from "../utils/encryption.js";
import { v4 as uuid } from 'uuid';

const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !validators.validateEmail(email)) {
            res.status(400);
            throw new ErrorResponse({ message: "Bad Request, Reason: Email is required", statusCode: 400 });
        }
        if (!password || !validators.validatePassword(password)) {
            res.status(400);
            throw new ErrorResponse({ message: "Bad Request, Reason: Password is required", statusCode: 400 });
        }
        const isFirstUser = await User.countDocuments() === 0;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(400);
            throw new ErrorResponse({ message: "Email already exists.", statusCode: 409 });
        }
        const encryptedPassword = encryption.encrypt(password);
        let newUser = {
            user_id: uuid(),
            email,
            password: encryptedPassword
        }
        if (isFirstUser) {
            newUser.role = "Admin";
        }
        await User.create(newUser);
        res.status(201).json(RESPONSE({ statusCode: 201, data: null, message: "User created successfully", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !validators.validateEmail(email)) {
            res.status(400);
            throw new ErrorResponse({ message: "Bad Request, Reason: Email is required", statusCode: 400 });
        }
        if (!password) {
            res.status(400);
            throw new ErrorResponse({ message: "Bad Request, Reason: Password is required", statusCode: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404);
            throw new ErrorResponse({ message: "User not found", statusCode: 404 });
        }
        const isPasswordMatched = encryption.compare(password, user.password);
        if (!isPasswordMatched) {
            res.status(401);
            throw new ErrorResponse({ message: "Invalid credentials", statusCode: 401 });
        }
        const accessToken = encryption.generateAccessToken(user.user_id);
        await User.findOneAndUpdate({ user_id: user.user_id }, { token: accessToken });
        res.status(200).json(RESPONSE({
            statusCode: 200, data: {
                token: accessToken
            }, message: "Login successful.", error: null
        }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isTokenValid = encryption.verifyToken(token);
        if (!isTokenValid) {
            throw new ErrorResponse({ message: "Unauthorized", statusCode: 401 });
        }
        const user = await User.findOne({ user_id: isTokenValid.id });
        if (!user) {
            throw new ErrorResponse({ message: "User not found", statusCode: 404 });
        }
        await User.findOneAndUpdate({ user_id: user.user_id }, { token: "" });
        res.status(200).json(RESPONSE({ statusCode: 200, data: null, message: "User logged out successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}


export default { signup, login, logout };

