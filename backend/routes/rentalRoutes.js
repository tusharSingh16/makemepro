const express=  require('express');
const router = express.Router();
const rental = require("../controllers/rentalController");

router.post('/create-rental', rental.createRental);
router.get('/rentals', rental.getAllRentals);
router.get('/rentals/:id', rental.getRentalById);
router.put('/rentals/:id', rental.updateRental);
router.delete('/rentals/:id', rental.deleteRental);
router.post('/rentals/:id/images', rental.addImageToRental);
router.post('/rentals/:id/amenities', rental.addAmenitiesToRental);

module.exports = router;

