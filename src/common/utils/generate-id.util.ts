/**
 * สร้าง UUID v4 แบบง่าย (ไม่ต้องพึ่ง external library)
 * ใช้สำหรับ generate ID ให้ Book และ Member
 */
export function generateId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
