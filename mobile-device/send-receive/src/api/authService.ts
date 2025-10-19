// // src/api/authService.ts
// import { LoginRequest } from "../../types/LoginRequest";
// import { LoginResponse } from "../../types/LoginResponse";
// import { UserDto } from "../../types/UserDto";
// import { api } from "./clients";

// export const authService = {
//   register: (user: Omit<UserDto, "id">): Promise<UserDto> =>
//     api.post<UserDto>("/auth/register", user),

//   login: (credentials: LoginRequest): Promise<LoginResponse> =>
//     api.post<LoginResponse>("/auth/login", credentials),

//   logout: (): Promise<void> => api.post<void>("/auth/logout"),

//   getCurrentUser: (): Promise<UserDto> => api.get<UserDto>("/auth/me"),
// };

// src/api/authService.ts
import { UserDto, LoginRequest, LoginResponse } from "../../types/User";
import { DummyData } from "../context/AuthContext";
import { api } from "./clients";

export const authService = {
  async register(userData: Partial<UserDto>): Promise<UserDto> {
    const response = await api.post<UserDto>("/users/register", userData);

    console.log("Register infos", userData);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response) {
      throw new Error("Registration failed: No user data received");
    }

    return response;
  },

  // async login(
  //   credentials: LoginRequest
  // ): Promise<{ user: UserDto; token?: string }> {
  //   const response = await api.post<LoginResponse>("/auth/login", credentials);

  //   if (response.error) {
  //     throw new Error(response.error);
  //   }

  //   if (!response.user) {
  //     throw new Error("Login failed: No user data received");
  //   }

  //   return {
  //     user: response.user,
  //     token: response.token,
  //   };
  // },
  async login(credentials: LoginRequest): Promise<any> {
    console.log("Sending login request:", credentials);

    const response = await api.post<any>("/auth/login", credentials);

    console.log("Login response received:", response);

    // Check if login was successful
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.message === "Login successful") {
      console.log("Login successful, fetching user data...");
      // Login was successful, now get the user data
      try {
        const userData = await this.getCurrentUser();
        const dummyData = await this.getDummyData();

        console.log("User data fetched:", userData);
        console.log("Dummy Data fetched: ", dummyData);
        return { user: userData };
      } catch (error) {
        console.error("Failed to fetch user data after login:", error);
        throw new Error("Login successful but failed to load user profile");
      }
    }

    throw new Error(response.message || "Login failed");
  },

  async logout(): Promise<void> {
    try {
      await api.post<void>("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      // Still proceed with logout even if API call fails
    }
  },

  async getCurrentUser(): Promise<Partial<UserDto>> {
    const response = await api.get<any>("/users/me");
    console.log("Response from users/me", response);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response) {
      throw new Error("No user data received");
    }

    return response;
  },

  async getDummyData(): Promise<DummyData> {
    try {
      const res = await api.get<DummyData>("");
      console.log("Dummy data from HashMap", res);
      console.log("the name of the city: ", res.address.city);
      return res;
    } catch (error) {
      throw new Error("No data available from the hashMap");
    }
  },

  updateProfile: (profileData: Partial<UserDto>): Promise<UserDto> => {
    api.put<UserDto>("/auth/profile", profileData);
  },

  // async login(credentials: LoginRequest): Promise<{ user: UserDto }> {
  //   console.log("Sending login request:", credentials);

  //   const response = await api.post<any>("/users/login", credentials);

  //   console.log("Login response received:", response);

  //   if (response.error) {
  //     throw new Error(response.error);
  //   }

  //   if (response.message === "Login successful") {
  //     console.log("Login successful, fetching user data...");

  //     // Wait a moment for the session to be established
  //     await new Promise((resolve) => setTimeout(resolve, 100));

  //     try {
  //       const userData = await this.getCurrentUser();
  //       console.log("User data fetched successfully:", userData);
  //       return { user: userData };
  //     } catch (error) {
  //       console.error("Failed to fetch user data after login:", error);

  //       // Fallback: Try to create a minimal user object
  //       console.log("Creating minimal user object as fallback...");
  //       const minimalUser: UserDto = {
  //         id: Date.now(), // Temporary ID
  //         email: credentials.email,
  //         username: this.formatNameFromEmail(credentials.email),
  //         currency: "USD",
  //       };
  //       return { user: minimalUser };
  //     }
  //   }

  //   throw new Error(response.message || "Login failed");
  // },

  // async getCurrentUser(): Promise<UserDto> {
  //   try {
  //     console.log("Fetching current user from /auth/me...");
  //     const response = await api.get<any>("/auth/me");
  //     console.log("Raw response from /auth/me:", response);

  //     // Check if the response itself is the user object
  //     if (response && (response.id || response.email)) {
  //       console.log("Response appears to be user object");
  //       return response as UserDto;
  //     }

  //     // Check for nested user object
  //     if (response.user && (response.user.id || response.user.email)) {
  //       console.log("Found user object in response.user");
  //       return response.user;
  //     }

  //     // Check for data property
  //     if (response.data && (response.data.id || response.data.email)) {
  //       console.log("Found user object in response.data");
  //       return response.data;
  //     }

  //     console.log("No recognizable user data found in response");
  //     throw new Error("No user data received");
  //   } catch (error: any) {
  //     console.error("getCurrentUser error:", error);
  //     throw new Error(error.message || "Failed to get user data");
  //   }
  // },

  // formatNameFromEmail(email: string): string {
  //   const namePart = email.split("@")[0];
  //   return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  // },
};
