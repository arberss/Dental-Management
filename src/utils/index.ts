import { PaginationParamsDto } from 'src/dtos/pagination/pagination.dto';

export interface IPaginationProps {
  page: string;
  size: string;
  totalPages: number;
}

export const calculatePages = (pagination: IPaginationProps) => {
  return {
    page: pagination.page,
    size: pagination.size,
    totalPages: Math.ceil(
      pagination.totalPages / (Number(pagination.size) ?? 1),
    ),
  };
};

export const skipPages = (pagination: PaginationParamsDto) => {
  return (+pagination?.page - 1) * +pagination?.size;
};
