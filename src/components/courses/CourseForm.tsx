import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  nome_curso: z.string().min(1, "Nome do curso é obrigatório"),
  numero_aulas: z.coerce.number().min(1, "Número de aulas é obrigatório"),
  data_entrega: z.string().min(1, "Data de entrega é obrigatória"),
  valor: z.coerce.number().min(0, "Valor é obrigatório"),
  data_pagamento: z.string().optional(),
  status_pagamento: z.string().min(1, "Status de pagamento é obrigatório"),
  nome_editor: z.string().min(1, "Nome do editor é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface Editor {
  id: string;
  nome: string;
}

interface CourseFormProps {
  initialData?: FormValues & { id: string };
  onSuccess: () => void;
}

export function CourseForm({ initialData, onSuccess }: CourseFormProps) {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [isNewEditorDialogOpen, setIsNewEditorDialogOpen] = useState(false);
  const [newEditorName, setNewEditorName] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome_curso: "",
      numero_aulas: 0,
      data_entrega: format(new Date(), "yyyy-MM-dd"),
      valor: 0,
      data_pagamento: "",
      status_pagamento: "",
      nome_editor: "",
    },
  });

  useEffect(() => {
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    const { data, error } = await supabase
      .from("editores")
      .select("*")
      .order("nome");

    if (error) {
      toast.error("Erro ao carregar editores");
      return;
    }

    setEditors(data);
  };

  const calculateValue = (numberOfLessons: number) => {
    const valuePerLesson = numberOfLessons <= 15 ? 10 : 8;
    return numberOfLessons * valuePerLesson;
  };

  const handleNumberOfLessonsChange = (value: number) => {
    form.setValue("numero_aulas", value);
    form.setValue("valor", calculateValue(value));
  };

  const addNewEditor = async () => {
    if (!newEditorName.trim()) {
      toast.error("Nome do editor é obrigatório");
      return;
    }

    const { error } = await supabase
      .from("editores")
      .insert({ nome: newEditorName.trim() });

    if (error) {
      toast.error("Erro ao adicionar editor");
      return;
    }

    toast.success("Editor adicionado com sucesso!");
    setNewEditorName("");
    setIsNewEditorDialogOpen(false);
    fetchEditors();
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const courseData = {
        nome_curso: values.nome_curso,
        numero_aulas: values.numero_aulas,
        data_entrega: values.data_entrega,
        valor: values.valor,
        data_pagamento: values.data_pagamento || null,
        status_pagamento: values.status_pagamento,
        nome_editor: values.nome_editor,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("cursos")
          .update(courseData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Lançamento atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("cursos")
          .insert(courseData);

        if (error) throw error;
        toast.success("Lançamento criado com sucesso!");
      }

      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error("Erro ao salvar o lançamento. Tente novamente.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome_curso"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Curso</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numero_aulas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Aulas</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => handleNumberOfLessonsChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_entrega"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Entrega</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : new Date()}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  readOnly 
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_pagamento"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data do Pagamento</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "dd/MM/yyyy")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status_pagamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nome_editor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Editor</FormLabel>
              <div className="flex gap-2">
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione o editor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {editors.map((editor) => (
                      <SelectItem key={editor.id} value={editor.nome}>
                        {editor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isNewEditorDialogOpen} onOpenChange={setIsNewEditorDialogOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline">
                      Novo Editor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Editor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Nome do editor"
                        value={newEditorName}
                        onChange={(e) => setNewEditorName(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <DialogClose asChild>
                          <Button type="button" variant="outline">
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button type="button" onClick={addNewEditor}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {initialData ? "Atualizar Lançamento" : "Criar Lançamento"}
        </Button>
      </form>
    </Form>
  );
}