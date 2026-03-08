/**
 * Library Book Status
 */
export enum BookStatus {
  /** Book available for loan */
  AVAILABLE = "AVAILABLE",

  /** Book is currently borrowed */
  BORROWED = "BORROWED",

  /** Book is reserved */
  RESERVED = "RESERVED",

  /** Book is under maintenance */
  MAINTENANCE = "MAINTENANCE",
}
