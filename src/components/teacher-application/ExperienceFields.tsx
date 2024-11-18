import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TeacherApplicationFormData } from "./types";

interface ExperienceFieldsProps {
  form: UseFormReturn<TeacherApplicationFormData>;
}

export const ExperienceFields = ({ form }: ExperienceFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="academic_background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formação Acadêmica, Técnica ou Profissional</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva sua formação..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="teaching_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experiência como Professor</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Descreva sua experiência..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="video_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Experiência na Gravação de Aulas em Vídeo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao">Não</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="motivation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motivação para se Tornar Professor</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Conte-nos sua motivação..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};