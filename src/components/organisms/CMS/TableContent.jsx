import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableInput } from "@/components/atoms/CMS/TableInput";
import { Button } from "../../ui/button";
import { columns as columnBlogs } from "@/components/atoms/CMS/BlogsTableColumns";
import { columns as columnTestimonials } from "@/components/atoms/CMS/TestimonialsTableColumns";
import { columns as columnSuscriptors } from "@/components/atoms/CMS/SuscriptorsTableColumns";
import { Loader } from "../../icons/Loader";
import { TablePagination } from "../../molecules/CMS/TablePagination";

export function TableContent({
  data = [],
  columnName,
  inputValue,
  placeholder,
  onEdit,
  onDelete,
  loading,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const returnColumn = () => {
    switch (columnName) {
      case "blog":
        return columnBlogs(onEdit, onDelete);

      case "testimonials":
        return columnTestimonials(onEdit, onDelete);

      case "suscriptors":
        return columnSuscriptors(onDelete);

      default:
        return {};
    }
  };

  const table = useReactTable({
    data,
    columns: returnColumn(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDeleteElements = async () => {
    const getElementsId = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    onDelete(getElementsId);
  };

  return (
    <div className="w-full bg-white px-4 rounded-sm">
      <div className="flex items-center py-4 gap-2 justify-between">
        <TableInput
          placeholder={placeholder}
          table={table}
          columnValue={inputValue}
        />
        {!!table.getFilteredSelectedRowModel().rows.length && (
          <Button onClick={handleDeleteElements} variant="destructive">
            Eliminar
          </Button>
        )}
      </div>
      <div className="mb-4">
        <TablePagination table={table} />
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="relative">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={returnColumn().length}
                  className="h-24 text-center "
                >
                  <Loader customClass="!text-black mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className={cell.column.id === "title" ? "" : "whitespace-nowrap"}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={returnColumn().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <div className="text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
