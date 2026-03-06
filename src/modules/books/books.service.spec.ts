import { Test, TestingModule } from "@nestjs/testing";
import { BooksService } from "./books.service";
import { MembersService } from "../members/members.service";
import { TransactionsService } from "../transactions/transactions.service";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { BookStatus } from "../../common/enums/book-status.enum";
import { MemberStatus } from "../../common/enums/member-status.enum";

describe("BooksService", () => {
  let service: BooksService;
  let membersService: jest.Mocked<MembersService>;

  beforeEach(async () => {
    const mockMembersService = {
      findOne: jest.fn(),
      addBorrowedBook: jest.fn(),
      removeBorrowedBook: jest.fn(),
      getStats: jest.fn(),
      findAll: jest.fn(),
    };

    const mockTransactionsService = {
      record: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        { provide: MembersService, useValue: mockMembersService },
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    membersService = module.get(MembersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return initial seed data", () => {
      const result = service.findAll({}, {});
      expect(result.items.length).toBe(5);
      expect(result.meta.totalItems).toBe(5);
    });

    it("should filter books by search keyword", () => {
      const result = service.findAll({ search: "clean code" }, {});
      expect(result.items.length).toBe(1);
      expect(result.items[0].title).toContain("Clean Code");
    });
  });

  describe("borrow", () => {
    const mockMember = {
      id: "member-1",
      status: MemberStatus.ACTIVE,
      maxBooksAllowed: 5,
      borrowedBookIds: [],
      memberCode: "LIB-0001",
      firstName: "Tom",
      lastName: "Cruise",
      email: "tom@ex.com",
      phone: "123",
      address: "12",
      registeredAt: "",
      updatedAt: "",
      deletedAt: null,
    };

    it("should throw NotFoundException if book does not exist", () => {
      membersService.findOne.mockReturnValue(mockMember);
      expect(() => service.borrow("invalid-id", "member-1")).toThrow(
        NotFoundException,
      );
    });

    it("should successfully borrow an available book", () => {
      const books = service.findAll({}, {});
      const targetBook = books.items[0];
      membersService.findOne.mockReturnValue(mockMember);

      const borrowed = service.borrow(targetBook.id, "member-1");
      expect(borrowed.status).toBe(BookStatus.BORROWED);
      expect(borrowed.currentBorrowerId).toBe("member-1");
      expect(borrowed.borrowedAt).toBeDefined();
      expect(borrowed.dueDate).toBeDefined();
      expect(membersService.addBorrowedBook).toHaveBeenCalledWith(
        "member-1",
        targetBook.id,
      );
    });
  });

  describe("returnBook", () => {
    it("should throw BadRequestException if book is not borrowed", () => {
      const books = service.findAll({}, {});
      const targetBook = books.items[0];
      expect(() => service.returnBook(targetBook.id)).toThrow(
        BadRequestException,
      );
    });
  });

  describe("getStats", () => {
    it("should calculate initial statistics correctly", () => {
      const stats = service.getStats();
      expect(stats.totalBooks).toBe(5);
      expect(stats.available).toBe(5);
      expect(stats.borrowed).toBe(0);
      expect(stats.byCategory).toBeDefined();
    });
  });
});
