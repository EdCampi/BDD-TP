import React, {createContext, useState} from 'react';

// Crear el contexto
export const SharedStateContext = createContext();

// Proveedor del contexto
export const SharedStateProvider = ({children}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantsList, setRestaurantsList] = useState([]);
    const [ping, setPing] = useState({});

    return (
        <SharedStateContext.Provider
            value={{restaurants, setRestaurants, restaurantsList, setRestaurantsList, ping, setPing}}>
            {children}
        </SharedStateContext.Provider>
    );
};
