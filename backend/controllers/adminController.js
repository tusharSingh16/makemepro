const express = require("express");
const Trainer = require("../models/Trainer");
const Listing = require('../models/Listing')
const {SearchAlert}= require("../models/SearchAlert")
const searchAlertEmail = require("../utils/searchAlertEmail");
// const { z } = require("zod");

exports.getTrainers = async (req, res) => {
  // res.json(teachers);
  try {
    const trainer = await Trainer.find({
      isApproved: true,
    });
    res.status(200).json({
      status: "success",
      trainer: trainer,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e.message,
    });
  }
};
//get pending trainers
exports.getPendingTrainers = async (req, res) => {
  try {
    const pendingTrainers = await Trainer.find({
      isApproved: false,
    });
    console.log(pendingTrainers);
    if (!pendingTrainers) {
      res.json({
        message: "No pending trainers",
      });
    }
    // console.log(pendingTrainers);

    res.status(200).json({
      status: "success",
      pendingTrainers: pendingTrainers,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e.message,
    });
  }
};
//approve pending trainers
exports.approvePendingTrainers = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { isApproved: true },
      { new: true } // Return the updated document
    );

    if (!updatedTrainer) {
      res.status(404).json({
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      message: "Trainer approved successfully",
      trainer: updatedTrainer,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
//discard pending trainers
exports.discardPendingTrainers = async (req, res) => {
  try {
    const trainerId = req.params.id;
    const deleteTrainer = await Trainer.findByIdAndDelete(trainerId);
    if (deleteTrainer) {
      res.status(200).json({
        status: "success",
        deleteTrainer: deleteTrainer,
      });
    } else {
      res.status(404).json({
        message: "trainer not found",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//get all the listings
exports.getListings = async (req, res) => {
  // res.json();
  try {
    const listings = await Listing.find({
      isApproved: true,
    });
    res.status(200).json({
      status: "success",
      listings: listings,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e.message,
    });
  }
};

//get listing with given id
exports.getListingId = async (req, res) => {
  try {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    res.status(200).json({
      status: "success",
      listing: listing,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e.message,
    });
  }
};

//edit the approved listing
exports.editListing = async (req, res) => {
  // const inputFromTrainer = {
  //   category: req.body.category,
  //   priceMode: req.body.priceMode,
  //   title: req.body.title,
  //   price: req.body.price,
  //   mode: req.body.mode,
  //   location: req.body.location,
  //   quantity: req.body.quantity,
  //   classSize: req.body.quantity,
  //   startDate: req.body.startDate,
  //   endDate: req.body.endDate,
  //   days: req.body.days,
  //   gender: req.body.gender,
  //   startTime: req.body.startTime,
  //   endTime: req.body.endTime,
  //   minAge: req.body.minAge,
  //   maxAge: req.body.maxAge,
  //   preRequisites: req.body.preRequisites,
  //   description: req.body.description,
  // };
  // const result = getListingSchema.safeParse(inputFromTrainer);

  // if (!result.success) {
  //   return res.status(411).json({
  //     message: "Incorrect inputs",
  //     result,
  //   });
  // }
  const listingId = req.params.id; // Extract listingId from the request params
  const updatedListingData = req.body; // Extract the new data from the request body

  try {
    // Find the listing by its ID and update it with the provided data
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      updatedListingData,
      { new: true } // This will return the updated document
    );

    // If no listing is found, return a 404 error
    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Return the updated listing as a response
    return res.status(200).json({ listing: updatedListing });
  } catch (error) {
    console.error("Error updating listing:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//get pending listings
exports.getPendingListings = async (req, res) => {
  try {
    const pendingListings = await Listing.find({
      isApproved: false,
    });
    // console.log(pendingListings);
    if (!pendingListings) {
      res.json({
        message: "No pending Listings",
      });
    }
    // console.log(pendingListings);

    res.status(200).json({
      status: "success",
      pendingListings: pendingListings,
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      error: e.message,
    });
  }
};
//approve pending listings
exports.approvePendingLsitings = async(req,res) => {
       try{
         const listingId = req.params.id;
         const updatedListing = await Listing.findByIdAndUpdate(
           listingId, 
           { isApproved: true },
           { new: true } // Return the updated document
         );
        //  console.log(updatedListing);
         
         try {
          const {category, price, gender, minAge, maxAge } ={category:updatedListing.category , price:updatedListing.price,gender:updatedListing.gender,minAge:updatedListing.minAge, maxAge:updatedListing.maxAge};
         const filter = {};

         if (category) filter.category = category;
         if (gender) filter.gender = gender; 
 
         if (price) {
          const parsedPrice = parseFloat(price);
          filter.$and = [
              { minPrice: { $lte: parsedPrice } }, 
              { maxPrice: { $gte: parsedPrice } },
          ];
      }
 
         if (minAge || maxAge) {
             filter.$and = filter.$and || [];
             if (minAge) filter.$and.push({ maxAge: { $gte: parseInt(minAge, 10) } });
             if (maxAge) filter.$and.push({ minAge: { $lte: parseInt(maxAge, 10) } });
         }
 
         const result = await SearchAlert.find(filter);
        // console.log(result);
        // res.json(result)
        if (result.length>0) {
          var selectedClients = [];
          result.map((e)=>selectedClients.push(e.email));
           await searchAlertEmail(
            selectedClients,
          "New Listing Added recently According to your Intereest",
          `Hello, \n\n New Listing Added recently According to your Intereest`,
          `<p>Hello,</p><p>New Listing Added recently According to your Intereest <b></p>`
        );
        }
        
     } catch (err) {
         console.error(err);
         res.status(500).send({ error: 'Error fetching datafa' });
     }
         if(!updatedListing){
            res.status(404).json({
             message: "Listing not found"
            })
         }
     
         res.status(200).json({
              message: 'Listing approved successfully',
              listing: updatedListing
         });
     
     } catch(e){
        res.status(500).json({error : e.message})
     }
}
//discard pending listings
exports.discardPendingListings = async (req, res) => {
  try {
    const listingId = req.params.id;
    console.log(listingId);
    const deleteListing = await Listing.findByIdAndDelete(listingId);
    if (deleteListing) {
      res.status(200).json({
        status: "success",
        deleteListing: deleteListing,
      });
    } else {
      console.log("hello");
      res.status(404).json({
        message: "Listing not found",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// exports.editListing = async(req,res) => {
//       const listingId = req.params.id;
//       const listing = Listing.findById(listingId);
//       if(!listing){
//         res.status(404).json({
//           msg:"listing not found"
//         })
//       }

// }
