/**
 * Transaction Interface — Records book borrow-return history
 */
export interface Transaction {
  /** Transaction UUID */
  id: string;

  /** Book ID */
  bookId: string;

  /** Book Title (snapshot at borrow time) */
  bookTitle: string;

  /** Member ID */
  memberId: string;

  /** Member Name (snapshot) */
  memberName: string;

  /** Action Type */
  action: "BORROW" | "RETURN";

  /** Borrowed Date */
  borrowedAt: string;

  /** Due Date */
  dueDate: string;

  /** Return Date (null if not yet returned) */
  returnedAt: string | null;

  /** Fine (THB, 0 if none) */
  fine: number;

  /** Overdue Days */
  overdueDays: number;

  /** Record Created Date */
  createdAt: string;
}
