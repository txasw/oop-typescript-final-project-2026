/**
 * Response แบบ Paginated — ใช้สำหรับ GET list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * ข้อมูล metadata ของ pagination
 */
export interface PaginationMeta {
  /** หน้าปัจจุบัน */
  currentPage: number;

  /** จำนวนรายการต่อหน้า */
  itemsPerPage: number;

  /** จำนวนรายการทั้งหมด */
  totalItems: number;

  /** จำนวนหน้าทั้งหมด */
  totalPages: number;
}
