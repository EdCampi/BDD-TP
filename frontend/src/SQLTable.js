import React, {useContext, useEffect, useState} from "react";
import {SharedStateContext} from './SharedStateContext';

function SQLTable() {

    //Lista de dicts filtrada x unicos en name.
    const {_, setRestaurants} = useContext(SharedStateContext);

    const [restaurant, setRestaurant] = useState('');
    const [rating, setRating] = useState('0');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('$');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [editor, setEditor] = useState(false);

    const [rowToModify, setRowToModify] = useState(null);

    // Lista de dicts para rellenar tabla.
    const {restaurantsList, setRestaurantsList} = useContext(SharedStateContext);

    useEffect(() => {
        // Modularizar
        const fetchData = async () => {
            const tableData = await fetch('http://localhost:3001/sqlAPI/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const tableDataJSON = await tableData.json();
            setRestaurantsList(tableDataJSON.data);
        };
        fetchData();
    }, [rowToModify]);

    const deleteRow = async (id) => {
        const res = await fetch(process.env.REACT_APP_MYSQL_API + `/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const tableData = await fetch(process.env.REACT_APP_MYSQL_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const tableDataJSON = await tableData.json();
        setRestaurantsList(tableDataJSON.data);
        const uniqueRestaurants = [...new Map(tableDataJSON.data.map(item => [item['name'], item])).values()];
        setRestaurants(uniqueRestaurants);
    };

    const modifyRow = async (id) => {
        if (editor && rowToModify !== id) {
            return;
        }

        setEditor(!editor);

        if (editor) {
            const data = {
                restaurant: document.getElementById(`nombre-${id}`).value,
                rating: document.getElementById(`calificacion-${id}`).value,
                category: document.getElementById(`categoria-${id}`).value,
                price: document.getElementById(`precio-${id}`).value,
                address: document.getElementById(`direccion-${id}`).value,
                phone: document.getElementById(`telefono-${id}`).value
            }
            const _ = await fetch(process.env.REACT_APP_MYSQL_API + `/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const tableData = await fetch(process.env.REACT_APP_MYSQL_API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const tableDataJSON = await tableData.json();
            setRowToModify(null);
            setRestaurantsList(tableDataJSON.data);
        }
    };


    const sendData = async (e) => {
        e.preventDefault();
        const data = {
            restaurant: restaurant,
            rating: rating,
            category: category,
            price: price,
            address: address,
            phone: phone
        }
        const _ = await fetch(process.env.REACT_APP_MYSQL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const tableData = await fetch(process.env.REACT_APP_MYSQL_API, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const tableDataJSON = await tableData.json();
        setRestaurantsList(tableDataJSON.data);
        //dame codigo para filtrar la lista de dicts restaurantsList por unicos en name
        const uniqueRestaurants = [...new Map(tableDataJSON.data.map(item => [item['name'], item])).values()];
        setRestaurants(uniqueRestaurants);
    }

    return (
        <div id="sql-section" className="table">
            <div id="sql-form">

                <form method="POST" onSubmit={event => {
                    sendData(event)
                }}>
                    <p className="form-title">Agregá un restaurante</p>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="nombre">Nombre</label>
                    <input type="text" placeholder="Ingresar nombre" type="text" id="nombre" name="nombre"
                           value={restaurant}
                           className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                           onChange={(e) => setRestaurant(e.target.value)} required/>
                    <br></br>

                    <label className="block text-sm font-medium text-gray-700" htmlFor="categoria">Tipo de
                        comida</label>
                    <input placeholder="Ingresar categoría" tpye="text" id="categoria" name="categoria" value={category}
                           className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                           onChange={(e) => setCategory(e.target.value)} required/>
                    <br></br>
                    <label className="block text-sm font-medium text-gray-700" htmlFor="precios"
                           className="block text-sm font-medium text-gray-900">Rango de
                        precios</label>
                    <select id="precios" name="precios" value={price} onChange={(e) => setPrice(e.target.value)}
                            className="mt-1.5 w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm"
                            required>
                        <option value="$">$</option>
                        <option value="$$">$$</option>
                        <option value="$$$">$$$</option>
                    </select>
                    <br></br>

                    <label className="block text-sm font-medium text-gray-700"
                           htmlFor="direccion">Dirección</label>
                    <input placeholder="Ingresar dirección" type="text" id="apellido" name="direccion" value={address}
                           className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                           onChange={(e) => setAddress(e.target.value)} required/>
                    <br></br>

                    <label className="block text-sm font-medium text-gray-700"
                           htmlFor="telefono">Teléfono</label>
                    <input type="tel" id="telefono" name="telefono" pattern="[0-9]{10,15}" placeholder="Solo números"
                           className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                           value={phone} onChange={(e) => setPhone(e.target.value)}
                    />
                    <br></br>

                    <button type="submit"
                            className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white">Enviar
                    </button>
                </form>
            </div>
            <div id="sql-table" className="overflow-x-auto">
                <h2 className="text-center text-4xl my-6 font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Lista de restaurantes
                </h2>


                <div className="center overflow-x-auto rounded-lg">
                    <table className="w-full divide-y-2 divide-gray-200 bg-gray-50 text-sm">
                        <thead className="h-12 ltr:text-left rtl:text-right">
                        <tr>
                            <th className="thname whitespace-nowrap px-5 py-2 font-medium text-gray-900">Nombre</th>
                            <th className="thrating whitespace-nowrap px-4 py-2 font-medium text-gray-900">Rating</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Comida</th>
                            <th className="thprice whitespace-nowrap px-4 py-2 font-medium text-gray-900">Precios</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Dirección</th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Teléfono</th>
                            <th className="thbtns whitespace-nowrap px-4 py-2 font-medium text-gray-900"></th>
                            <th className="px-4 py-2"></th>
                        </tr>
                        </thead>
                        <tbody id="sql-table" className="divide-y divide-gray-200">

                        {(Array.isArray(restaurantsList) && restaurantsList.length > 0) ? (
                            restaurantsList.map(restaurant => (
                                <tr key={restaurant.id}>
                                    <td className="tname whitespace-nowrap px-4 py-2 font-medium text-gray-900">{rowToModify === restaurant.id ? (
                                        <input
                                            className="update-input rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                            id={"nombre-" + restaurant.id} type="text" value={restaurant.name}
                                            onChange={(e) => {
                                                const updatedRestaurants = restaurantsList.map(r => r.id === restaurant.id ? {
                                                    ...r,
                                                    name: e.target.value
                                                } : r);
                                                setRestaurantsList(updatedRestaurants);
                                            }}/>
                                    ) : (
                                        restaurant.name
                                    )}</td>
                                    <td id={"calificacion-" + restaurant.id}
                                        className="trating whitespace-nowrap px-4 py-2 text-gray-700">{restaurant.rating}</td>
                                    <td className="tcategory whitespace-nowrap px-4 py-2 text-gray-700">
                                        {rowToModify === restaurant.id ? (
                                            <input
                                                className="update-input  rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                                id={"categoria-" + restaurant.id} type="text"
                                                value={restaurant.category}
                                                onChange={(e) => {
                                                    const updatedRestaurants = restaurantsList.map(r => r.id === restaurant.id ? {
                                                        ...r,
                                                        category: e.target.value
                                                    } : r);
                                                    setRestaurantsList(updatedRestaurants);
                                                }}/>
                                        ) : (
                                            restaurant.category
                                        )}
                                    </td>
                                    <td className="tprice whitespace-nowrap px-4 py-2 text-gray-700">
                                        {rowToModify === restaurant.id ? (
                                            <select id={"precio-" + restaurant.id} value={restaurant.price}
                                                    onChange={(e) => {
                                                        const updatedRestaurants = restaurantsList.map(r => r.id === restaurant.id ? {
                                                            ...r,
                                                            price: e.target.value
                                                        } : r);
                                                        setRestaurantsList(updatedRestaurants);
                                                    }}>
                                                <option value="$">$</option>
                                                <option value="$$">$$</option>
                                                <option value="$$$">$$$</option>
                                            </select>
                                        ) : (
                                            restaurant.price
                                        )}
                                    </td>
                                    <td className="taddress whitespace-nowrap px-4 py-2 text-gray-700">
                                        {rowToModify === restaurant.id ? (
                                            <input
                                                className="update-input  rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                                id={"direccion-" + restaurant.id} type="text"
                                                value={restaurant.address}
                                                onChange={(e) => {
                                                    const updatedRestaurants = restaurantsList.map(r => r.id === restaurant.id ? {
                                                        ...r,
                                                        address: e.target.value
                                                    } : r);
                                                    setRestaurantsList(updatedRestaurants);
                                                }}/>
                                        ) : (
                                            restaurant.address
                                        )}
                                    </td>
                                    <td className="tphone whitespace-nowrap px-4 py-2 text-gray-700">{rowToModify === restaurant.id ? (
                                        <input
                                            className="update-input  rounded-md border border-gray-200 shadow-sm sm:text-sm"
                                            id={"telefono-" + restaurant.id} type="text" value={restaurant.phone}
                                            onChange={(e) => {
                                                const updatedRestaurants = restaurantsList.map(r => r.id === restaurant.id ? {
                                                    ...r,
                                                    phone: e.target.value
                                                } : r);
                                                setRestaurantsList(updatedRestaurants);
                                            }}/>
                                    ) : (
                                        restaurant.phone
                                    )}</td>
                                    <td className="tbtns whitespace-nowrap px-4 py-2">
                                        {(editor === true && rowToModify === restaurant.id) ? (
                                            <button
                                                className="inline-block rounded bg-blue-400 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setRowToModify(restaurant.id);
                                                    modifyRow(restaurant.id);
                                                }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20}
                                                     height={20} color={"#ffffff"} fill={"none"}>
                                                    <path
                                                        d="M11.4743 17.3058C14.4874 14.0819 17.3962 11.8949 21.0501 8.79776C22.1437 7.87072 22.3126 6.24578 21.4547 5.09453C20.5429 3.87098 18.8103 3.62642 17.6376 4.59913C14.2907 7.37521 11.6868 10.0482 9.21679 12.9051C9.08718 13.055 9.02237 13.13 8.95511 13.1722C8.78453 13.2792 8.57138 13.2803 8.3997 13.1751C8.33199 13.1336 8.26707 13.0601 8.13722 12.9131L6.82103 11.4229C5.6201 10.0631 3.46608 10.2137 2.46339 11.7274C1.76171 12.7867 1.86569 14.1905 2.71567 15.1334L4.7796 17.4229C6.32334 19.1353 7.09521 19.9916 8.02185 19.9999C8.94849 20.0083 9.79043 19.1075 11.4743 17.3058Z"
                                                        stroke="currentColor" strokeWidth="1.5"/>
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                className="inline-block rounded bg-blue-400 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setRowToModify(restaurant.id);
                                                    modifyRow(restaurant.id);
                                                }}>
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
                                        )}
                                        <button
                                            className="mx-1 inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                                            onClick={() => deleteRow(restaurant.id)}>
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
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">No hay
                                    restaurantes
                                    disponibles
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    );
};

export default SQLTable;