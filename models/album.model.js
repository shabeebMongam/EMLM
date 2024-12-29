import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    album_id: {
        type: String,
        required: true,
        unique: true
    },
    artist_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    year: {
        type: Number,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Album = mongoose.model('Album', albumSchema);

export default Album;