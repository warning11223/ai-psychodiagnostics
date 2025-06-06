import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import {ToastContainer} from "react-toastify";
import {Provider} from "react-redux";
import {persistor, store} from "./store";
import {PersistGate} from "redux-persist/integration/react";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <App/>
                    <ToastContainer/>
                </Router>
            </PersistGate>
        </Provider>
    </StrictMode>
);
