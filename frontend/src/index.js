import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SQLTable from './SQLTable';
import NoSQLTable from './NoSQLTable';
import {SharedStateProvider} from './SharedStateContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <SharedStateProvider>
            <SQLTable/>
            <NoSQLTable/>
        </SharedStateProvider>

    </React.StrictMode>
);
