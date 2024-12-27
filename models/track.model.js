import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
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