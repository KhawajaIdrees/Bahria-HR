import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { normalizeUser, isAdminRole } from '../utils/authUser';

const api = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.Authorization;
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(normalizeUser(decoded, null));
        const auth = `Bearer ${token}`;
        api.defaults.headers.common.Authorization = auth;
        axios.defaults.headers.common.Authorization = auth;
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token, logout]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('token', newToken);
      const decoded = jwtDecode(newToken);
      setUser(normalizeUser(decoded, userData));
      const auth = `Bearer ${newToken}`;
      api.defaults.headers.common.Authorization = auth;
      axios.defaults.headers.common.Authorization = auth;
      setToken(newToken);

      return { success: true, role: userData.role };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: isAdminRole(user?.role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
