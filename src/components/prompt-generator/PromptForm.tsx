import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "./types";

interface PromptFormProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PromptForm({ formData, onChange }: PromptFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Nome do Curso</label>
        <Input
          name="courseName"
          value={formData.courseName}
          onChange={onChange}
          placeholder="Digite o nome do curso"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Conteúdo Programático</label>
        <Textarea
          name="courseContent"
          value={formData.courseContent}
          onChange={onChange}
          placeholder="Digite o conteúdo programático"
          className="min-h-[100px]"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Carga Horária</label>
        <Input
          name="workload"
          value={formData.workload}
          onChange={onChange}
          placeholder="Digite a carga horária"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Área do Curso</label>
        <Input
          name="courseArea"
          value={formData.courseArea}
          onChange={onChange}
          placeholder="Digite a área do curso"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Link da Área</label>
        <Input
          name="areaLink"
          value={formData.areaLink}
          onChange={onChange}
          placeholder="Digite o link da área"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Curso 1</label>
        <Input
          name="course1"
          value={formData.course1}
          onChange={onChange}
          placeholder="Digite o nome do curso 1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Link Curso 1</label>
        <Input
          name="course1Link"
          value={formData.course1Link}
          onChange={onChange}
          placeholder="Digite o link do curso 1"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Curso 2</label>
        <Input
          name="course2"
          value={formData.course2}
          onChange={onChange}
          placeholder="Digite o nome do curso 2"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Link Curso 2</label>
        <Input
          name="course2Link"
          value={formData.course2Link}
          onChange={onChange}
          placeholder="Digite o link do curso 2"
        />
      </div>
    </div>
  );
}