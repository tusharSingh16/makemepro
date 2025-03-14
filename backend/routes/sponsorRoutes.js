const express = require("express");
const Listing = require("../models/Listing");

const router = express.Router();

router.put("/updateSponsored/:id", async (req, res) => {
  const { id } = req.params;
  const { isSponsored, sponsoredAmount } = req.body;

  try {
    const listing = await Listing.findByIdAndUpdate(
      id,
      { isSponsored, sponsoredAmount },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;