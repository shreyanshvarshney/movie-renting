const express = require("express");
const router = express.Router();
const {Customer, validateCustomer, validateUpdateCustomer, validateObjectId} = require("../models/customer");
const debug = require("debug")("app:routes.customers.js");
const checkAuth = require("../middlewares/check-auth");


router.get("", async (req, res, next) => {
    const result = await Customer.find().sort({name: 1}).select({__v: false});
    const count = await Customer.countDocuments();
    res.status(200).json({data: result, count: count});
});

router.get("/:id", async (req, res, next) => {
    const cId = req.params.id;
    if (!validateObjectId(cId)) return res.status(404).json({message: "Customer Not Found with this ID!"});
    try {
        const result = await Customer.findById(cId).select({__v: false});
        if (!result) return res.status(404).json({message: "Customer Not Found with this ID!"});
        res.status(200).json({data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post("", checkAuth, async (req, res, next) => {
    debug(req.body);
    const error = validateCustomer(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        isPremium: req.body.isPremium,
        phone: req.body.phone
    });
    try {
        const result = await customer.save();
        res.status(201).json({message: "Successfully Created", data: result});
    } catch (err) {
        if (err.name === "MongoError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
});

router.patch("/:id", checkAuth, async (req, res, next) => {
    const cId = req.params.id;
    if (!validateObjectId(cId)) return res.status(404).json({message: "Customer Not Found with this ID!"});

    const error = validateUpdateCustomer(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    // const customer = new Customer({
    //     _id: cId,
    //     name: req.body.name,
    //     isPremium: req.body.isPremium,
    //     phone: req.body.phone
    // });
    // $set is a mongodb update operator to directly update in the document.
    const customer = {
        $set: req.body
        // As req.body is itself an Object
        // This approach will update/set only the fields mentioned in my req.body
    }
    try {
        const result = await Customer.findByIdAndUpdate(cId, customer, {new: true, runValidators: true}).select({__v: false});
        if (!result) return res.status(404).json({message: "Customer Not Found with this ID!"});
        res.status(200).json({message: "Updated Successfully", data: result});
    } catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({message: err.message});
        res.status(500).json({message: err.message});
    }
});

router.delete("/:id", checkAuth, async (req, res, next) => {
    const cId = req.params.id;
    if (!validateObjectId(cId)) return res.status(404).json({message: "Customer Not Found with this ID!"});
    try {
        const result = await Customer.findByIdAndRemove(cId).select({__v: false});
        if (!result) return res.status(404).json({message: "Customer Not Found with this ID!"});
        res.status(200).json({message: "Deleted Successfully!", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;