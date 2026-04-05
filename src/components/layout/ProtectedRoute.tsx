import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const currentUser = localStorage.getItem('currentUser');
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Nếu muốn thì có thể parse User ra và phân quyền role nếu cần
  // const user = JSON.parse(currentUser);

  return <Outlet />;
};

export default ProtectedRoute;
