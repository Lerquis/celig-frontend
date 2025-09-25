import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateToDDMMYYYY } from "@/lib/dateFormatter";

export const columns = (onEdit, onDelete) => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="max-w-[400px] truncate" title={row.getValue("title")}>
          {row.getValue("title")}
        </div>
      ),
      meta: {
        style: { maxWidth: "400px" },
      },
    },
    {
      accessorKey: "tags",
      header: () => <div className="text-center">Tags</div>,
      cell: ({ row }) => {
        const tags = row.getValue("tags");

        return (
          <div className="min-w-[120px]">
            <p className="text-sm text-muted-foreground flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-black text-white py-[2px] px-[6px] text-[10px] rounded-full whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "views",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Views
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center min-w-[60px]">{row.getValue("views")}</div>
      ),
    },

    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Creado el</div>,
      cell: ({ row }) => {
        const date = formatDateToDDMMYYYY(row.getValue("createdAt"));

        return <div className="text-right font-medium min-w-[100px]">{date}</div>;
      },
    },

    {
      accessorKey: "updatedAt",
      header: () => <div className="text-right">Modificado el</div>,
      cell: ({ row }) => {
        const date = formatDateToDDMMYYYY(row.getValue("updatedAt"));

        return <div className="text-right font-medium min-w-[100px]">{date}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        // ! Se encuentra toda la información del blog
        const blog = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 min-w-[32px]">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                Editar blog
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                Eliminar blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
