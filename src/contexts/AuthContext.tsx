import { createContext, ReactNode, useEffect, useState } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import {
    storageUserGet,
    storageUserRemove,
    storageUserSave,
} from "@storage/storageUser";
import {
    storageAuthTokenGet,
    storageAuthTokenRemove,
    storageAuthTokenSave,
} from "@storage/storageAuthToken";

export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: (email: string, password: string) => Promise<void>;
    isLoadingUserData: boolean;
    SignOut: () => Promise<void>;
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
    {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState({} as UserDTO);
    const [isLoadingUserData, setIsLoadingUserData] = useState(false);
    async function UserAndTokenUpdate(userData: UserDTO, token: string) {
        try {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setUser(userData);
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingUserData(false);
        }
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        await storageUserSave(userData);
        await storageAuthTokenSave(token);
    }
    async function SignIn(email: string, password: string) {
        try {
            setIsLoadingUserData(true);
            const { data } = await api.post("/sessions", { email, password });

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token);
                await UserAndTokenUpdate(data.user, data.token);
            }
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingUserData(false);
        }
    }

    async function SignOut() {
        try {
            setIsLoadingUserData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingUserData(false);
        }
    }

    async function LoadUserData() {
        try {
            setIsLoadingUserData(true);
            const userLogged = await storageUserGet();
            const token = await storageAuthTokenGet();

            if (token && userLogged) {
                UserAndTokenUpdate(userLogged, token);
            }
        } catch (err) {
            throw err;
        } finally {
            setIsLoadingUserData(false);
        }
    }

    useEffect(() => {
        LoadUserData();
    }, []);
    return (
        <AuthContext.Provider
            value={{
                user,
                SignIn,
                isLoadingUserData,
                SignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
