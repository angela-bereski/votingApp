const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Model, model } = require("mongoose");
const SECRET = process.env.SECRET;

module.exports = {
  registerAdmin:async (req, res) => {
    try {
      //console.log("trying register user");
      const newAdmin = await Admin.create(req.body);
      //console.log("user registered", newUser);
      // const adminToken = jwt.sign({ _id: newAdmin._id, email: newAdmin.email },SECRET);
      //console.log("userToken received", userToken);
      // res.status(201).cookie("adminToken", adminToken, {httpOnly: true,expires: new Date(Date.now() + 90000),}).json({ successMessage: "admin logged in", admin:newAdmin });
      res.status(201).json({ successMessage: "admin logged in", admin:newAdmin });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getAdmin: async (req, res) => {
    Admin.findOne({ email: req.params.email })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  },

  updateAdmin: (req, res) => {
    console.log("updatedUser");
    // const admin = jwt.verify(req.cookies.adminToken, SECRET);
    //console.log("We are here", user._id);
    Admin.findOneAndUpdate({ _id: req.params._id }, req.body, {
      new: true,
      runValidators: true,
    })
       //^req.params.id comes from what is passed in through the url via routes
      //^req.body is what we are wanting to update
      .then((updatedAdmin) => {
        console.log("user is updated", updatedAdmin);
        res.json(updatedAdmin);
      })
      .catch((err) => {
        console.log("user was not updated", err);
        res.status(400).json(err);
      });
  },

  loginAdmin: async (req, res) => {

    // const admin = await Admin.findOne({email: req.body.email})
    // console.log("loginAdmin" + admin);

  //   try {
  //     // if email not in system
  //     if (!admin) {
  //         res.status(400).json({ errors: 'Email not found' })
  //         // else check the rest
  //     } else {
  //         const validPassword = await bcrypt.compare(req.body.password, admin.password)
  //         if (!validPassword) {
  //             res.status(400).json({ errors: 'Invalid email/password' })
  //         } else {
  //             const payload = { _id: admin._id, email: admin.email, firstName: admin.firstName, lastName:admin.lastName }
  //             const token = jwt.sign(payload, SECRET)
  //             res.cookie('adminToken', token, { expires: new Date(Date.now() + 900000) })
  //             .json({ successMessage: 'adminToken: ', admin: payload })
  //         }
  //     }
  // } catch (err) {
  //     res.status(400).json({ errors: 'oops something when wrong in login' })
  // }


    //check to see if email is in database
    const admin = await Admin.findOne({ email: req.body.email });
    console.log(admin);
    if (!admin) {
      //if the user's email is not found/not match... render error message
      console.log("invalid admin");
      res.status(400).json({ error: "Invalid email/password" });
      return;
    }
    try {
      //if the user email is found, continue to compare pw
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        admin.password
      );
      console.log(isPasswordValid);
      if (!isPasswordValid) {
        //if the user's pw does not match records.. render error message
        res.status(400).json({ error: "Invalid email/password" });
      } else {
        //if both req.body email and pw match data in db, create json web token

        // const adminToken = jwt.sign({ _id: admin._id, email: admin.email },SECRET)
        // res.status(201).cookie("adminToken", adminToken, {httpOnly: true,expires: new Date(Date.now() + 90000)}).json({ successMessage: "Admin logged in", admin: admin });
        res.status(201).json({ successMessage: "Admin logged in", admin: admin });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid email/password" });
    }
  },

  logoutAdmin: (req, res) => {
    //clear cookie from the browser
    res.clearCookie("adminToken");
    res.json({ success: "Admin logged out" });
  },
};
