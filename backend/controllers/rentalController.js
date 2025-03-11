const Rental = require('../models/Rental')
const Amentiy = require('../models/Amenity')

// create rental property

exports.createRental = async (req, res) =>  {
    try {
        const rental = new Rental(req.body);
        await rental.save();
        res.status(201).json({
            msg:"rental created success",
            rental
        })
    } catch (error) {
        res.status(400).json({
            msg: "error creating rental",
            error: error.message
        })
    }
}

// get all rental properties

exports.getAllRentals = async (req, res)    =>  {
    try {
        const rentals = await Rental.find();
        if(!rentals)    {
            return res.status(400).hson({
                msg: "no rentals found"
            })
        }
        res.status(201).json({
            rentals
        })
    } catch (error) {
        res.status(500).json({
            msg: "error in fetch rentals",
            error: error.message
        })
    }
}

exports.getRentalById = async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id).populate('amenities'); // Populate amenities
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.status(200).json(rental);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Update a rental property
exports.updateRental = async (req, res) => {
    try {
      const rental = await Rental.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.status(200).json(rental);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Delete a rental property
exports.deleteRental = async (req, res) => {
    try {
      const rental = await Rental.findByIdAndDelete(req.params.id);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.addImageToRental = async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
  
      rental.images.push(req.body); // Assuming the body contains {url, description}
      await rental.save();
      res.status(200).json(rental);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  // Add amenities to a rental property
exports.addAmenitiesToRental = async (req, res) => {
    try {
      const rental = await Rental.findById(req.params.id);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
  
      rental.amenities.push(...req.body); //an array of amenity IDs
      await rental.save();
      res.status(200).json(rental);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

