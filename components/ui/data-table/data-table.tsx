/* eslint-disable  no-explicit-any */
/* eslint-disable  @typescript-eslint/no-explicit-any */
// components/ui/data-table/data-table.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  DateFilterOption,
  DateRange,
} from '@/components/ui/data-table/date-filter';
import RowsPerPage from '@/components/ui/data-table/rows-per-page';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import FilterBar from './filter-bar';
import TableActions from './table-actions';

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  title: string;
  subtitle?: string;
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  onRefresh?: () => void;
  actions?: {
    onAdd?: () => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onExport?: (filteredData: T[]) => void;
  };
  filters?: {
    searchFields?: (keyof T)[];
    enableDateFilter?: boolean;
    getItemDate?: (item: T) => Date | string;
    additionalFilters?: ReactNode;
  };
  renderRowActions?: (item: T) => ReactNode;
  emptyState?: ReactNode;
}

export default function DataTable<T>({
  title,
  subtitle,
  data,
  columns,
  keyField,
  isLoading = false,
  onRefresh,
  actions,
  filters,
  renderRowActions,
  emptyState,
}: DataTableProps<T>) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<{
    range: DateRange | null;
    option: DateFilterOption;
  }>({
    range: null,
    option: 'lifetime',
  });
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, itemsPerPage]);

  // Apply search filter
  const applySearchFilter = (items: T[]): T[] => {
    if (!searchQuery.trim() || !filters?.searchFields?.length) return items;

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      return filters.searchFields!.some((field) => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  };

  // Apply date filter
  const applyDateFilter = (items: T[]): T[] => {
    if (
      !dateFilter.range?.from ||
      !dateFilter.range?.to ||
      !filters?.getItemDate
    ) {
      return items;
    }

    const from = new Date(dateFilter.range.from);
    const to = new Date(dateFilter.range.to);

    return items.filter((item) => {
      const itemDate =
        filters && filters.getItemDate
          ? new Date(filters.getItemDate(item))
          : new Date();
      return itemDate >= from && itemDate <= to;
    });
  };

  // Apply all filters
  const filteredData = applyDateFilter(applySearchFilter(data));

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 10) {
      // Show all pages if 10 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, current page and neighbors, and last page
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Middle
        pageNumbers.push(1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('ellipsis');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Get value from accessorKey (which could be a string or function)
  const getCellValue = (item: T, accessor: keyof T | ((row: T) => any)) => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor];
  };

  return (
    <Card className="w-full border-border/40 rounded-md shadow-none">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-6 border-b border-border/40">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
          {subtitle && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh data"
              className="hover:bg-accent transition-colors bg-transparent"
            >
              <RefreshCw
                className={clsx('h-4 w-4', isLoading && 'animate-spin')}
              />
            </Button>
          )}
          {actions?.onAdd && <TableActions.AddButton onClick={actions.onAdd} />}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Filter bar */}
        {filters && (
          <div className="mb-6">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              showDateFilter={filters.enableDateFilter}
              dateFilter={dateFilter}
              onDateFilterChange={(range, option) =>
                setDateFilter({ range, option })
              }
              additionalFilters={filters.additionalFilters}
              onExport={
                actions?.onExport
                  ? () =>
                      actions &&
                      actions.onExport &&
                      actions.onExport(filteredData)
                  : undefined
              }
            />
          </div>
        )}

        <div className="rounded-lg border border-border/40 overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/40">
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className="font-semibold text-foreground h-12"
                  >
                    {column.header}
                  </TableHead>
                ))}
                {renderRowActions && (
                  <TableHead className="text-right font-semibold text-foreground h-12">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((item, i) => (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/30 transition-colors border-b border-border/30 last:border-0"
                  >
                    {columns.map((column, index) => (
                      <TableCell key={index} className="py-4">
                        {column.cell
                          ? column.cell(item)
                          : getCellValue(item, column.accessorKey)}
                      </TableCell>
                    ))}
                    {renderRowActions && (
                      <TableCell className="text-right py-4">
                        {renderRowActions(item)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length + (renderRowActions ? 1 : 0)}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-muted-foreground font-medium">
                        {emptyState ||
                          (searchQuery || dateFilter.option !== 'lifetime'
                            ? 'No matching items found for the selected filters'
                            : 'No items found')}
                      </p>
                      {(searchQuery || dateFilter.option !== 'lifetime') && (
                        <p className="text-sm text-muted-foreground/70">
                          Try adjusting your filters to see more results
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <RowsPerPage
                value={itemsPerPage}
                onChange={setItemsPerPage}
                options={[10, 25, 50, 100]}
              />
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              Showing{' '}
              <span className="text-foreground font-semibold">
                {indexOfFirstItem + 1}
              </span>
              -
              <span className="text-foreground font-semibold">
                {Math.min(indexOfLastItem, filteredData.length)}
              </span>{' '}
              of{' '}
              <span className="text-foreground font-semibold">
                {filteredData.length}
              </span>
            </div>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={clsx(
                        currentPage === 1
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer hover:bg-accent transition-colors',
                      )}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          onClick={() => handlePageChange(page as number)}
                          className={clsx(
                            currentPage === page
                              ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                              : 'cursor-pointer hover:bg-accent transition-colors',
                          )}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={clsx(
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-40'
                          : 'cursor-pointer hover:bg-accent transition-colors',
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
