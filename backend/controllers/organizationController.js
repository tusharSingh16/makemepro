const express = require("express");
const Organization = require('../models/Organization');
const { z } = require("zod");

// zod validation schema for organization
const orgSchema = z.object({
  name: z.string().min(1, "Name is required"),
  linkedin: z.string().min(1, "LinkedIn is required"),
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"], // path of error
});

// controller to update an organization
exports.updateOrganization = async (req, res) => {
  try {
    orgSchema.parse(req.body); // Validate the request body
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organization) return res.status(500).json({ error: "Error, organization not found!" });
    res.status(200).json({ organization, message: "Organization updated" });
  } catch (e) {
    res.status(500).json({
      error: e.message,
    });
  }
};

// controller to fetch all organizations
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.status(200).json(organizations);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// controller to fetch a single organization by specific ID
exports.getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) return res.status(500).json({ error: "No organization found" });
    res.status(200).json(organization);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// controller to delete an organization
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndDelete(req.params.id);
    if (!organization) return res.status(500).json({ error: "No organization with this ID found" });
    res.status(200).json({ message: "Organization deleted successfully!" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
