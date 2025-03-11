const Organization = require("../models/Organization");
// const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

// Zod validation schema for Organization Sign-up
const signUpSchema = z.object({
  orgname: z.string().min(1, "Name is required"),
  linkedin: z.string().url("Invalid LinkedIn URL"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"], 
});

// Zod validation schema for Organization Login
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Organization Sign-up
exports.signUpOrganization = async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body);

    // checking existence
    const existingOrganization = await Organization.findOne({ email: validatedData.email });
    if (existingOrganization) {
      return res.status(409).json({ message: "Organization already exists" });
    }

    // salting password
    // const salt = await bcrypt.genSalt(10);
    // validatedData.password = await bcrypt.hash(validatedData.password, salt);

    // Create new organization
    const organization = new Organization(validatedData);
    await organization.save();

    // Generate JWT
    const token = jwt.sign({ id: organization._id, role: organization.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, 
        orgDetails: organization
     });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// Organization Login
exports.loginOrganization = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const password = req.body.password;
    // Find organization by email
    const organization = await Organization.findOne({ email: validatedData.email });
    if (!organization) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if(password!= organization.password)  {
      return res.status(400).json({
        msg: "Incorrect password!!"
      })
    }

    // Check password
    // const isMatch = await bcrypt.compare(validatedData.password, organization.password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }

    // Generate JWT
    const token = jwt.sign({ id: organization._id, role:organization.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token,
       role: organization.role,
        _id: organization._id
      });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
