/**
 * สถานะของหนังสือในระบบห้องสมุด
 */
export enum BookStatus {
  /** หนังสือพร้อมให้ยืม */
  AVAILABLE = "AVAILABLE",

  /** หนังสือถูกยืมอยู่ */
  BORROWED = "BORROWED",

  /** หนังสือถูกจองไว้ */
  RESERVED = "RESERVED",

  /** หนังสืออยู่ระหว่างการซ่อมบำรุง */
  MAINTENANCE = "MAINTENANCE",
}
