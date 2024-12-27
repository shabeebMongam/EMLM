import mongoose from 'mongoose';

const albumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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