import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    rootId: number | null;
    title: string | null;
    type: string | null;
}

type AuthAction = 
    | { type: 'SET_AUTH_DETAILS'; payload: Pick<AuthState, 'accessToken' | 'refreshToken' | 'rootId' | 'title' | 'type'> }
    | { type: 'LOGOUT' };


interface AuthContextType {
    state: AuthState;
    dispatch: Dispatch<AuthAction>;
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    rootId: null,
    title: null,
    type: null,
};

// 로컬 스토리지에서 상태를 불러오는 함수
const loadStateFromLocalStorage = (): AuthState => {
    try {
        const serializedState = localStorage.getItem('authDetails');
        if (serializedState === null) {
            return initialState;
        }
        return JSON.parse(serializedState);
    } catch (error) {
        console.error("로컬 스토리지에서 불러오는게 잘못됐다", error)
        return initialState;
    }
}

// 로컬 스토리지에서 상태를 저장하는 함수
const saveStateToLocalStorage = (state: AuthState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('authDetails', serializedState);
    } catch (error) {
        console.log("로컬스토리지에 저장안됐어..", error)
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'SET_AUTH_DETAILS':
            const newState = {
                ...state,
                ...action.payload,
                isAuthenticated: true,
            };
            saveStateToLocalStorage(newState);
            return newState;
        case 'LOGOUT':
            saveStateToLocalStorage(initialState);
            return {
                ...initialState,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState, loadStateFromLocalStorage);

    useEffect(() => {
        saveStateToLocalStorage(state);
    }, [state]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
