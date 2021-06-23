const express = require("express");
const router = express.Router();
const {Customer, validateCustomer} = require("../models/customer");
const debug = require("debug")("app:routes.customers.js");


router.get("", async (req, res, next) => {
    const result = await Customer.find().sort({name: 1}).select({__v: false});
    const count = await Customer.countDocuments();
    res.status(200).json({data: result, count: count});
});

router.get("/:id", async (req, res, next) => {
    const cId = req.params.id;
    try {
        const result = await Customer.findById(cId).select({__v: false});
        if (!result) throw new Error();
        res.status(200).json({data: result});
    } catch (err) {
        res.status(404).json({message: "Customer Not Found with this ID!"});
    }
});

router.post("", async (req, res, next) => {
    debug(req.body);
    const error = validateCustomer(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }
    const customer = new Customer({
        name: req.body.name,
        isPremium: req.body.isPremium,
        phone: req.body.phone
    });
    try {
        const result = await customer.save();
        res.status(201).json({message: "Successfully Created", data: result});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.patch("/:id", async (req, res, next) => {
    const error = validateCustomer(req.body);
    if (error) {
        return res.status(400).json({message: error.message});
    }

    const cId = req.params.id;
    // const customer = new Customer({
    //     _id: cId,
    //     name: req.body.name,
    //     isPremium: req.body.isPremium,
    //     phone: req.body.phone
    // });
    const customer = {
        $set: {
            name: req.body.name,
            isPremium: req.body.isPremium,
            phone: req.body.phone
        }
    }
    try {
        const result = await Customer.findByIdAndUpdate(cId, customer, {new: true, runValidators: true}).select({__v: false});
        if (!result) throw new Error();
        res.status(200).json({message: "Updated Successfully", data: result});
    } catch (err) {
        res.status(404).json({message: "Customer Not Found with this ID!"});
    }
});

router.delete("/:id", async (req, res, next) => {
    const cId = req.params.id;
    try {
        const result = await Customer.findByIdAndRemove(cId).select({__v: false});
        if (!result) throw new Error();
        res.status(200).json({message: "Deleted Successfully!", data: result});
    } catch (err) {
        res.status(404).json({message: "Customer Not Found with this ID!"});
    }
});

module.exports = router;