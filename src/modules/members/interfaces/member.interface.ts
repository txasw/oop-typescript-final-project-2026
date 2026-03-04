import { MemberStatus } from "../../common/enums/member-status.enum";

/**
 * Member Interface — โครงสร้างข้อมูลสมาชิกห้องสมุด
 * มี Attribute ≥ 10 ตัว ตามข้อกำหนด
 */
export interface Member {
  /** UUID ของสมาชิก */
  id: string;

  /** รหัสสมาชิก (เช่น LIB-0001) */
  memberCode: string;

  /** ชื่อ */
  firstName: string;

  /** นามสกุล */
  lastName: string;

  /** อีเมล */
  email: string;

  /** เบอร์โทรศัพท์ */
  phone: string;

  /** ที่อยู่ */
  address: string;

  /** สถานะสมาชิก (enum) */
  status: MemberStatus;

  /** จำนวนหนังสือสูงสุดที่ยืมได้ */
  maxBooksAllowed: number;

  /** รายการ Book IDs ที่ยืมอยู่ */
  borrowedBookIds: string[];

  /** วันที่สมัครสมาชิก */
  registeredAt: string;

  /** วันที่อัปเดตล่าสุด */
  updatedAt: string;
}
