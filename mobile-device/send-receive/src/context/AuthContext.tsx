// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { User } from "../../types/User";
// import { API_URL } from "../utils/constants";

// interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (
//     username: string,
//     email: string,
//     password: string,
//     phoneNumber: string,
//     countryCode: string,
//     currency: string
//   ) => Promise<void>;
//   logout: () => Promise<void>;
//   loading: boolean;
//   updateUser: (userData: User) => void;
// }
// // ============= AUTH CONTEXT =============
// const AuthContext = createContext<AuthContextType | null>(null);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async (): Promise<void> => {
//     try {
//       const res = await fetch(`${API_URL}/users/me`, {
//         credentials: "include",
//       });
//       if (res.ok) {
//         const userData: User = await res.json();
//         setUser(userData);
//       }
//     } catch (err) {
//       console.error("Auth check failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email: string, password: string): Promise<void> => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ email, password }),
//     });
//     if (!res.ok) throw new Error("Login failed");
//     await checkAuth();
//   };

//   const register = async (
//     username: string,
//     email: string,
//     password: string,
//     phoneNumber: string,
//     country: string,
//     currency: string
//   ): Promise<void> => {
//     const res = await fetch(`${API_URL}/users/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({
//         username,
//         email,
//         password,
//         phoneNumber,
//         country,
//         currency,
//       }),
//     });
//     if (!res.ok) throw new Error("Registration failed");
//   };

//   const logout = async (): Promise<void> => {
//     await fetch(`${API_URL}/auth/logout`, {
//       method: "POST",
//       credentials: "include",
//     });
//     setUser(null);
//   };

//   const updateUser = (userData: User): void => {
//     setUser(userData);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, login, register, logout, loading, updateUser }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// };

