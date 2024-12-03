import React, { createContext, useState } from 'react';

// Crear el contexto
export const SharedStateContext = createContext();

// Proveedor del contexto
export const SharedStateProvider = ({ children }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantsList, setRestaurantsList] = useState([]);

    return (
        <SharedStateContext.Provider value={{ restaurants, setRestaurants, restaurantsList, setRestaurantsList }}>
            {children}
        </SharedStateContext.Provider>
    );
};
