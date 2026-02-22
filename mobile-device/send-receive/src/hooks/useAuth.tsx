// import { useState, useEffect, useCallback } from "react";
// import { API_URL } from "../utils/constants";

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   token: string;
// }

// export function useAuth() {
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("user");
//     if (stored) setUser(JSON.parse(stored));
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });

//     if (!res.ok) throw new Error("Invalid credentials");

//     const data = await res.json();
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//     return data;
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//     localStorage.removeItem("user");
//   }, []);

//   const register = useCallback(
//     async (name: string, email: string, password: string) => {
//       const res = await fetch(`${API_URL}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           phoneNumber: "1234567890",
//           countryCode: "US",
//         }),
//       });
//       if (!res.ok) throw new Error("Registration failed");
//       return res.json();
//     },
//     []
//   );

//   return { user, login, logout, register, isAuthenticated: !!user };
// }

// import { useState, useCallback } from "react";
// import { authService, UserDto } from "../api/authService";

// export function useAuth() {
//   const [user, setUser] = useState<UserDto | null>(null);

//   const login = useCallback(async (email: string, password: string) => {
//     const { user } = await authService.login({ email, password });
//     setUser(user);
//     return user;
//   }, []);

//   const register = useCallback(
//     async (
//       username: string,
//       email: string,
//       password: string,
//       phoneNumber?: string
//     ) => {
//       const user = await authService.register({
//         username,
//         email,
//         password,
//         phoneNumber,
//       });
//       return user;
//     },
//     []
//   );

//   const logout = useCallback(async () => {
//     await authService.logout();
//     setUser(null);
//   }, []);

//   return { user, login, register, logout };
// }

import { useState, useEffect, useContext, createContext } from "react";
import { Alert } from "react-native";
import { api } from "../api/clients";
import { User } from "../../types/User";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const data = await api.post<User>("/auth/login", { email, password });
      setUser(data);
    } catch (error: any) {
      Alert.alert("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const newUser = await api.post<User>("/auth/register", data);
      setUser(newUser);
    } catch (error: any) {
      Alert.alert("Registration failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
