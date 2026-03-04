/**
 * สถานะของสมาชิกห้องสมุด
 */
export enum MemberStatus {
  /** สมาชิกใช้งานปกติ */
  ACTIVE = "ACTIVE",

  /** สมาชิกหยุดใช้งาน */
  INACTIVE = "INACTIVE",

  /** สมาชิกถูกระงับสิทธิ์ */
  SUSPENDED = "SUSPENDED",
}
