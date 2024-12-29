import errorHandler from "../middlewares/errorHandler.js";
import Artist from "../models/artist.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import { v4 as uuid } from "uuid";

const addArtist = async (req, res) => {
    try {
        const { name, grammy, hidden } = req.body;
        if (!name) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Name is required", statusCode: 400 });
        }
        if (!grammy) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Grammy is required", statusCode: 400 });
        }
        const artist = new Artist({ artist_id: uuid(), name, grammy, hidden });
        await artist.save();
        res.json(RESPONSE({ statusCode: 201, data: null, message: "Artist added successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getArtists = async (req, res) => {
    try {
        const { grammy, hidden } = req.query;
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 0;
        const filter = {};
        if (grammy) {
            filter.grammy = grammy;
        }
        if (hidden) {
            filter.hidden = hidden;
        }
        const artists = await Artist.find(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }).limit(parseInt(limit)).skip(parseInt(offset));
        res.json(RESPONSE({ statusCode: 200, data: artists, message: "Artists retrieved successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        if (!artist_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Artist ID is required", statusCode: 400 });
        }
        const artist = await Artist.findOne({ artist_id }, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        if (!artist) {
            throw new ErrorResponse({ message: "Artist not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: artist, message: "Artist retrieved successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const updateArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        const { name, grammy, hidden } = req.body;
        if (!artist_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Artist ID is required", statusCode: 400 });
        }
        const dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
        }
        if (grammy) {
            dataToUpdate.grammy = grammy;
        }
        if (hidden) {
            dataToUpdate.hidden = hidden;
        }
        const artist = await Artist.findOneAndUpdate({ artist_id }, dataToUpdate, { new: true, projection: { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 } });
        if (!artist) {
            throw new ErrorResponse({ message: "Artist not found", statusCode: 404 });
        }

        res.json(RESPONSE({ statusCode: 204, data: artist, message: "Artist updated successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const deleteArtist = async (req, res) => {
    try {
        const { artist_id } = req.params;
        if (!artist_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Artist ID is required", statusCode: 400 });
        }
        const artist = await Artist.findOneAndDelete({artist_id}, { new: true });
        if (!artist) {
            throw new ErrorResponse({ message: "Artist not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: { artist_id }, message: `Artist:${artist.name} deleted successfully `, error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

export default { addArtist, getArtists, getArtist, updateArtist, deleteArtist };