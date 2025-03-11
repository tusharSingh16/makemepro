const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');

router.post('/amenities', amenityController.createAmenity);
router.get('/amenities', amenityController.getAllAmenities);
router.get('/amenities/:id', amenityController.getAmenityById);
router.put('/amenities/:id', amenityController.updateAmenity);
router.delete('/amenities/:id', amenityController.deleteAmenity);

module.exports = router;
