/**
 * Paginated Response — Used for GET list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Current page */
  currentPage: number;

  /** Number of items per page */
  itemsPerPage: number;

  /** Total number of items */
  totalItems: number;

  /** Total number of pages */
  totalPages: number;
}
