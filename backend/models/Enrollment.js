const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  listingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Listing",
  },
  memberIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
  ],
});
// const enrollmentSchema = new mongoose.Schema({
//   listingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Listing",
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   memberId: {
//     // Ensure this is the correct field name
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Member",
//   },
// });
// const enrollmentSchema = new mongoose.Schema({
//   listingId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "Listing",
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: "User",
//   },
//   members: [
//     // Array of member IDs
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Member",
//     },
//   ],
// });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
module.exports = { Enrollment };
