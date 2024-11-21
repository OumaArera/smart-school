import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import AuthContext from './AuthContext';
import { useContext } from 'react';

const ProtectedRoute = ({ element, roleRequired, ...props }) => {
  const { auth } = useContext(AuthContext);

  if (!auth) {
    return <Navigate to="/login" />;
  }

  const { role } = auth;

  if (roleRequired && role !== roleRequired && role !== 'director') {
    return <Navigate to="/" />;
  }

  return <Route {...props} element={element} />;
};

export default ProtectedRoute;
