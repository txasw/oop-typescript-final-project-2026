/**
 * Transaction Interface — บันทึกประวัติการยืม-คืนหนังสือ
 */
export interface Transaction {
  /** UUID ของ Transaction */
  id: string;

  /** ID ของหนังสือ */
  bookId: string;

  /** ชื่อหนังสือ (snapshot ณ เวลา borrow) */
  bookTitle: string;

  /** ID ของสมาชิก */
  memberId: string;

  /** ชื่อสมาชิก (snapshot) */
  memberName: string;

  /** ประเภท Action */
  action: "BORROW" | "RETURN";

  /** วันที่ยืม */
  borrowedAt: string;

  /** วันครบกำหนดคืน */
  dueDate: string;

  /** วันที่คืน (null ถ้ายังไม่คืน) */
  returnedAt: string | null;

  /** ค่าปรับ (บาท, 0 ถ้าไม่มี) */
  fine: number;

  /** จำนวนวันเลยกำหนด */
  overdueDays: number;

  /** วันที่สร้าง record */
  createdAt: string;
}
