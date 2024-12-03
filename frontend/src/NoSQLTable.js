import React, {useContext, useEffect, useState} from "react";
import {SharedStateContext} from "./SharedStateContext";

function NoSQLTable() {

    const {restaurants, setRestaurants} = useContext(SharedStateContext);
    const {_, setRestaurantsList} = useContext(SharedStateContext);
    const [reviews, setReviews] = useState([]);
    const [reviewToModify, setReviewToModify] = useState(null);


    const updateReviews = async () => {
        const res = await fetch(process.env.REACT_APP_MONGO_DB_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const resJSON = await res.json();
        setReviews(resJSON.data);
    };

    const updateRestaurants = async () => {
        const res = await fetch(process.env.REACT_APP_MYSQL_API+'/restaurants', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const resJSON = await res.json();
        setRestaurants(resJSON.data);
    };

    useEffect(() => {
        updateReviews();
        updateRestaurants();
    }, []);

    const sendReview = async (event) => {
        event.preventDefault();

        const restaurant = document.getElementById('restaurante').value;
        const rating = document.getElementById('calificacion').value;
        const title = document.getElementById('titulo-review').value;
        const review = document.getElementById('descripcion').value;

        const data = {
            restaurant: restaurant,
            rating: rating,
            title: title,
            review: review
        };
        const res = await fetch(process.env.REACT_APP_MONGO_DB_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const resJSON = await res.json();
        updateReviews();
        updateRatings();
    }


    const deleteReview = async (e, id) => {
        e.preventDefault();
        const res = await fetch(process.env.REACT_APP_MONGO_DB_API+`/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            }
        });
        updateReviews();
        updateRatings();
    }

    const updateRatings = async () => {
        const res = await fetch(process.env.REACT_APP_MYSQL_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        setRestaurantsList(data.data);
    };

    const modifyReview = async () => {
        const restaurant = document.getElementById("r-restaurant-" + reviewToModify).value;
        const rating = document.getElementById("r-rating-" + reviewToModify).value;
        const title = document.getElementById("r-title-" + reviewToModify).value;
        const review = document.getElementById("r-review-" + reviewToModify).value;
        const data = {
            restaurant: restaurant,
            rating: rating,
            title: title,
            review: review
        }
        const res = await fetch(process.env.REACT_APP_MONGO_DB_API+`/${reviewToModify}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const resJSON = await res.json();
        updateReviews();
        updateRatings();
    }

    return (
        <div id="no-sql-section" className="table">
            <div id="no-sql-form">
                <form action="/submit" method="POST">

                    <label htmlFor="restaurante">Restaurante</label>
                    <select id="restaurante" name="restaurante" required>
                        {Array.isArray(restaurants) && restaurants.length > 0 ? (
                            restaurants.map(restaurant => (
                                    <option key={"option" - restaurant.id}
                                            value={restaurant.name}>{restaurant.name}</option>
                            ))
                        ) : (
                            <option>No hay restaurantes disponibles</option>
                        )}
                    </select>
                    <br></br>

                    <label htmlFor="calificacion">Calificación:</label>
                    <input type="range" id="calificacion" name="calificacion" min="0" max="5" step="1" required/>
                    <br></br>

                    <label htmlFor="nombre">Titulo:</label>
                    <input type="text" id="titulo-review" name="nombre" required/>
                    <br></br>

                    <label htmlFor="descripcion">Descripción:</label>
                    <input type="text" id="descripcion" name="descripcion" required/>
                    <br></br>

                    <button type="submit" onClick={(e) => sendReview(e)}>Enviar</button>
                </form>
            </div>
            <div id="reviews">
                {Array.isArray(reviews) && reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="review-section">
                            {(reviewToModify == review._id) ? (<input id={"r-restaurant-"+review._id} defaultValue={review.restaurant}/>) : (
                                <h4 key={"restaurant-" + review._id}>{review.restaurant}</h4>)}

                            {(reviewToModify == review._id) ? (<div><input id={"r-title-"+review._id} defaultValue={review.title}/><input
                                type="range" id={"r-rating-"+review._id} name="calificacion" min="0" max="5" step="1" defaultValue={review.rating} required/>
                            </div>) : (<h2
                                key={"title-" + review._id}>{review.title} ({review.rating})</h2>)}

                            {(reviewToModify == review._id) ? (<input id={"r-review-"+review._id} defaultValue={review.review}/>) : (
                                <p key={"review-" + review._id}>{review.review}</p>)}

                            {(reviewToModify == null) ? (<button key={"edit-" + review._id}
                                                                 onClick={e => setReviewToModify(review._id)}>Editar</button>) : (
                                <button key={"save-" + review._id}
                                        onClick={(e) => {
                                            setReviewToModify(null);
                                            modifyReview();
                                        }
                                        }>Guardar</button>)}
                            <button key={"delete-" + review._id} onClick={e => deleteReview(e, review._id)}>Eliminar
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No reviews available</p>
                )}
            </div>

        </div>);
}

export default NoSQLTable;