import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    artist_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    grammy: {
        type: Number,
        default: false
    },
    hidden: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Artist = mongoose.model('Artist', artistSchema);

export default Artist;