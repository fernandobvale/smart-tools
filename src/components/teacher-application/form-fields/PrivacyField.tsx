import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { TeacherApplicationForm } from "@/types/teacher-application";

interface PrivacyFieldProps {
  form: UseFormReturn<TeacherApplicationForm>;
}

export const PrivacyField = ({ form }: PrivacyFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="privacy_accepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Aceito a{" "}
              <a
                href="/privacy-policy"
                target="_blank"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Política de Privacidade
              </a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};