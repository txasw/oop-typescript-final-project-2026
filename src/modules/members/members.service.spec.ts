import { Test, TestingModule } from "@nestjs/testing";
import { MembersService } from "./members.service";
import { NotFoundException } from "@nestjs/common";
import { MemberStatus } from "../../common/enums/member-status.enum";

describe("MembersService", () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated seeded members", () => {
      const result = service.findAll({}, {});
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.meta.totalItems).toBe(result.items.length);
      expect(result.items[0]).toHaveProperty("memberCode");
    });

    it("should filter members by status", () => {
      const result = service.findAll({}, { status: MemberStatus.ACTIVE });
      result.items.forEach((member) => {
        expect(member.status).toBe(MemberStatus.ACTIVE);
      });
    });
  });

  describe("findOne", () => {
    it("should correctly find a seeded member by ID", () => {
      const allMembers = service.findAll({}, {});
      const firstId = allMembers.items[0].id;

      const member = service.findOne(firstId);
      expect(member).toBeDefined();
      expect(member.id).toBe(firstId);
    });

    it("should throw NotFoundException for invalid ID", () => {
      expect(() => service.findOne("invalid-id")).toThrow(NotFoundException);
    });
  });

  describe("borrowedBookIds tracking", () => {
    it("should add book id to borrowedBookIds array", () => {
      const allMembers = service.findAll({}, {});
      const targetId = allMembers.items[0].id;

      service.addBorrowedBook(targetId, "book-123");
      const member = service.findOne(targetId);
      expect(member.borrowedBookIds).toContain("book-123");
    });

    it("should remove book id from borrowedBookIds array", () => {
      const allMembers = service.findAll({}, {});
      const targetId = allMembers.items[0].id;

      service.addBorrowedBook(targetId, "book-123");
      service.removeBorrowedBook(targetId, "book-123");

      const member = service.findOne(targetId);
      expect(member.borrowedBookIds).not.toContain("book-123");
    });
  });

  describe("getStats", () => {
    it("should calculate initial member statistics correctly", () => {
      const stats = service.getStats();
      expect(stats.totalMembers).toBeGreaterThan(0);
      expect(stats.active).toBeDefined();
      expect(stats.inactive).toBeDefined();
      expect(stats.suspended).toBeDefined();
      expect(stats.totalMembers).toBe(
        stats.active + stats.inactive + stats.suspended,
      );
    });
  });
});
