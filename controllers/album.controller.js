import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import { v4 as uuid } from "uuid";

const addAlbum = async (req, res) => {
    try {
        const { artist_id, name, year, hidden } = req.body;
        if (!artist_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Artist Id is required", statusCode: 400 });
        }
        if (!name) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Name is required", statusCode: 400 });
        }
        if (!year) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Year is required", statusCode: 400 });
        }

        const artist = await Artist.findOne({ artist_id });
        if (!artist) {
            throw new ErrorResponse({ message: "Artist not found", statusCode: 404 });
        }
        const album = new Album({
            album_id: uuid(),
            artist_id,
            name,
            year,
            hidden
        });
        await album.save();
        res.json(RESPONSE({ statusCode: 201, data: null, message: "Album created successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getAlbums = async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const offset = req.query.offset || 0;
        const filter = {};
        if (req.query.artist_id) {
            filter.artist_id = req.query.artist_id;
        }
        if (req.query.hidden) {
            filter.hidden = req.query.hidden;
        }
        const albums = await Album.find(filter, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 }).limit(parseInt(limit)).skip(parseInt(offset));
        res.json(RESPONSE({ statusCode: 200, data: albums, message: "Albums retrieved successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        if (!album_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Album ID is required", statusCode: 400 });
        }
        const album = await Album.findOne({album_id}, { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        if (!album) {
            throw new ErrorResponse({ message: "Album not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: album, message: "Album retrieved successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const updateAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        const { name, year, hidden } = req.body;
        if (!album_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Album ID is required", statusCode: 400 });
        }
        const dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
        }
        if (year) {
            dataToUpdate.year = year;
        }
        if (hidden) {
            dataToUpdate.hidden = hidden;
        }
        const album = await Album.findOneAndUpdate({album_id}, dataToUpdate, { new: true, projection: { _id: 0, createdAt: 0, updatedAt: 0, __v: 0 } });

        if (!album) {
            throw new ErrorResponse({ message: "Resource Doesn't Exist.", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: album, message: "Album updated successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const { album_id } = req.params;
        if (!album_id) {
            throw new ErrorResponse({ message: "Bad Request, Reason: Album ID is required", statusCode: 400 });
        }
        const album = await Album.findOneAndDelete({album_id}, { new: true });
        if (!album) {
            throw new ErrorResponse({ message: "Resource Doesn't Exist.", statusCode: 404 });
        }

        res.json(RESPONSE({ statusCode: 200, data: null, message: `Album:${album.name} deleted successfully `, error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

export default {
    addAlbum,
    getAlbums,
    getAlbum,
    updateAlbum,
    deleteAlbum
}