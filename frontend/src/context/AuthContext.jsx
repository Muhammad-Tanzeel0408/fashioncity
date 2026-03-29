import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, adminService } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from storage on mount
    useEffect(() => {
        const loadUser = async () => {
            // Admin token is in sessionStorage (requires login each session)
            const adminToken = sessionStorage.getItem('adminToken');
            // Regular user token is in localStorage
            const token = localStorage.getItem('token');

            if (adminToken) {
                try {
                    // Verify admin token with backend
                    const { data } = await adminService.verify();
                    setAdmin(data.admin);
                } catch (error) {
                    console.error("Admin auth error", error);
                    sessionStorage.removeItem('adminToken');
                }
            } else if (token) {
                try {
                    const { data } = await authService.getProfile();
                    setUser(data);
                } catch (error) {
                    console.error("Auth load error", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await authService.login({ email, password });
            localStorage.setItem('token', data.token);
            localStorage.removeItem('isAdmin');
            setUser(data.user);
            setAdmin(null);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await authService.register(userData);
            localStorage.setItem('token', data.token);
            localStorage.removeItem('isAdmin');
            setUser(data.user);
            toast.success('Registration successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const adminLogin = async (email, password) => {
        try {
            const { data } = await adminService.login({ email, password });
            // Store admin token in sessionStorage so it clears when browser/tab closes
            sessionStorage.setItem('adminToken', data.token);
            // Remove any regular user token
            localStorage.removeItem('token');
            setAdmin(data.admin);
            setUser(null);
            toast.success('Admin login successful!');
            return true;
        } catch (error) {
            toast.error('Admin login failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('adminToken');
        setUser(null);
        setAdmin(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{
            user,
            admin,
            loading,
            login,
            register,
            adminLogin,
            logout,
            isAuthenticated: !!user,
            isAdmin: !!admin
        }}>
            {children}
        </AuthContext.Provider>
    );
};
