import { BookStatus } from "../../../common/enums/book-status.enum";
import { BookCategory } from "../../../common/enums/book-category.enum";

/**
 * Book Interface — Book data structure in the library system
 * Has >= 10 attributes according to requirements
 */
export interface Book {
  /** Book UUID */
  id: string;

  /** ISBN Code */
  isbn: string;

  /** Book Title */
  title: string;

  /** Author */
  author: string;

  /** Publisher */
  publisher: string;

  /** Published Year */
  publishedYear: number;

  /** Category (enum) */
  category: BookCategory;

  /** Description / Synopsis */
  description: string;

  /** Book Status (enum) */
  status: BookStatus;

  /** Available for loan */
  isAvailableForLoan: boolean;

  /** ID of the borrowing member (null if none) */
  currentBorrowerId: string | null;

  /** Reservation queue (Member IDs reserving this book) */
  reservedBy: string[];

  /** Borrowed date (null if not borrowed) */
  borrowedAt: string | null;

  /** Due date (null if not borrowed) */
  dueDate: string | null;

  /** Deleted date (null if not deleted) */
  deletedAt: string | null;

  /** Created date */
  createdAt: string;

  /** Last updated date */
  updatedAt: string;
}
