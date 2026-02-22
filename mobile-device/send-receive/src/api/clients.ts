// class ApiService {
//   private baseURL: string;

//   constructor() {
//     this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
//   }

//   private async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const response = await fetch(`${this.baseURL}${endpoint}`, {
//       ...options,
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//     });

//     console.log(`Request: ${options.method} ${endpoint}`);
//     console.log("Headers:", {
//       "Content-Type": "application/json",
//       ...options.headers,
//     });

//     if (!response.ok) {
//       const error = await response
//         .json()
//         .catch(() => ({ message: "Request failed" }));
//       throw new Error(error.message || "Request failed");
//     }

//     return response.json();
//   }

//   // private async request<T>(
//   //   endpoint: string,
//   //   options: RequestInit = {}
//   // ): Promise<T> {
//   //   const url = `${this.baseURL}${endpoint}`;

//   //   console.log(`🚀 API Request: ${options.method} ${url}`);
//   //   console.log("📦 Request headers:", {
//   //     "Content-Type": "application/json",
//   //     ...options.headers,
//   //   });

//   //   if (options.body) {
//   //     console.log("📤 Request body:", JSON.parse(options.body as string));
//   //   }

//   //   try {
//   //     const response = await fetch(url, {
//   //       ...options,
//   //       credentials: "include",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         ...options.headers,
//   //       },
//   //     });

//   //     console.log(
//   //       `📨 Response status: ${response.status} ${response.statusText}`
//   //     );
//   //     console.log(
//   //       "🔑 Response headers:",
//   //       Object.fromEntries(response.headers.entries())
//   //     );

//   //     if (!response.ok) {
//   //       // Try to get detailed error message
//   //       let errorMessage = "Request failed";
//   //       try {
//   //         const errorText = await response.text();
//   //         console.log("❌ Error response body:", errorText);

//   //         // Try to parse as JSON, if it fails, use the raw text
//   //         try {
//   //           const errorData = JSON.parse(errorText);
//   //           errorMessage = errorData.message || errorData.error || errorText;
//   //         } catch {
//   //           errorMessage =
//   //             errorText || `HTTP ${response.status}: ${response.statusText}`;
//   //         }
//   //       } catch (e) {
//   //         errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//   //       }

//   //       console.log("💥 Throwing error:", errorMessage);
//   //       throw new Error(errorMessage);
//   //     }

//   //     const data = await response.json();
//   //     console.log("✅ Response data:", data);
//   //     return data;
//   //   } catch (error: any) {
//   //     console.error("🔥 Fetch error details:", {
//   //       name: error.name,
//   //       message: error.message,
//   //       stack: error.stack,
//   //     });

//   //     if (error.name === "TypeError" && error.message.includes("fetch")) {
//   //       throw new Error("Network error: Cannot connect to server");
//   //     }
//   //     throw error;
//   //   }
//   // }

//   // private async request<T>(
//   //   endpoint: string,
//   //   options: RequestInit = {}
//   // ): Promise<T> {
//   //   const url = `${this.baseURL}${endpoint}`;

//   //   console.log(`🚀 API Request: ${options.method} ${url}`);
//   //   console.log("🍪 Credentials mode:", options.credentials);

//   //   const headers: HeadersInit = {
//   //     "Content-Type": "application/json",
//   //     ...options.headers,
//   //   };

//   //   console.log("📦 Request headers:", headers);

//   //   try {
//   //     const response = await fetch(url, {
//   //       ...options,
//   //       credentials: "include", // This is crucial for cookies
//   //       headers,
//   //     });

//   //     console.log(
//   //       `📨 Response status: ${response.status} ${response.statusText}`
//   //     );

//   //     // Log cookies from response
//   //     const setCookieHeader = response.headers.get("set-cookie");
//   //     if (setCookieHeader) {
//   //       console.log("🍪 Set-Cookie header:", setCookieHeader);
//   //     }

//   //     if (!response.ok) {
//   //       let errorMessage = "Request failed";
//   //       try {
//   //         const errorText = await response.text();
//   //         console.log("❌ Error response body:", errorText);

//   //         if (errorText) {
//   //           try {
//   //             const errorData = JSON.parse(errorText);
//   //             errorMessage = errorData.message || errorData.error || errorText;
//   //           } catch {
//   //             errorMessage = errorText;
//   //           }
//   //         } else {
//   //           errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//   //         }
//   //       } catch (e) {
//   //         errorMessage = `HTTP ${response.status}: ${response.statusText}`;
//   //       }

//   //       if (response.status === 403) {
//   //         errorMessage =
//   //           "Access denied. Session may have expired. Please log in again.";
//   //       }

//   //       throw new Error(errorMessage);
//   //     }

//   //     const data = await response.json();
//   //     console.log("✅ Response data:", data);
//   //     return data;
//   //   } catch (error: any) {
//   //     console.error("🔥 Fetch error:", error.message);
//   //     throw error;
//   //   }
//   // }

//   // Enhanced post method that handles query parameters
//   async post<T>(
//     endpoint: string,
//     data?: any,
//     config?: { params?: Record<string, string> }
//   ): Promise<T> {
//     let url = endpoint;

//     // Handle query parameters
//     if (config?.params) {
//       const params = new URLSearchParams(config.params).toString();
//       url += `?${params}`;
//     }

//     return this.request<T>(url, {
//       method: "POST",
//       body: data ? JSON.stringify(data) : undefined,
//       credentials: "include", // Ensure this is here
//     });
//   }

//   async get<T>(
//     endpoint: string,
//     config?: { params?: Record<string, string> }
//   ): Promise<T> {
//     let url = endpoint;

//     // Handle query parameters
//     if (config?.params) {
//       const params = new URLSearchParams(config.params).toString();
//       url += `?${params}`;
//     }

//     return this.request<T>(url, {
//       method: "GET",
//       credentials: "include", // Ensure this is here
//     });
//   }

//   async put<T>(endpoint: string, data?: any): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "PUT",
//       body: data ? JSON.stringify(data) : undefined,
//     });
//   }

//   async delete<T>(endpoint: string): Promise<T> {
//     return this.request<T>(endpoint, {
//       method: "DELETE",
//     });
//   }
// }

// export const api = new ApiService();

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log(`Request: ${options.method} ${endpoint}`);
    console.log("Headers:", {
      "Content-Type": "application/json",
      ...options.headers,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  }

  // Enhanced post method that handles query parameters
  async post<T>(
    endpoint: string,
    data?: any,
    config?: { params?: Record<string, string> }
  ): Promise<T> {
    let url = endpoint;

    // Handle query parameters
    if (config?.params) {
      const params = new URLSearchParams(config.params).toString();
      url += `?${params}`;
    }

    return this.request<T>(url, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Ensure this is here
    });
  }

  async get<T>(
    endpoint: string,
    config?: { params?: Record<string, string> }
  ): Promise<T> {
    let url = endpoint;

    // Handle query parameters
    if (config?.params) {
      const params = new URLSearchParams(config.params).toString();
      url += `?${params}`;
    }

    return this.request<T>(url, {
      method: "GET",
      credentials: "include", // Ensure this is here
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }
}

export const api = new ApiService();
