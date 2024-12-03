import {useEffect, useState, useContext } from "react";
import { SharedStateContext } from './SharedStateContext';

function SQLTable() {

    //Lista de dicts filtrada x unicos en name.
    const { _, setRestaurants } = useContext(SharedStateContext);

    const [restaurant, setRestaurant] = useState('');
    const [rating, setRating] = useState('0');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('$');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [editor, setEditor] = useState(false);

    const [rowToModify, setRowToModify] = useState(null);

    // Lista de dicts para rellenar tabla.
    const { restaurantsList, setRestaurantsList } = useContext(SharedStateContext);

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
        const res = await fetch(process.env.REACT_APP_MYSQL_API+`/${id}`, {
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
            const _ = await fetch(process.env.REACT_APP_MYSQL_API+`/${id}`, {
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
                <form action="/submit" method="POST" onSubmit={e => sendData(e)}>
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" value={restaurant}
                           onChange={(e) => setRestaurant(e.target.value)} required/>
                    <br></br>

                    <label htmlFor="categoria">Tipo de comida:</label>
                    <input tpye="text" id="categoria" name="categoria" value={category}
                           onChange={(e) => setCategory(e.target.value)} required/>

                    <label htmlFor="precios">Rango de precios:</label>
                    <select id="precios" name="precios" value={price} onChange={(e) => setPrice(e.target.value)}
                            required>
                        <option value="$">$</option>
                        <option value="$$">$$</option>
                        <option value="$$$">$$$</option>
                    </select>
                    <br></br>

                    <label htmlFor="direccion">Dirección:</label>
                    <input type="text" id="apellido" name="direccion" value={address}
                           onChange={(e) => setAddress(e.target.value)} required/>
                    <br></br>

                    <label htmlFor="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" name="telefono" pattern="[0-9]{10,15}" placeholder="Solo números"
                           value={phone} onChange={(e) => setPhone(e.target.value)}
                           />
                    <br></br>

                    <button type="submit">Enviar</button>
                </form>
            </div>
            <div id="sql-table">
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Rating</th>
                        <th>Comida</th>
                        <th>Precios</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                    </thead>
                    <tbody id="sql-table">
                    {(Array.isArray(restaurantsList) && restaurantsList.length > 0) ? (
                        restaurantsList.map(restaurant => (
                            <tr key={restaurant.id}>
                                <td>{rowToModify === restaurant.id ? (
                                    <input id={"nombre-" + restaurant.id} type="text" value={restaurant.name}
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
                                <td id={"calificacion-" + restaurant.id}>{restaurant.rating}</td>
                                <td>
                                    {rowToModify === restaurant.id ? (
                                        <input id={"categoria-" + restaurant.id} type="text" value={restaurant.category}
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
                                <td>
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
                                <td>
                                    {rowToModify === restaurant.id ? (
                                        <input id={"direccion-" + restaurant.id} type="text" value={restaurant.address}
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
                                <td>{rowToModify === restaurant.id ? (
                                    <input id={"telefono-" + restaurant.id} type="text" value={restaurant.phone}
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
                                <td>
                                    {(editor === true && rowToModify === restaurant.id) ? (
                                        <button onClick={e => {
                                            e.preventDefault();
                                            setRowToModify(restaurant.id);
                                            modifyRow(restaurant.id);
                                        }}>Guardar</button>
                                    ) : (
                                        <button onClick={e => {
                                            e.preventDefault();
                                            setRowToModify(restaurant.id);
                                            modifyRow(restaurant.id);
                                        }}>Editar</button>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => deleteRow(restaurant.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>No hay restaurantes disponibles</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SQLTable;