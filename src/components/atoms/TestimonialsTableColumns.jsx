import { MoreHorizontal } from "lucide-react";

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
      accessorKey: "names",
      header: "Names",
      cell: ({ row }) => <div>{row.getValue("names")}</div>,
    },
    {
      accessorKey: "content",
      header: () => <div className="text-left">Content</div>,
      cell: ({ row }) => {
        return <div>{row.getValue("content")}</div>;
      },
    },
    {
      accessorKey: "imageUrl",
      header: () => <div className="text-left">Image</div>,

      cell: ({ row }) => (
        <img
          className="h-[100px] w-[100px] object-cover"
          src={row.getValue("imageUrl")}
          alt={row.original.imageName}
        />
      ),
    },

    {
      accessorKey: "createdAt",
      header: () => <div className="text-right">Creado el</div>,
      cell: ({ row }) => {
        const date = formatDateToDDMMYYYY(row.getValue("createdAt"));

        return <div className="text-right font-medium">{date}</div>;
      },
    },

    {
      accessorKey: "updatedAt",
      header: () => <div className="text-right">Modificado el</div>,
      cell: ({ row }) => {
        const date = formatDateToDDMMYYYY(row.getValue("updatedAt"));

        return <div className="text-right font-medium">{date}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                Editar testimonio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
                Eliminar testimonio
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
