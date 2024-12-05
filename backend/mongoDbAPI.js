require('dotenv').config();

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error', err);
    });

const reviewSchema = new mongoose.Schema({
    restaurant: String, rating: Number, title: String, review: String
});
const Review = mongoose.model('Review', reviewSchema);

async function deleteAllDocuments() {
    try {
        await Review.deleteMany({});
        console.log('DB resetted successfully');
    } catch (e) {
        console.log('Error resetting DB');
    }
}

deleteAllDocuments();

const setRatings = async () => {
    const pipeline = [{
        $group: {
            _id: "$restaurant", averageRating: {$avg: "$rating"},
        }
    }, {
        $project: {
            _id: 1, averageRating: {$round: ["$averageRating", 2]} // Redondea a 2 decimales
        }
    }];

    const result = await Review.aggregate(pipeline);
    const avgRatings = {};
    result.map((item) => {
        avgRatings[item._id] = item.averageRating;
    });

    return avgRatings;
};

router.get('/ratings', async (req, res) => {
    const ratings = await setRatings();
    return res.status(201).json({message: 'Ratings fetched successfully', data: ratings});
});

const validations = require('./mongoDbValidation.js');

router.post('/', async (req, res) => {
    const {restaurant, rating, title, review} = req.body;
    let validationError = validations.validateRestaurant(restaurant) ||
        validations.validateRating(rating) ||
        validations.validateTitle(title) ||
        validations.validateReview(review);
    if (validationError) {
        return res.status(400).json({message: validationError});
    }
    try {
        const newReview = new Review({
            restaurant, rating, title, review
        });
        await newReview.save();
        setRatings();

        return res.json({message: 'Review saved successfully'});
    } catch (err) {
        return res.json({message: 'Error saving review', error: err});
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        return res.json({message: 'Reviews fetched successfully', data: reviews});
    } catch (err) {
        return res.json({message: 'Error fetching reviews', error: err});
    }
});

function validateId(id) {
    if (!id) {
        return 'Please provide an id'
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return 'Invalid id'
    }
}

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    let idValidationError = validateId(id);
    if (idValidationError) {
        return res.status(400).json({message: idValidationError});
    }

    try {
        await Review.findByIdAndDelete(id);
        setRatings();
        return res.json({message: 'Review deleted successfully'});
    } catch (err) {
        return res.json({message: 'Error deleting review', error: err});
    }
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const idValidationError = validateId(id);
    if (idValidationError) {
        return res.status(400).json({message: idValidationError});
    }

    const {restaurant, rating, title, review} = req.body;
    let validationError = validations.validateRestaurant(restaurant) ||
        validations.validateRating(rating) ||
        validations.validateTitle(title) ||
        validations.validateReview(review);
    if (validationError) {
        return res.status(400).json({message: validationError});
    }
    try {
        await Review.findByIdAndUpdate(id, {
            restaurant, rating, title, review
        });
        setRatings();
        return res.json({message: 'Review updated successfully'});
    } catch (err) {
        return res.json({message: 'Error updating review', error: err});
    }
});

module.exports = router;
