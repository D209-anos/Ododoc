import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
        return <Navigate to="/editor" replace />;
    }

    // accessToken이 있는 경우 '/editor'로 리다이렉트, 없는 경우 children 렌더링
    return <>{children}</>;
}

export default PrivateRoute;