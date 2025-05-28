import { Input } from "@/components/ui/input";

export const TableInput = ({ table, placeholder, columnValue }) => {
  return (
    <Input
      placeholder={placeholder}
      value={table.getColumn(columnValue)?.getFilterValue() ?? ""}
      onChange={(event) =>
        table.getColumn(columnValue)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
};
