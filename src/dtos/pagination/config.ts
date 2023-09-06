import { IPaginationProps } from 'src/utils';

export const formatResponse = (data: any[], pagination: IPaginationProps) => {
  return {
    items: data ?? [],
    pageInfo: {
      page:
        pagination.totalPages < +pagination?.page
          ? +pagination.totalPages
          : +pagination?.page,
      size: +pagination.size,
      totalPages: pagination.totalPages,
    },
  };
};
