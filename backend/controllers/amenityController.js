const Amenity = require('../models/Amenity'); 

// Create a new amenity
exports.createAmenity = async (req, res) => {
  try {
    const amenity = new Amenity(req.body);
    await amenity.save();
    res.status(201).json({
      msg: "amenity created"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all amenities
exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    res.status(200).json(amenities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get amenity by ID
exports.getAmenityById = async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.status(200).json(amenity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an amenity
exports.updateAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.status(200).json(amenity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an amenity
exports.deleteAmenity = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }
    res.status(200).json({ message: 'Amenity deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
