import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserSession, logoutUser } from '../lib/userAuth';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => getUserSession());

  const refreshSession = useCallback(() => {
    setUser(getUserSession());
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  // Re-check session on focus (in case another tab logged in)
  useEffect(() => {
    const onFocus = () => setUser(getUserSession());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, setUser, refreshSession, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(UserAuthContext);
}
