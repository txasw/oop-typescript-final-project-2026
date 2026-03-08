import { MemberStatus } from "../../../common/enums/member-status.enum";

/**
 * Member Interface — Member data structure
 * มี Attribute ≥ 10 ตัว ตามข้อกำหนด
 */
export interface Member {
  /** Member UUID */
  id: string;

  /** รหัสสมาชิก (เช่น LIB-0001) */
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

  /** รายการ Book IDs ที่ยืมอยู่ */
  borrowedBookIds: string[];

  /** Deleted date (null if not deleted) */
  deletedAt: string | null;

  /** Registration Dateสมาชิก */
  registeredAt: string;

  /** Last updated date */
  updatedAt: string;
}
