import { BadRequestException, Injectable } from '@nestjs/common';
import {
  FilterOption,
  PaginationDto,
  PaginationOptions,
} from '../dto/pagination.dto';
import {
  Between,
  FindManyOptions,
  FindOperator,
  In,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { BaseModel } from '../entities/base.entity';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../constants/env.const';
import {
  CursorPaginationModel,
  PagePaginationModel,
} from '../entities/pagination.entity';

interface PaginationParams<T> {
  paginationDto: PaginationDto;
  repository: Repository<T>;
  findManyOptions?: FindManyOptions<T>;
  path: string;
}

@Injectable()
export class PaginationService {
  constructor(private readonly configService: ConfigService) {}

  paginate<T extends BaseModel>(params: PaginationParams<T>) {
    if (params.paginationDto.page) {
      return this.paginateByPage(params);
    }

    return this.paginateByCursor(params);
  }

  private async paginateByPage<T extends BaseModel>({
    paginationDto,
    repository,
    findManyOptions,
  }: Pick<
    PaginationParams<T>,
    'paginationDto' | 'repository' | 'findManyOptions'
  >): Promise<PagePaginationModel<T>> {
    const convertedOptions = PaginationOptions.fromDto(paginationDto);
    const { take, page, filter, sort } = convertedOptions;
    const finalOptions: FindManyOptions<T> = {
      skip: take * (page - 1),
      take: take,
      where:
        filter?.reduce(
          (acc, { property, from, to }) => ({
            ...acc,
            [property]: this.parseFilterValue({ from, to }),
          }),
          {},
        ) ?? {},
      order:
        sort?.reduce(
          (acc, { property, direction }) => ({
            ...acc,
            [property]: direction.toUpperCase(),
          }),
          {},
        ) ?? {},
      ...findManyOptions,
    };

    const [posts, count] = await repository.findAndCount(finalOptions);

    return {
      data: posts,
      total: count,
    };
  }

  private async paginateByCursor<T extends BaseModel>({
    paginationDto,
    repository,
    findManyOptions,
    path,
  }: PaginationParams<T>): Promise<CursorPaginationModel<T>> {
    const convertedOptions = PaginationOptions.fromDto(paginationDto);
    const { from, to, take, filter, sort } = convertedOptions;

    if (from && to) {
      throw new BadRequestException(
        `Passing both "from" & "to" properties is not allowed`,
      );
    }

    const finalOptions: FindManyOptions<T> = {
      where: {
        id: to ? LessThan(to) : (MoreThan(from) as any),
        ...(filter?.reduce(
          (acc, { property, from, to, contains }) => ({
            ...acc,
            [property]: this.parseFilterValue({ from, to, contains }),
          }),
          {},
        ) ?? {}),
      },
      order:
        sort?.reduce(
          (acc, { property, direction }) => ({
            ...acc,
            [property]: direction.toUpperCase(),
          }),
          {},
        ) ?? {},
      take,
      ...findManyOptions,
    };

    const results = await repository.find(finalOptions);
    const lastItem =
      results.length > 0 && results.length === take
        ? results[results.length - 1]
        : null;
    const BASE_URL = this.configService.get(EnvKeys.BASE_URL);
    const next = lastItem ? new URL(`${BASE_URL}/${path}`) : null;

    if (next) {
      for (const key of Object.keys(paginationDto)) {
        if (
          paginationDto[key] &&
          key !== 'from' &&
          paginationDto[key] !== 'to'
        ) {
          next.searchParams.append(key, paginationDto[key]);
        }
      }

      const firstSort = sort?.[0];
      const cursorKey = firstSort?.direction === 'asc' ? 'from' : 'to';
      next.searchParams.append(cursorKey, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: next?.toJSON() ?? null,
    };
  }

  private parseFilterValue({
    from,
    to,
    contains,
  }: Omit<FilterOption, 'property'>): FindOperator<number> {
    if (from && to) {
      return Between(from, to);
    }

    if (contains) {
      return In(contains);
    }

    return to ? LessThan(to) : MoreThan(from);
  }
}
