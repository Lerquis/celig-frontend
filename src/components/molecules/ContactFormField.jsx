import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";

export const ContactFormField = ({ form, isLoading, name, label, type }) => {
  return (
    <FormField
      disabled={isLoading}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl />
          <FormLabel className="uppercase rosdcel text-[28px]">
            {label}
          </FormLabel>
          {type === "textarea" ? (
            <Textarea
              {...field}
              className="min-h-[100px] !bg-transparent !border-b-[1px] border-0 rounded-none montreg"
            />
          ) : (
            <Input
              type={type}
              {...field}
              className={`!bg-transparent !border-b-[1px] border-0 rounded-none montreg`}
            />
          )}
        </FormItem>
      )}
    />
  );
};
