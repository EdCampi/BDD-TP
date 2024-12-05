function validateRestaurant(restaurant) {
    if (!restaurant) {
        return "Please enter a restaurant name"
    }
}

function validateRating(rating) {
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
        return "Rating must be an integer between 1 and 5"
    }
    if (!rating) {
        return "Please enter a rating"
    }
}

function validateTitle(title) {
    if (title.length > 50) {
        return "Title is too large"
    }
    if (!title) {
        return "Please enter a title"
    }
}

function validateReview(review) {
    if (review.length > 500) {
        return "Review is too large"
    }
    if (!review) {
        return "Please enter a review"
    }
}

module.exports = {
    validateRestaurant,
    validateRating,
    validateTitle,
    validateReview
}