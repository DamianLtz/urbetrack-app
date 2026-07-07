import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const kept: number[] = [];
  for (let page = 1; page <= total; page++) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) {
      kept.push(page);
    }
  }

  const items: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const page of kept) {
    const gap = page - prev;
    if (prev) {
      if (gap === 2) items.push(prev + 1);
      else if (gap > 2) items.push("ellipsis");
    }
    items.push(page);
    prev = page;
  }
  return items;
}

interface DataTablePaginationProps {
  pageIndex: number;
  pageCount: number;
  onPageChange: (pageIndex: number) => void;
}

// Recibe primitivos reactivos (no el objeto `table`, que tiene referencia
// estable): con React Compiler, pasar el table memoizaría el JSX y el
// resaltado de página no se actualizaría.
export function DataTablePagination({
  pageIndex,
  pageCount,
  onPageChange,
}: DataTablePaginationProps) {
  const current = pageIndex + 1;
  const canPrevious = current > 1;
  const canNext = current < pageCount;

  return (
    <Pagination className="justify-center">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            text="Anterior"
            aria-disabled={!canPrevious}
            tabIndex={canPrevious ? undefined : -1}
            className={
              canPrevious ? undefined : "pointer-events-none opacity-50"
            }
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageIndex - 1);
            }}
          />
        </PaginationItem>

        {getPageItems(current, pageCount).map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={item === current}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item - 1);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            text="Siguiente"
            aria-disabled={!canNext}
            tabIndex={canNext ? undefined : -1}
            className={canNext ? undefined : "pointer-events-none opacity-50"}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(pageIndex + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
