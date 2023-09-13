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
    totalPages: pagination.totalPages,
  };
};

export const skipPages = (pagination: PaginationParamsDto) => {
  return (+pagination?.page - 1) * +pagination?.size;
};
