import errorHandler from "../middlewares/errorHandler.js";
import User from "../models/user.model.js";
import encryption from "../utils/encryption.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import validators from "../utils/validators.js";
import { v4 as uuid } from 'uuid';


const addUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !validators.validateEmail(email)) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Email is required", statusCode: 400 });
        }
        if (!password) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Password is required", statusCode: 400 });
        }
        if (!role) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Role is required", statusCode: 400 });
        }
        if (!["Editor", "Viewer"].includes(role)) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Role should be Editor or Viewer", statusCode: 400 });
        }

        const isEmailExist = await User.findOne({ email });
        if (isEmailExist) {
            throw new ErrorResponse({ message: "Email already exists.", statusCode: 409 });
        }
        const encryptedPassword = encryption.encrypt(password);
        let newUser = {
            user_id: uuid(),
            email,
            password: encryptedPassword,
            role
        }
        await User.create(newUser);
        res.json(RESPONSE({ statusCode: 201, data: null, message: "User created successfully", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getUsers = async (req, res) => {
    try {
        // 1. Parse query params
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const { role } = req.query;

        // 2. Build filter
        const filter = {};
        if (role && ['Editor', 'Viewer'].includes(role)) {
            filter.role = role;
        }

        // 3. Create query
        const query = User.find(filter, { password: 0, __v: 0, updatedAt: 0, token: 0, _id: 0 })
            .sort({ createdAt: -1 });


        // 4. Apply pagination if provided
        if (limit && offset) {
            query.limit(limit).skip(offset);
        }

        const users = await query.exec();
        res.json(RESPONSE({ statusCode: 200, data: users, message: "Users retrieved successfully.", error: null }));
    } catch (error) {
        console.log(error);
        errorHandler.errorHandler(error, req, res);
    }
}

const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        if (!user_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: User ID is required", statusCode: 400 });
        }
        const user = await User.findOneAndDelete({ user_id });

        if (!user) {
            throw new ErrorResponse({ message: "User not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: null, message: "User deleted successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const updateUserPassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        if (!old_password) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Old Password is required", statusCode: 400 });
        }
        if (!new_password) {
            throw new ErrorResponse({ message: "Bad Request, Reason: New Password is required", statusCode: 400 });
        }
        const user = await User.findOne({ user_id: req.user.id });
        if (!user) {
            throw new ErrorResponse({ message: "User not found", statusCode: 404 });
        }
        const isPasswordMatch = encryption.compare(old_password, user.password);
        if (!isPasswordMatch) {
            throw new ErrorResponse({ message: "Unauthorized Access.", statusCode: 401 });
        }
        const encryptedPassword = encryption.encrypt(new_password);
        user.password = encryptedPassword;
        const updatedData = await user.save();
        res.json(RESPONSE({ statusCode: 200, data: null, message: "Password updated successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);

    }

}


export default { addUser, getUsers, deleteUser, updateUserPassword };