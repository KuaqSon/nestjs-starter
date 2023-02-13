import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DUPLICATED_ROW_VIOLATION_CODE } from 'src/shared/constant/error-code';
import { FindOptionsWhere, ObjectID, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export async function createOrFail<T>(repo: Repository<T>, entity: T, failedMessage: string) {
  try {
    return await repo.save(repo.create(entity));
  } catch (error) {
    if (error.code === DUPLICATED_ROW_VIOLATION_CODE) {
      throw new ConflictException(failedMessage);
    } else {
      throw new InternalServerErrorException(error);
    }
  }
}

export async function updateOrFail<T>(
  repo: Repository<T>,
  criteria: string | number | Date | string[] | ObjectID | number[] | Date[] | ObjectID[] | FindOptionsWhere<T>,
  partialEntity: QueryDeepPartialEntity<T>,
  failedMessage: string
) {
  try {
    return await repo.update(criteria, partialEntity);
  } catch (error) {
    if (error.code === DUPLICATED_ROW_VIOLATION_CODE) throw new ConflictException(failedMessage);
    else throw new InternalServerErrorException(error);
  }
}

export function isDuplicatedViolate(error: { code: string | number }): boolean {
  return error.code === DUPLICATED_ROW_VIOLATION_CODE;
}
