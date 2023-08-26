import { PaginateOptions } from 'mongoose';

export const paginationParams = (params: { page: string; limit: string }) => {
  return {
    page: Number(params.page) || 1,
    limit: Number(params.limit) || 10,
    customLabels: {
      docs: 'items',
    },
  } as PaginateOptions;
};

interface IFormatResponse {
  items?: any[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page?: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: any;
  nextPage?: any;
}

export const formatResponse = (
  response: IFormatResponse,
  otherFields?: { [key: string]: any },
) => {
  return {
    items: response?.items ?? [],
    pageInfo: {
      totalDocs: response.totalDocs,
      limit: response.limit,
      totalPages: response.totalPages,
      page: response.page,
      pagingCounter: response.pagingCounter,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
      prevPage: response?.prevPage,
      nextPage: response?.nextPage,
    },
    ...(otherFields && { ...otherFields }),
  };
};
