import React, {useContext, useEffect, useState} from "react";
import {SharedStateContext} from "./SharedStateContext";

const sw = require('sweetalert2');

function NoSQLTable() {

    const {restaurants, setRestaurants} = useContext(SharedStateContext);
    const {setRestaurantsList} = useContext(SharedStateContext);
    const [reviews, setReviews] = useState([]);
    const [reviewToModify, setReviewToModify] = useState(null);


    const updateReviews = async () => {
        try {
            await fetch(process.env.REACT_APP_MONGO_DB_API, {
                method: 'GET', headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json()).then(data => {
                setReviews(data.data);
            });
        } catch (e) {
            console.log(e);
        }
    };

    const updateRestaurants = async () => {
        try {
            await fetch(process.env.REACT_APP_MYSQL_API + '/restaurants', {
                method: 'GET', headers: {
                    'Content-Type': 'application/json',
                },
            }).then(res => res.json()).then(data => {
                setRestaurants(data.data);
            });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        updateReviews();
        updateRestaurants();
    }, []);

    const sendReview = async (event) => {
        event.preventDefault();

        const restaurant = document.getElementById('restaurante').value;
        const rating = parseInt(document.getElementById('calificacion').value);
        const title = document.getElementById('titulo-review').value;
        const review = document.getElementById('descripcion').value;

        const data = {
            restaurant: restaurant, rating: rating, title: title, review: review
        };
        try {
            const res = await fetch(process.env.REACT_APP_MONGO_DB_API, {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(data),
            });
            if (res.status === 400) {
                return res.json().then(data => {
                    if (data.message) {
                        sw.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message
                        });
                    }
                });
            }
            const resData = await res.json();
            await updateReviews();
            await updateRatings();

        } catch (e) {
            console.log(e);
        }
    }


    const deleteReview = async (e, id) => {
        e.preventDefault();
        try {
            await fetch(process.env.REACT_APP_MONGO_DB_API + `/${id}`, {
                method: "DELETE", headers: {
                    'Content-Type': 'application/json',
                }
            });
            await updateReviews();
            await updateRatings();
        } catch (e) {
            console.log(e);
        }
    }

    const updateRatings = async () => {
        try {
            const res = await fetch(process.env.REACT_APP_MYSQL_API, {
                method: 'GET', headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            setRestaurantsList(data.data);
        } catch (e) {
            console.log(e);
        }
    };

    const modifyReview = async () => {
        const restaurant = document.getElementById("r-restaurant-" + reviewToModify).value;
        const rating = parseInt(document.getElementById("r-rating-" + reviewToModify).value);
        const title = document.getElementById("r-title-" + reviewToModify).value;
        const review = document.getElementById("r-review-" + reviewToModify).value;
        const data = {
            restaurant: restaurant, rating: rating, title: title, review: review
        }
        try {
            await fetch(process.env.REACT_APP_MONGO_DB_API + `/${reviewToModify}`, {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(data),
            }).then(res => {
                if (res.status === 400) {
                    return res.json().then(data => {
                        if (data.message) {
                            sw.fire({
                                icon: 'error',
                                title: 'Error',
                                text: data.message
                            });
                        }
                    });
                }
                updateReviews();
                updateRatings();
            })
        } catch (e) {
            console.log(e);
        }
    }

    const cleanReview = (e) => {
        e.preventDefault();
        document.getElementById('restaurante').value = "";
        document.getElementById('calificacion').value = "";
        document.getElementById('titulo-review').value = "";
        document.getElementById('descripcion').value = "";
    }

    return (<div id="no-sql-section" className="table">
        <div id="no-sql-form">

            <form action="/submit" method="POST">
                <p className="form-title">Agrega una reseña</p>
                <label className="block text-sm font-medium text-gray-700"
                       htmlFor="restaurante">Restaurante</label>
                <select className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                        id="restaurante" name="restaurante" required>
                    {Array.isArray(restaurants) && restaurants.length > 0 ? (restaurants.map(restaurant => (
                        <option key={"option" - restaurant.id}
                                value={restaurant.name}>{restaurant.name}</option>))) : (
                        <option>No hay restaurantes disponibles</option>)}
                </select>
                <br></br>

                <label className="block text-sm font-medium text-gray-700"
                       htmlFor="calificacion">Estrellas</label>
                <select className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                        id="calificacion" name="calificacion" required>
                    {[...Array(5)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>

                <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Título</label>
                <input
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    type="text" id="titulo-review" name="nombre" placeholder="Coloca un título" required/>
                <br></br>


                <div>
                    <label id="textarea-desc" className="block text-sm font-medium text-gray-700" htmlFor="descripcion"
                    >Descripción</label>

                    <div
                        className="overflow-hidden rounded-lg border border-black shadow-sm"
                    >
                        <textarea
                            id="descripcion"
                            className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
                            rows="4"
                            placeholder="Descripción de tu reseña"
                        ></textarea>

                        <div className="flex items-center justify-end gap-2 bg-white p-3">
                            <button
                                type="button"
                                className="rounded bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-600"
                                onClick={(e) => cleanReview(e)}
                            >
                                Borrar
                            </button>
                            <button type="submit"
                                    className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-400"
                                    onClick={(e) => {
                                        sendReview(e);
                                        cleanReview(e)
                                    }}>Enviar
                            </button>

                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div id="reviews" className="mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <h2 className="text-center text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Reseñas por parte de los usuarios
            </h2>
            <div className="mt-8 [column-fill:_balance] sm:columns-2 sm:gap-6 lg:columns-3 lg:gap-8">
                {(Array.isArray(reviews) && reviews.length > 0) ? (reviews.map(review => (
                    <div key={review._id} className="mb-8 sm:break-inside-avoid">
                        <blockquote className="rounded-lg bg-gray-50 p-6 shadow-sm sm:p-8">
                            <div className="flex items-center gap-4">


                                <div>
                                    {(reviewToModify == review._id) ? (
                                        <div>
                                            <div>

                                                <select className="rounded-lg p-1" id={"r-rating-" + review._id}
                                                        name="calificacion"
                                                        defaultValue={review.rating} required>
                                                    {[...Array(5)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>) : (
                                        <div className="flex">
                                            {[...Array(Number(review.rating))].map(_ => (<svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="size-5"
                                                viewBox="0 0 20 20"
                                                fill="coral"
                                            >
                                                <path
                                                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                />
                                            </svg>))}
                                        </div>
                                    )}

                                    {(reviewToModify == review._id) ? (
                                        <select id={"r-restaurant-" + review._id}
                                                className="rounded-lg p-1 mt-0.5 text-gray-400"
                                                defaultValue={review.restaurant}>
                                            {restaurants.map(restaurant => (
                                                <option key={restaurant.id}
                                                        value={restaurant.name}>{restaurant.name}</option>))}
                                        </select>) : (
                                        <p className="mt-0.5 text-gray-400">{review.restaurant}</p>)}


                                    {(reviewToModify == review._id) ? (
                                        <input className="rounded-lg p-1 mt-0.5 text-lg font-medium text-gray-900"
                                               id={"r-title-" + review._id}
                                               defaultValue={review.title}/>
                                    ) : (
                                        <p className="mt-0.5 text-lg font-medium text-gray-900">{review.title}</p>
                                    )}

                                </div>
                            </div>

                            {(reviewToModify == review._id) ? (
                                <textarea className="rounded-lg mt-4 text-gray-700 p-3" id={"r-review-" + review._id}
                                          defaultValue={review.review}/>) : (
                                <p className="mt-4 text-gray-700"
                                   key={"review-" + review._id}>{review.review}</p>)}
                            <br></br>


                            {(reviewToModify !== review._id) ? (<button key={"edit-" + review._id}
                                                                        className="inline-block rounded bg-blue-400 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                                                                        onClick={e => setReviewToModify(review._id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20}
                                         height={20} color={"#ffffff"} fill={"none"}>
                                        <path
                                            d="M6.53792 2.32172C6.69664 1.89276 7.30336 1.89276 7.46208 2.32172L8.1735 4.2443C8.27331 4.51403 8.48597 4.72669 8.7557 4.8265L10.6783 5.53792C11.1072 5.69664 11.1072 6.30336 10.6783 6.46208L8.7557 7.1735C8.48597 7.27331 8.27331 7.48597 8.1735 7.7557L7.46208 9.67828C7.30336 10.1072 6.69665 10.1072 6.53792 9.67828L5.8265 7.7557C5.72669 7.48597 5.51403 7.27331 5.2443 7.1735L3.32172 6.46208C2.89276 6.30336 2.89276 5.69665 3.32172 5.53792L5.2443 4.8265C5.51403 4.72669 5.72669 4.51403 5.8265 4.2443L6.53792 2.32172Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                        <path
                                            d="M14.4039 9.64136L15.8869 11.1244M6 22H7.49759C8.70997 22 9.31617 22 9.86124 21.7742C10.4063 21.5484 10.835 21.1198 11.6923 20.2625L19.8417 12.1131C20.3808 11.574 20.6503 11.3045 20.7944 11.0137C21.0685 10.4605 21.0685 9.81094 20.7944 9.25772C20.6503 8.96695 20.3808 8.69741 19.8417 8.15832C19.3026 7.61924 19.0331 7.3497 18.7423 7.20561C18.1891 6.93146 17.5395 6.93146 16.9863 7.20561C16.6955 7.3497 16.426 7.61924 15.8869 8.15832L7.73749 16.3077C6.8802 17.165 6.45156 17.5937 6.22578 18.1388C6 18.6838 6 19.29 6 20.5024V22Z"
                                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            ) : (
                                <button key={"save-" + review._id}
                                        className="inline-block rounded bg-blue-400 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                                        onClick={(e) => {
                                            setReviewToModify(null);
                                            modifyReview();
                                        }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20}
                                         height={20} color={"#ffffff"} fill={"none"}>
                                        <path
                                            d="M11.4743 17.3058C14.4874 14.0819 17.3962 11.8949 21.0501 8.79776C22.1437 7.87072 22.3126 6.24578 21.4547 5.09453C20.5429 3.87098 18.8103 3.62642 17.6376 4.59913C14.2907 7.37521 11.6868 10.0482 9.21679 12.9051C9.08718 13.055 9.02237 13.13 8.95511 13.1722C8.78453 13.2792 8.57138 13.2803 8.3997 13.1751C8.33199 13.1336 8.26707 13.0601 8.13722 12.9131L6.82103 11.4229C5.6201 10.0631 3.46608 10.2137 2.46339 11.7274C1.76171 12.7867 1.86569 14.1905 2.71567 15.1334L4.7796 17.4229C6.32334 19.1353 7.09521 19.9916 8.02185 19.9999C8.94849 20.0083 9.79043 19.1075 11.4743 17.3058Z"
                                            stroke="currentColor" strokeWidth="1.5"/>
                                    </svg>
                                </button>)}

                            <button
                                className="mx-1 inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                                onClick={e => deleteReview(e, review._id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20}
                                     height={20} color={"#ffffff"} fill={"none"}>
                                    <path
                                        d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path
                                        d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
                                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round"/>
                                    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5"
                                          strokeLinecap="round"/>
                                </svg>
                            </button>
                        </blockquote>
                    </div>))) : (<p>No reviews</p>)}
            </div>
        </div>
    </div>);
}

export default NoSQLTable;