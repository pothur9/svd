// src/lib/auth.ts
export interface AuthUser {
  userId: string;
  name: string;
  contactNo: string;
  peeta?: string;
}

class AuthManager {
  private static readonly STORAGE_KEY = 'svd_auth_user';
  private static readonly SESSION_KEY = 'svd_session_data';

  // Store user data in localStorage (persistent across tabs)
  static setAuthUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
      // Also store in sessionStorage for easy access
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  // Get user data from localStorage
  static getAuthUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getAuthUser() !== null;
  }

  // Get current user ID
  static getCurrentUserId(): string | null {
    const user = this.getAuthUser();
    return user ? user.userId : null;
  }

  // Clear authentication (logout)
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
      sessionStorage.removeItem(this.STORAGE_KEY);
      // Clear any other session data
      sessionStorage.clear();
    }
  }

  // Store additional session data (like peeta, username)
  static setSessionData(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`${this.SESSION_KEY}_${key}`, value);
    }
  }

  static getSessionData(key: string): string | null {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(`${this.SESSION_KEY}_${key}`);
    }
    return null;
  }
}

export default AuthManager;
