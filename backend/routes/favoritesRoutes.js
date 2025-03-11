const { useParams } = require('next/navigation');
const Favorites = require('../models/favorites');
const {User}  = require('../models/user')
const express=require("express");

const favoritesRoute = express.Router();
favoritesRoute.get('/:id', async (req, res) => {
    const userId = req.params.id; // Assuming userId is available from your authentication middleware

    try {
        // Fetch the user's favorites (listing IDs)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If you want to populate the full listing details, you should have populated 'favorites' field
        const favoriteListings = user.favorites;

        res.status(200).json({
            message: 'Favorite listings retrieved',
            favorites: favoriteListings, // This will return populated listings, not just listing IDs
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
});

// DELETE route to remove a favorite
favoritesRoute.delete('/', async (req, res) => {
    const { userId, listingId } = req.body;

    console.log('Removing favorite:', { userId, listingId });

    try {
        // Fetch the user to check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the listingId exists in the favorites array
        if (!user.favorites.includes(listingId)) {
            return res.status(404).json({ message: 'Listing not found in favorites' });
        }

        // Remove the listingId from favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: listingId } }, // Remove from favorites
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Listing removed from favorites',
            favorites: updatedUser.favorites, // Return the updated favorites
        });
    } catch (error) {
        console.error('Error removing favorite:', error);
        res.status(500).json({ message: 'Error removing favorite', error });
    }
});


// POST route to add a favorite
favoritesRoute.post('/', async (req, res) => {
    const { userId, listingId } = req.body;

    console.log('Adding favorite:', { userId, listingId });

    try {
        // Fetch the user to check if the listingId already exists in favorites
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the listingId already exists in the favorites array
        if (user.favorites.includes(listingId)) {
        try{
             // Remove the listingId from favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorites: listingId } }, // Remove from favorites
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Listing removed from favorites',
            favorites: updatedUser.favorites, // Return the updated favorites
        });

        }catch (error) {
            console.error('Error removing favorite:', error);
            res.status(500).json({ message: 'Error removing favorite', error });
        }
        return;
        }

        // If not, update the user by adding the new listingId to favorites
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { favorites: listingId } }, // Add to favorites
            { new: true } // Return the updated document
        );

        res.status(200).json({
            message: 'Listing added to favorites',
            favorites: updatedUser.favorites, // Return the updated favorites
        });
    } catch (error) {
        console.error('Error saving favorite:', error);
        res.status(500).json({ message: 'Error adding favorite', error });
    }
});


module.exports = favoritesRoute;