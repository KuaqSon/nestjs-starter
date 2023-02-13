import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindManyOptions, Repository } from 'typeorm';

/**
 * Default find arguments.
 */
export class FindArgs {
  @ApiProperty({
    required: false,
    description: 'search/filter data by ids',
  })
  ids?: string | string[];

  @ApiProperty({
    required: false,
    description: 'search by keyword',
  })
  q?: string;

  @ApiProperty({
    required: false,
    description: 'offset',
    default: 0,
  })
  offset: number;

  @ApiProperty({
    required: false,
    description: 'limit',
    default: 100,
  })
  limit: number;

  @ApiProperty({
    required: false,
    description: 'Order result, e.g. order=createdAt:DESC',
  })
  order?: string;
}

/**
 * Pagination Result
 */
export class PaginationResult<T> {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty({
    type: Boolean,
  })
  hasNext = false;

  items: T[];
}

/**
 * Generate pagination result
 */
export function genPaginationResult<T>(items: T[], total: number, offset: number, limit: number): PaginationResult<T> {
  const result = new PaginationResult<T>();

  result.offset = offset;
  result.limit = limit;
  result.total = total;
  result.hasNext = result.offset + result.limit < result.total;
  result.items = items;

  return result;
}

/**
 * Generate empty page result
 */
export function genEmptyPage<T>(args: FindArgs): PaginationResult<T> {
  return genPaginationResult([], 0, args.offset, args.offset);
}

export async function paging<T>(
  repo: Repository<T>,
  options: FindManyOptions<T>,
  limit = 100,
  offset = 0
): Promise<PaginationResult<T>> {
  const [items, count] = await Promise.all([repo.find(options), repo.count(options)]);
  return genPaginationResult(items, count, offset, limit);
}

export class CreatedObj {
  @ApiProperty({
    required: true,
  })
  id: string;
}

export class AuditableResDto {
  @ApiProperty({
    required: true,
    type: Date,
  })
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    required: false,
    type: Date,
  })
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    required: false,
  })
  createdBy: string;

  @ApiProperty({
    required: false,
  })
  updatedBy: string;
}

export class PaginateDto {
  @IsOptional()
  skip: number;

  @IsOptional()
  take: number;
}
