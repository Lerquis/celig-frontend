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
import { TableInput } from "../atoms/TableInput";
import { Button } from "../ui/button";
import { columns as columnBlogs } from "@/components/atoms/BlogsTableColumns";
import { columns as columnTestimonials } from "@/components/atoms/TestimonialsTableColumns";
import { columns as columnSuscriptors } from "@/components/atoms/SuscriptorsTableColumns";

export function TableContent({
  data = [],
  columnName,
  inputValue,
  placeholder,
  onEdit,
  onDelete,
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
        return columnSuscriptors;

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

    console.log("delete ", ...getElementsId);
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
