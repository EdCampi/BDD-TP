import React, {createContext, useState} from 'react';

export const SharedStateContext = createContext();

export const SharedStateProvider = ({children}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [listWithRatings, setListWithRatings] = useState({});

    // Uso un sistema de "alertas" para forzar a los componentes a renderizar
    // -> Solo lo uso para actualizar reviews al eliminar un restaurante.
    const [ping, setPing] = useState(0);

    return (
        <SharedStateContext.Provider
            value={{
                restaurants,
                setRestaurants,
                restaurantsList,
                setRestaurantsList,
                listWithRatings,
                setListWithRatings,
                ping,
                setPing
            }}>
            {children}
        </SharedStateContext.Provider>
    );
};
