export interface User {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  birth_date: string | null;
  role: 'user' | 'admin';
}

export interface Holiday {
  id: number;
  name: string;
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  title: string;
  street: string;
  house: string;
  apartment: string;
  entrance?: string;
  floor?: string;
  is_default: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  phone_number: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  email?: string;
  birth_date?: string;
}

// Типы ошибок API
export enum AuthErrorType {
  // Общие ошибки
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Ошибки авторизации
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  MISSING_CREDENTIALS = 'MISSING_CREDENTIALS',
  
  // Ошибки регистрации
  USER_EXISTS = 'USER_EXISTS',
  INVALID_PHONE_FORMAT = 'INVALID_PHONE_FORMAT',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  
  // Ошибки сессии
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  AUTH_ERROR = 'AUTH_ERROR'
}

// Интерфейс для детализации ошибок
export interface AuthError {
  type: AuthErrorType;
  message: string;
  statusCode?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  holidays: Holiday[];
  addresses: Address[];
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
} 