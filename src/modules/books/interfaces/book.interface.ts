import { BookStatus } from "../../../common/enums/book-status.enum";
import { BookCategory } from "../../../common/enums/book-category.enum";

/**
 * Book Interface — โครงสร้างข้อมูลหนังสือในระบบห้องสมุด
 * มี Attribute ≥ 10 ตัว ตามข้อกำหนด
 */
export interface Book {
  /** UUID ของหนังสือ */
  id: string;

  /** รหัส ISBN */
  isbn: string;

  /** ชื่อหนังสือ */
  title: string;

  /** ผู้แต่ง */
  author: string;

  /** สำนักพิมพ์ */
  publisher: string;

  /** ปีที่พิมพ์ */
  publishedYear: number;

  /** หมวดหมู่ (enum) */
  category: BookCategory;

  /** รายละเอียด / เรื่องย่อ */
  description: string;

  /** สถานะของหนังสือ (enum) */
  status: BookStatus;

  /** อนุญาตให้ยืมได้หรือไม่ */
  isAvailableForLoan: boolean;

  /** ID ของสมาชิกที่ยืมอยู่ (null ถ้าไม่มีคนยืม) */
  currentBorrowerId: string | null;

  /** วันที่ยืม (null ถ้าไม่ได้ถูกยืม) */
  borrowedAt: string | null;

  /** กำหนดคืน (null ถ้าไม่ได้ถูกยืม) */
  dueDate: string | null;

  /** วันที่เพิ่มเข้าระบบ */
  createdAt: string;

  /** วันที่อัปเดตล่าสุด */
  updatedAt: string;
}
