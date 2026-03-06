import { IntersectionType } from "@nestjs/swagger";
import { PaginationDto } from "../../../common/dto/pagination.dto";
import { FilterBookDto } from "./filter-book.dto";

export class QueryBookDto extends IntersectionType(
  PaginationDto,
  FilterBookDto,
) {}
