import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
    artist_id: {
        type: String,
        required: true

    },
    album_id: {
        type: String,
        required: true
    },
    track_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 0
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Track = mongoose.model('Track', trackSchema);

export default Track;