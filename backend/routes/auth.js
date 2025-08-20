const express = require('express');
const router = express.Router();
const model = require('../models');

router.post("/login", (req, res) => {
    res.json({ message: "login route is working" });
});

router.get("/me", (req, res) => {
    //
});