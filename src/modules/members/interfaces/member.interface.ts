import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * Member Interface — Member data structure
 * Has >= 10 attributes according to requirements
 */
export interface Member {
  /** Member UUID */
  id: string;

  /** Member Code (e.g., LIB-0001) */
  memberCode: string;

  /** First Name */
  firstName: string;

  /** Last Name */
  lastName: string;

  /** Email */
  email: string;

  /** Phone Number */
  phone: string;

  /** Address */
  address: string;

  /** Member Status (enum) */
  status: MemberStatus;

  /** Maximum books allowed */
  maxBooksAllowed: number;

  /** List of currently borrowed Book IDs */
  borrowedBookIds: string[];

  /** Deleted date (null if not deleted) */
  deletedAt: string | null;

  /** Member Registration Date */
  registeredAt: string;

  /** Last updated date */
  updatedAt: string;
}
