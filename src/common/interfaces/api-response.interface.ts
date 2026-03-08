/**
 * Standard API Response format
 * Used as a uniform Response format across the system
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
