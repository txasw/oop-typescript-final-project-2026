import { Injectable, NotFoundException } from "@nestjs/common";
import { Member } from "./interfaces/member.interface";
import { CreateMemberDto } from "./dto/create-member.dto";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { PatchMemberDto } from "./dto/patch-member.dto";
import { FilterMemberDto } from "./dto/filter-member.dto";
import { MemberStatus } from "../../common/enums/member-status.enum";
import { generateId } from "../../common/utils/generate-id.util";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { PaginatedResponse } from "../../common/interfaces/paginated-response.interface";
import { memberSeeds } from "./data/member-seeds";

/**
 * MembersService — จัดการข้อมูลสมาชิกแบบ in-memory
 */
@Injectable()
export class MembersService {
  private members: Member[] = [...memberSeeds];
  private memberCounter = memberSeeds.length;

  /**
   * สร้างรหัสสมาชิกอัตโนมัติ (เช่น LIB-0001)
   */
  private generateMemberCode(): string {
    this.memberCounter++;
    return `LIB-${this.memberCounter.toString().padStart(4, "0")}`;
  }

  /**
   * ดึงรายการสมาชิกทั้งหมด พร้อม search, filter, pagination
   */
  findAll(
    paginationDto: PaginationDto,
    filterDto: FilterMemberDto,
  ): PaginatedResponse<Member> {
    let filtered = this.members.filter((m) => m.deletedAt === null);

    // Filter by status
    if (filterDto.status) {
      filtered = filtered.filter((m) => m.status === filterDto.status);
    }

    // Search across string fields
    if (paginationDto.search) {
      const keyword = paginationDto.search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.firstName.toLowerCase().includes(keyword) ||
          m.lastName.toLowerCase().includes(keyword) ||
          m.email.toLowerCase().includes(keyword) ||
          m.memberCode.toLowerCase().includes(keyword) ||
          m.phone.toLowerCase().includes(keyword),
      );
    }

    // Pagination
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
      items,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems,
        totalPages,
      },
    };
  }

  /**
   * ดึงสมาชิกตาม ID
   * @throws NotFoundException ถ้าไม่พบสมาชิก
   */
  findOne(id: string): Member {
    const member = this.members.find(
      (m) => m.id === id && m.deletedAt === null,
    );
    if (!member) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }
    return member;
  }

  /**
   * สมัครสมาชิกใหม่
   */
  create(createMemberDto: CreateMemberDto): Member {
    const now = new Date().toISOString();
    const newMember: Member = {
      id: generateId(),
      memberCode: this.generateMemberCode(),
      firstName: createMemberDto.firstName,
      lastName: createMemberDto.lastName,
      email: createMemberDto.email,
      phone: createMemberDto.phone,
      address: createMemberDto.address,
      status: createMemberDto.status ?? MemberStatus.ACTIVE,
      maxBooksAllowed: createMemberDto.maxBooksAllowed ?? 5,
      borrowedBookIds: [],
      deletedAt: null,
      registeredAt: now,
      updatedAt: now,
    };
    this.members.push(newMember);
    return newMember;
  }

  /**
   * อัปเดตข้อมูลสมาชิกทั้งหมด (PUT)
   * @throws NotFoundException ถ้าไม่พบสมาชิก
   */
  update(id: string, updateMemberDto: UpdateMemberDto): Member {
    const memberIndex = this.members.findIndex((m) => m.id === id);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }

    const existingMember = this.members[memberIndex];
    const updatedMember: Member = {
      id: existingMember.id,
      memberCode: existingMember.memberCode,
      firstName: updateMemberDto.firstName,
      lastName: updateMemberDto.lastName,
      email: updateMemberDto.email,
      phone: updateMemberDto.phone,
      address: updateMemberDto.address,
      status: updateMemberDto.status,
      maxBooksAllowed: updateMemberDto.maxBooksAllowed,
      borrowedBookIds: existingMember.borrowedBookIds,
      deletedAt: existingMember.deletedAt,
      registeredAt: existingMember.registeredAt,
      updatedAt: new Date().toISOString(),
    };

    this.members[memberIndex] = updatedMember;
    return updatedMember;
  }

  /**
   * อัปเดตข้อมูลสมาชิกบางส่วน (PATCH)
   * @throws NotFoundException ถ้าไม่พบสมาชิก
   */
  patch(id: string, patchMemberDto: PatchMemberDto): Member {
    const memberIndex = this.members.findIndex((m) => m.id === id);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID "${id}" not found`);
    }

    const existingMember = this.members[memberIndex];
    const patchedMember: Member = {
      ...existingMember,
      ...(patchMemberDto.firstName !== undefined && {
        firstName: patchMemberDto.firstName,
      }),
      ...(patchMemberDto.lastName !== undefined && {
        lastName: patchMemberDto.lastName,
      }),
      ...(patchMemberDto.email !== undefined && {
        email: patchMemberDto.email,
      }),
      ...(patchMemberDto.phone !== undefined && {
        phone: patchMemberDto.phone,
      }),
      ...(patchMemberDto.address !== undefined && {
        address: patchMemberDto.address,
      }),
      ...(patchMemberDto.status !== undefined && {
        status: patchMemberDto.status,
      }),
      ...(patchMemberDto.maxBooksAllowed !== undefined && {
        maxBooksAllowed: patchMemberDto.maxBooksAllowed,
      }),
      updatedAt: new Date().toISOString(),
    };

    this.members[memberIndex] = patchedMember;
    return patchedMember;
  }

  /**
   * ลบสมาชิกตาม ID
   * @throws NotFoundException ถ้าไม่พบสมาชิก
   */
  remove(id: string): Member {
    const member = this.findOne(id);
    const memberIndex = this.members.findIndex((m) => m.id === id);
    this.members[memberIndex] = {
      ...member,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return this.members[memberIndex];
  }

  /**
   * เพิ่ม bookId ในรายการหนังสือที่ยืม (เรียกจาก BooksService)
   */
  addBorrowedBook(memberId: string, bookId: string): void {
    const memberIndex = this.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID "${memberId}" not found`);
    }
    this.members[memberIndex] = {
      ...this.members[memberIndex],
      borrowedBookIds: [...this.members[memberIndex].borrowedBookIds, bookId],
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * ลบ bookId ออกจากรายการหนังสือที่ยืม (เรียกจาก BooksService)
   */
  removeBorrowedBook(memberId: string, bookId: string): void {
    const memberIndex = this.members.findIndex((m) => m.id === memberId);
    if (memberIndex === -1) {
      throw new NotFoundException(`Member with ID "${memberId}" not found`);
    }
    this.members[memberIndex] = {
      ...this.members[memberIndex],
      borrowedBookIds: this.members[memberIndex].borrowedBookIds.filter(
        (id) => id !== bookId,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * ดึงสถิติสมาชิก
   */
  getStats() {
    const activeMembersList = this.members.filter((m) => !m.deletedAt);
    const totalMembers = activeMembersList.length;
    const active = activeMembersList.filter(
      (m) => m.status === MemberStatus.ACTIVE,
    ).length;
    const inactive = activeMembersList.filter(
      (m) => m.status === MemberStatus.INACTIVE,
    ).length;
    const suspended = activeMembersList.filter(
      (m) => m.status === MemberStatus.SUSPENDED,
    ).length;

    return {
      totalMembers,
      active,
      inactive,
      suspended,
    };
  }

  /**
   * Reset data to default seed
   */
  reset(): void {
    this.members = [...memberSeeds];
    this.memberCounter = memberSeeds.length;
  }
}
