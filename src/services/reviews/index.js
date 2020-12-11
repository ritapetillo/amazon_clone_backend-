const express = require("express");
const router = express.Router();
const { join } = require("path");
const { writeFileJSON, readFileJSON } = require("../../lib/fsExtra.js");
const { check } = require("express-validator")
const dbPath = join(__dirname, "reviews.json");
const uniqid = require('uniqid')
const fs = require("fs")

// 1-GET | Reviews

router.get("/", async (req, res, next) => {
    try {
        const reviews = await readFileJSON(dbPath)
        res.status(200).send(reviews)
    } catch (err) {
        console.log(err)
    }

})

// 2-POST | post Reviews

router.post("/", [
    check("comment").exists(),
    check("rate").exists(),
    check("rate").isInt()
],

    async (req, res) => {
        try {
            const reviews = await readFileJSON(dbPath)
            const updatedList = [...reviews, {
                "_id": uniqid.time(),
                ...req.body,
                "createdAt": new Date()
            }];
            if (req.body.rate > 5) {
                res.send("You can rate max 5 stars")
            } else {
                await writeFileJSON(dbPath, updatedList)
                res.status(200).send('posted')
            }
            console.log(req.body)
        } catch (err) {
            console.error(err)
        }

    })

// 3-GET:ID | Reviews

router.get("/:id", (req, res, next) => {
    try {
        const buffer = fs.readFile(dbPath)
        const reviews = JSON.parse(buffer.toString())
        const filteredreviews = reviews.find(review => review.id === req.params._id)
        if (filteredreviews)
            res.status(200).send(filteredreviews)
        else {
            const err = new Error()
            err.httpStatusCode = 404
            next(err)
        }
    } catch (error) {
        console.log(error)
    }

})

//4-PUT | Reviews

router.put("/:id",
    [
        check("comment").exists(),
        check("rate").exists(),
        check("rate").isInt()
    ],
    async (req, res, next) => {
        const editedReview = {
            ...req.body,
            updatedAt: new Date(),
            _id: req.params.id,
        };

        try {
            const reviews = await readFileJSON(dbPath);
            const filteredReviews = reviews.findIndex(
                (review) => review._id === req.params.id
            );
            if (filteredReviews >= 0) {
                reviews[filteredReviews] = editedReview;
                writeFileJSON(dbPath, reviews);
                res.send("modified succefly");
            } else {
                const err = new Error();
                err.httpStatusCode = 404;
                next(err);
            }
        } catch (err) {
            next(err);
        }
    })

// 5-Delete | Reviews

router.delete("/:id", async (req, res, next) => {
    try {
        const Reviews = await readFileJSON(dbPath);
        const filteredReviews = Reviews.filter(
            (review) => review._id !== req.params.id
        );
        writeFileJSON(dbPath, filteredReviews);
        res.status(200).send("Deleted succefly");
    } catch (err) {
        console.log(err);
        next(err);
    }
});


module.exports = router
