
import { useState, useCallback, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  currentItems: T[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  loadMore: () => void;
  isLastPage: boolean;
  totalItems: number;
}

export function useInfinitePagination<T>({
  data,
  itemsPerPage = 20,
  initialPage = 1
}: UsePaginationProps<T>): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const totalItems = data.length;

  const currentItems = useMemo(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;
  const isLastPage = currentPage >= totalPages;

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const loadMore = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  return {
    currentItems,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    goToPage,
    nextPage,
    prevPage,
    loadMore,
    isLastPage,
    totalItems
  };
}
