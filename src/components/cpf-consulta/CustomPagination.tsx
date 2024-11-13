import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent className="flex flex-wrap gap-2 justify-center">
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="text-xs sm:text-sm px-2 sm:px-4"
          >
            Anterior
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page} className="hidden sm:block">
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className="text-xs sm:text-sm min-w-[32px]"
            >
              {page}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="text-xs sm:text-sm px-2 sm:px-4"
          >
            Próximo
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;