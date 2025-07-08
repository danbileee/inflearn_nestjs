export abstract class PagePaginationModel<T> {
  data: T[];

  total: number;
}

export abstract class CursorPaginationModel<T> {
  data: T[];

  cursor: {
    after: number;
  };

  count: number;

  next: string;
}

export type PaginationModel<T> =
  | PagePaginationModel<T>
  | CursorPaginationModel<T>;
