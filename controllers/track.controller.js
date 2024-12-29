import mongoose from "mongoose";
import Album from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import Track from "../models/track.model.js";
import ErrorResponse from "../utils/errorResponse.js";
import RESPONSE from "../utils/response.js";
import errorHandler from "../middlewares/errorHandler.js";
import { v4 as uuid } from "uuid";

const addTrack = async (req, res) => {
    try {
        const { artist_id, album_id, name, duration, hidden } = req.body;
        if (!artist_id) {
            throw ErrorResponse({ message: "Bad Request, Reason: Artist ID is required", statusCode: 400 });
        }
        if (!album_id) {
            throw ErrorResponse({ message: "Bad Request, Reason: Album ID is required", statusCode: 400 });
        }
        if (!name) {
            throw ErrorResponse({ message: "Bad Request, Reason: Name is required", statusCode: 400 });
        }
        if (!duration) {
            throw ErrorResponse({ message: "Bad Request, Reason: Duration is required", statusCode: 400 });
        }

        const isArtistExist = await Artist.findOne({ artist_id });
        if (!isArtistExist) {
            throw ErrorResponse({ message: "Artist not found", statusCode: 404 });
        }
        const isAlbumExist = await Album.findOne({ album_id });
        if (!isAlbumExist) {
            throw ErrorResponse({ message: "Album not found", statusCode: 404 });
        }
        if (isAlbumExist.artist_id !== artist_id) {
            throw ErrorResponse({ message: "Artist and Album mismatch", statusCode: 400 });
        }

        const track = new Track({ track_id: uuid(), artist_id, album_id, name, duration, hidden });
        const newTrack = await track.save();

        res.json(RESPONSE({ statusCode: 201, data: null, message: "Track created successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getTracks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const offset = parseInt(req.query.offset) || 0;
        const filter = {};
        if (req.query.hidden) {
            filter.hidden = req.query.hidden;
        }
        if (req.query.artist_id) {
            filter.artist_id = req.query.artist_id;
        }
        if (req.query.album_id) {
            filter.album_id = req.query.album_id;
        }

        const tracks = await Track.aggregate([
            {
                $match: {
                    ...filter
                }
            },
            {
                $lookup: {
                    from: "albums",
                    localField: "album_id",
                    foreignField: "album_id",
                    as: "album"
                }
            },
            {
                $lookup: {
                    from: "artists",
                    localField: "artist_id",
                    foreignField: "artist_id",
                    as: "artist"
                }
            },
            {
                $unwind: "$album"
            },
            {
                $unwind: "$artist"
            },
            {
                $match: filter
            },
            {
                $project: {
                    _id: 0,
                    track_id: 1,
                    artist_name: "$artist.name",
                    album_name: "$album.name",
                    name: 1,
                    duration: 1,
                    hidden: 1,
                }
            },
            {
                $skip: offset
            },
            {
                $limit: limit
            }
        ])

        res.json(RESPONSE({ statusCode: 200, data: tracks, message: "Tracks retrieved successfully.", error: null }));
    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const getTrack = async (req, res) => {
    try {
        const { track_id } = req.params;
        if (!track_id) {
            throw ErrorResponse({ message: "Bad Request, Reason: Track ID is required", statusCode: 400 });
        }
        const track = await Track.aggregate([
            {
                $match: {
                    track_id
                }
            },
            {
                $lookup: {
                    from: "albums",
                    localField: "album_id",
                    foreignField: "album_id",
                    as: "album"
                }
            },
            {
                $lookup: {
                    from: "artists",
                    localField: "artist_id",
                    foreignField: "artist_id",
                    as: "artist"
                }
            },
            {
                $unwind: "$album"
            },
            {
                $unwind: "$artist"
            },
            {
                $project: {
                    _id: 0,
                    track_id: 1,
                    artist_name: "$artist.name",
                    album_name: "$album.name",
                    name: 1,
                    duration: 1,
                    hidden: 1
                }
            },
        ]);
        if (!track) {
            throw ErrorResponse({ message: "Track not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: track[0], message: "Track retrieved successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const updateTrack = async (req, res) => {
    try {
        const { track_id } = req.params;
        if (!track_id) {
            throw ErrorResponse({ message: "Bad Request, Reason: Track ID is required", statusCode: 400 });
        }
        const { name, duration, hidden } = req.body;
        const dataToUpdate = {};
        if (name) {
            dataToUpdate.name = name;
        }
        if (duration) {
            dataToUpdate.duration = duration;
        }
        if (hidden) {
            dataToUpdate.hidden = hidden;
        }

        const updatedTrack = await Track.findOneAndUpdate({track_id}, dataToUpdate, { new: true });
        if (!updatedTrack) {
            throw ErrorResponse({ message: "Track not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 204, data: null, message: "Track updated successfully.", error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

const deleteTrack = async (req, res) => {
    try {
        const { track_id } = req.params;
        if (!track_id) {
            throw ErrorResponse({ message: "Bad Request, Reason: Track ID is required", statusCode: 400 });
        }
        const track = await Track.findOneAndDelete({track_id}, { new: true });
        if (!track) {
            throw ErrorResponse({ message: "Track not found", statusCode: 404 });
        }
        res.json(RESPONSE({ statusCode: 200, data: null, message: `Track:${track.name} deleted successfully.`, error: null }));

    } catch (error) {
        errorHandler.errorHandler(error, req, res);
    }
}

export default { addTrack, getTracks, getTrack, updateTrack, deleteTrack };