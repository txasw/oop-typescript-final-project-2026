/**
 * Standard API Response format
 * ใช้เป็น Response format เดียวกันทั้งระบบ
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
