const express = require("express");
const router = express.Router(); 
const oc = require("../controllers/organizationController");
const oac = require("../controllers/organizationAuthController");

// Organization routes
router.get("/organizations", oc.getOrganizations);
router.get("/organizations/:id", oc.getOrganizationById);
router.put("/organizations/:id", oc.updateOrganization);
router.delete("/organizations/:id", oc.deleteOrganization); 

// Auth routes for organizations
router.post("/organizations/signup", oac.signUpOrganization);
router.post("/organizations/login", oac.loginOrganization);

module.exports = router;
