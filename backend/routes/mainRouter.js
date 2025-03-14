const express = require("express");
const userRouter = require("./userRoutes");
const listingRouter = require("./listingRoutes");
const adminRouter = require("./adminRoutes");
const trainerRouter = require("./trainerRoutes");
const reviewRouter = require("./reviewRoutes");
const router = express.Router();
const orgRouter = require("./organizationRoutes")
const favoritesRoutes = require("./favoritesRoutes");
const orderRouter = require("./orderRouter")
const searchAlertRouter = require("./searchAlertRouter")
const rentalRouter = require("./rentalRoutes");
const amentiyRouter = require("./amenityRoutes");
const imageRouter = require("./imageRoutes")
const sponsorRouter = require("./sponsorRoutes");

router.use("/user", userRouter);
router.use("/", trainerRouter);
router.use("/listing", listingRouter);
router.use("/admin", adminRouter);
router.use("/review", reviewRouter);
router.use("/", orgRouter);
router.use("/favorites", favoritesRoutes);
router.use("/order", orderRouter);
router.use("/search-alert", searchAlertRouter);
router.use("/", rentalRouter);
router.use("/", amentiyRouter);
router.use("/", imageRouter);
router.use("/sponsor", sponsorRouter);

module.exports = router;
