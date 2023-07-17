import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';

export const ToastContext = React.createContext(null);

export const ToastProvider = ({ children }) => {
    const toast = useRef(null);

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <Toast ref={toast} />
        </ToastContext.Provider>
    );
};