import errorHandler from "../middlewares/errorHandler.js";
import Favorite from "../models/favorite.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import { v4 as uuid } from "uuid";

const addFavorite = async (req, res) => {
    try {
        const { category, item_id } = req.body;
        if (!category) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Category is required", statusCode: 400 });
        }
        if (!item_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Item ID is required", statusCode: 400 });
        }
        if (!["artist", "album", "track"].includes(category)) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Invalid Category", statusCode: 400 });
        }
        const favorite = new Favorite({
            favorite_id: uuid(),
            user_id: req.user.id,
            item_id,
            category
        });
        const newFavorite = await favorite.save();
        res.json(RESPONSE({ statusCode: 201, data: null, message: "Favorite added successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getFavorites = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Category is required", statusCode: 400 });
        }
        if (!["artist", "album", "track"].includes(category)) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Invalid Category", statusCode: 400 });
        }
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;

        const favorites = await Favorite.aggregate([
            {
                $match: {
                    category,
                    user_id: req.user.id
                }
            },
            {
                $lookup: {
                    from: category + 's',
                    localField: 'item_id',
                    foreignField: category + '_id',
                    as: 'item'
                }
            },
            {
                $unwind: '$item'
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 0,
                    favorite_id: 1,
                    category: 1,
                    item_id: 1,
                    name: '$item.name',
                    createdAt: 1
                }
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            }
        ])
        res.json(RESPONSE({ statusCode: 200, data: favorites, message: "Favorites retrieved successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const deleteFavorite = async (req, res) => {
    try {
        const { favorite_id } = req.params;
        if (!favorite_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Favorite ID is required", statusCode: 400 });
        }
        const favorite = await Favorite.findOneAndDelete({favorite_id, user_id: req.user.id});
        if (!favorite) {
            throw new ErrorResponse({ message: "Favorite not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: null, message: "Favorite deleted successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

export default { addFavorite, getFavorites, deleteFavorite };