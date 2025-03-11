// models/Favorites.js
const mongoose = require('mongoose');

// Define the Favorites model
const FavoritesSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listings', required: true },
});

const Favorites = mongoose.model('Favorites', FavoritesSchema);
module.exports = Favorites;
