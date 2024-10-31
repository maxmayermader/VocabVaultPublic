// app/types/auth.ts

export interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_superuser: boolean;

    // Add other user properties as needed
  }
  
  export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    register: (username: string, email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  }