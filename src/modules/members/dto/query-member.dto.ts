import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { FilterMemberDto } from "./filter-member.dto";

export class QueryMemberDto extends IntersectionType(
  PaginationDto,
  FilterMemberDto,
) {}
