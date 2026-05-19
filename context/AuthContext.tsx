import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchCurrentUser, logoutUser } from '@/api/auth';
import type { User } from '@/api/users';

const AUTH_STORAGE_KEY = '@auth_user';

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const saveUser = async (userData: User | null) => {
        setUser(userData);

        if (userData) {
            await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        } else {
            await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
    };

    const refreshUser = async () => {
        const currentUser = await fetchCurrentUser();
        await saveUser(currentUser);
        return currentUser;
    };

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const savedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }

                await refreshUser();
            } catch (e) {
                console.error('Failed to restore auth session', e);
                await saveUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        restoreSession();
    }, []);

    const login = async (userData: User) => {
        await saveUser(userData);
    };

    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            await saveUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (undefined === context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
