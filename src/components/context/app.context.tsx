import { createContext, useContext, useState } from 'react';

interface IAppContext {
    isAuthenticated: boolean
    currentUser: IUser | null
    isAppLoading: boolean
    setIsAuthenticated: (v: boolean) => void
    setCurrentUser: (v: IUser) => void
    setIsAppLoading: (v: boolean) => void
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode
}


export const AppProvider = (props: TProps) => {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true)
    return (
        <CurrentAppContext.Provider value={{
            currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated, isAppLoading, setIsAppLoading
        }}>
            {props.children}
        </CurrentAppContext.Provider>
    );
}

export const useCurrentApp = () => {
    const currentUserContext = useContext(CurrentAppContext);

    if (!currentUserContext) {
        throw new Error(
            "useCurrentUser has to be used within <CurrentUserContext.Provider>"
        );
    }

    return currentUserContext;
};


