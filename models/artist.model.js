import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    grammy: {
        type: Boolean,
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