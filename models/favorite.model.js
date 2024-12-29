import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    favorite_id:{
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true
    },
    item_id: {
        type: String,
        ref: 'Item',
        required: true
    },
    category: {
        type: String,
        required:true,
        enum:["artist", "album", "track"] 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;