// import React, { createContext, useContext, useState, useEffect } from "react";
// import { Alert } from "react-native";
// import { api } from "../api/clients";
// import { User } from "../../types/User";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (data: Partial<User>) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: false,
//   login: async () => {},
//   register: async () => {},
//   logout: () => {},
// });

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const loggedInUser = await api.post<User>("/auth/login", {
//         email,
//         password,
//       });
//       setUser(loggedInUser);
//     } catch (err: any) {
//       Alert.alert("Login failed", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const register = async (data: Partial<User>) => {
//     try {
//       setLoading(true);
//       const newUser = await api.post<User>("/auth/register", data);
//       setUser(newUser);
//       Alert.alert("Success", "Account created successfully!");
//     } catch (err: any) {
//       Alert.alert("Registration failed", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   useEffect(() => {
//     // Optional: auto-load user from persistent storage
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// src/context/AuthContext.tsx
// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import { authService } from "../api/authService";
import { UserDto } from "../../types/UserDto";
import { LoginRequest } from "../../types/LoginRequest";
import { LoginResponse } from "../../types/LoginResponse";

interface AuthContextType {
  dummy: any;
  user: Partial<UserDto> | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ) => Promise<Partial<UserDto>>;
  logout: () => void;
  loading: boolean;
  updateProfile: (profileData: Partial<UserDto>) => Promise<void>; // Fix this line
  isAuthenticated: boolean;
}

interface Address {
  city: string;
  country: string;
  postalCode: string;
}

export interface DummyData {
  id: string;
  name: string;
  email: string;
  role: string;
  active: string;
  address: Address;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Partial<UserDto> | null>(null);
  const [dummy, setDummy] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
    console.log(!isValidEmail("@gmail.com")); // should print true
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userData = await authService.getCurrentUser();
      const dummyData = await authService.getDummyData();
      setUser(userData);
      setDummy(dummyData);
    } catch (error) {
      // User is not authenticated, clear any stale data
      console.log("User not authenticated or error:", error);
      setUser(null);
    } finally {
      setInitializing(false);
    }
  };

  // const login = async (email: string, password: string) => {
  //   // Client-side validation
  //   if (!email || !password) {
  //     throw new Error("Please enter both email and password");
  //   }

  //   if (!isValidEmail(email.trim())) {
  //     throw new Error("Please enter a valid email address");
  //   }

  //   if (password.length < 6) {
  //     throw new Error("Password must be at least 6 characters");
  //   }

  //   setLoading(true);
  //   try {
  //     const credentials: LoginRequest = {
  //       email: email.trim().toLowerCase(),
  //       password,
  //     };

  //     const response: LoginResponse = await authService.login(credentials);

  //     // Debug: Check what's actually in the response
  //     console.log("Login response*:", response);
  //     console.log("Email verified*:", response.emailVerified);
  //     console.log("User*:", response.user);

  //     if (!response.user) {
  //       throw new Error("Invalid response from server");
  //     }

  //     if (!response.user.authenticated) {
  //       throw new Error("Authentication failed");
  //     }

  //     if (!response.user.emailVerified) {
  //       throw new Error("Please verify your email address before logging in.");
  //     }

  //     setUser(response.user);
  //     return true;
  //   } catch (error: any) {
  //     // Handle API errors
  //     const message =
  //       error.message || "Login failed. Please check your credentials.";
  //     throw new Error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (email: string, password: string) => {
    // ... validation code ...

    // Client-side validation
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    if (!isValidEmail(email.trim())) {
      throw new Error("Please enter a valid email address");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const credentials: LoginRequest = {
        email: email.trim().toLowerCase(),
        password,
      };

      const response: LoginResponse = await authService.login(credentials);

      console.log("Processed login response:", response);

      if (!response.user) {
        throw new Error("Invalid response from server");
      }

      // Check authentication status
      if (!response.user.authenticated) {
        throw new Error("Authentication failed");
      }

      if (!response.user.emailVerified) {
        throw new Error("Please verify your email address before logging in.");
      }

      setUser(response.user);
    } catch (error: any) {
      const message =
        error.message || "Login failed. Please check your credentials.";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // const register = async (
  //   email: string,
  //   password: string,
  //   username: string,
  //   phoneNumber: string
  // ) => {
  //   // Client-side validation
  //   if (!email || !password || !username) {
  //     throw new Error("Please fill in all fields");
  //   }

  //   if (!isValidEmail(email)) {
  //     throw new Error("Please enter a valid email address");
  //   }

  //   if (password.length < 6) {
  //     throw new Error("Password must be at least 6 characters");
  //   }

  //   if (username.length < 2) {
  //     throw new Error("Please enter a valid name");
  //   }

  //   setLoading(true);
  //   try {
  //     const userData = await authService.register({
  //       email: email.trim().toLowerCase(),
  //       password,
  //       username: username.trim(),
  //       phoneNumber,
  //     });

  //     setUser(userData);
  //   } catch (error: any) {
  //     const message = error.message || "Registration failed. Please try again.";
  //     throw new Error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const register = async (
  //   email: string,
  //   password: string,
  //   username: string,
  //   phoneNumber: string
  // ) => {
  //   // Enhanced client-side validation
  //   if (!email || !password || !username || !phoneNumber) {
  //     throw new Error("Please fill in all fields");
  //   }

  //   if (!isValidEmail(email)) {
  //     throw new Error("Please enter a valid email address");
  //   }

  //   if (password.length < 8) {
  //     throw new Error("Password must be at least 8 characters");
  //   }

  //   if (!isValidPassword(password)) {
  //     throw new Error(
  //       "Password must include uppercase, lowercase, number and special character"
  //     );
  //   }

  //   if (username.length < 2) {
  //     throw new Error("Name must be at least 2 characters");
  //   }

  //   if (!isValidPhoneNumber(phoneNumber)) {
  //     throw new Error(
  //       "Please enter a valid international phone number (e.g., +1234567890)"
  //     );
  //   }

  //   setLoading(true);
  //   try {
  //     console.log("Sending registration request...");

  //     const userData = await authService.register({
  //       email: email.trim().toLowerCase(),
  //       password,
  //       username: username.trim(),
  //       phoneNumber: phoneNumber.trim(),
  //     });

  //     console.log("Registration successful:", userData);
  //     setUser(userData);
  //   } catch (error: any) {
  //     console.error("Registration API error:", error);

  //     // More specific error messages
  //     let message = "Registration failed. Please try again.";

  //     if (error.message?.includes("Email already")) {
  //       message =
  //         "This email is already registered. Please use a different email or login.";
  //     } else if (error.message?.includes("phone number")) {
  //       message = "This phone number is already registered.";
  //     } else if (error.message) {
  //       message = error.message;
  //     }

  //     throw new Error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const register = async (
  //   email: string,
  //   password: string,
  //   username: string,
  //   phoneNumber: string
  // ) => {
  //   // ... existing validation code ...

  //   // Enhanced client-side validation
  //   if (!email || !password || !username || !phoneNumber) {
  //     throw new Error("Please fill in all fields");
  //   }

  //   if (!isValidEmail(email)) {
  //     throw new Error("Please enter a valid email address");
  //   }

  //   if (password.length < 8) {
  //     throw new Error("Password must be at least 8 characters");
  //   }

  //   if (!isValidPassword(password)) {
  //     throw new Error(
  //       "Password must include uppercase, lowercase, number and special character"
  //     );
  //   }

  //   if (username.length < 2) {
  //     throw new Error("Name must be at least 2 characters");
  //   }

  //   if (!isValidPhoneNumber(phoneNumber)) {
  //     throw new Error(
  //       "Please enter a valid international phone number (e.g., +1234567890)"
  //     );
  //   }

  //   setLoading(true);
  //   try {
  //     console.log("Sending registration request...");

  //     const response = await authService.register({
  //       email: email.trim().toLowerCase(),
  //       password,
  //       username: username.trim(),
  //       phoneNumber: phoneNumber.trim(),
  //     });

  //     console.log("Registration response:", response);

  //     // Check if verification is required
  //     if (response.requiresVerification) {
  //       // Don't set user as authenticated, instead show verification message
  //       return {
  //         success: true,
  //         requiresVerification: true,
  //         message: response.message,
  //         email: response.email,
  //         userId: response.userId,
  //       };
  //     }

  //     // Only set user if email is already verified (unlikely during registration)
  //     if (response.emailVerified) {
  //       setUser(response);
  //     }

  //     return { success: true, requiresVerification: false };
  //   } catch (error: any) {
  //     console.error("Registration API error:", error);
  //     // More specific error messages
  //     let message = "Registration failed. Please try again.";

  //     if (error.message?.includes("Email already")) {
  //       message =
  //         "This email is already registered. Please use a different email or login.";
  //     } else if (error.message?.includes("phone number")) {
  //       message = "This phone number is already registered.";
  //     } else if (error.message) {
  //       message = error.message;
  //     }

  //     throw new Error(message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const register = async (
    email: string,
    password: string,
    name: string,
    phoneNumber: string
  ) => {
    // Enhanced client-side validation
    if (!email || !password || !name || !phoneNumber) {
      throw new Error("Please fill in all fields");
    }

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (!isValidPassword(password)) {
      throw new Error(
        "Password must include uppercase, lowercase, number and special character"
      );
    }

    if (name.length < 2) {
      throw new Error("Name must be at least 2 characters");
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      throw new Error(
        "Please enter a valid international phone number (e.g., +1234567890)"
      );
    }

    setLoading(true);
    try {
      console.log("Sending registration request...");

      const response = await authService.register({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
      });

      console.log("Registration response:", response);

      // FIXED: Handle different response structures
      if (response && response.requiresVerification) {
        // User needs to verify email
        return {
          success: true,
          requiresVerification: true,
          message:
            response.message ||
            "Registration successful. Please verify your email.",
          email: response.email,
          userId: response.id || response.userId,
        };
      } else if (response && response.id) {
        // User is already verified and authenticated
        setUser(response);
        return {
          success: true,
          requiresVerification: false,
          user: response,
        };
      } else {
        // Default case - assume verification is required
        return {
          success: true,
          requiresVerification: true,
          message: "Please check your email to verify your account.",
          email: email,
        };
      }
    } catch (error: any) {
      console.error("Registration API error:", error);
      // More specific error messages
      let message = "Registration failed. Please try again.";

      if (
        error.message?.includes("Email already") ||
        error.message?.includes("already exists")
      ) {
        message =
          "This email is already registered. Please use a different email or login.";
      } else if (error.message?.includes("phone number")) {
        message = "This phone number is already registered.";
      } else if (error.message) {
        message = error.message;
      }

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };
  // Add these validation functions to your auth hook
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    // Match backend E.164 format validation
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  };

  const isValidPassword = (password: string): boolean => {
    // Match backend password requirements
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
    }
  };

  // Show loading screen while checking auth status
  if (initializing) {
    return null; // Or your loading component
  }

  const updateProfile = async (profileData: Partial<UserDto>) => {
    setLoading(true);
    try {
      // Call your backend API to update the profile
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error: any) {
      const message = error.message || "Failed to update profile";
      Alert.alert("Error", message);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        dummy,
        user,
        login,
        register,
        logout,
        loading,
        updateProfile,
        // isAuthenticated: !!user,
        isAuthenticated: !!(user && user.emailVerified), // FIXED: Check email verification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
