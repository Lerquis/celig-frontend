import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Textarea } from "../ui/textarea";

export const FormFieldCMS = ({
  form,
  isLoading,
  name,
  label,
  placeholder,
  type,
}) => {
  return (
    <FormField
      disabled={isLoading}
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl />
          <FormLabel>{label}</FormLabel>
          {type === "textarea" ? (
            <Textarea
              placeholder={placeholder}
              {...field}
              className="min-h-[500px]"
            />
          ) : (
            <Input type={type} placeholder={placeholder} {...field} />
          )}
        </FormItem>
      )}
    />
  );
};
