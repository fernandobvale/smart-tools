import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Note } from "@/components/notes/Note";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NoteType {
  id: string;
  created_at: string;
  title: string;
  content: string;
}

export default function Notes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<NoteType[]>([]);

  const { data: fetchedNotes, isError, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NoteType[];
    },
  });

  useEffect(() => {
    if (fetchedNotes) {
      setNotes(fetchedNotes);
    }
  }, [fetchedNotes]);

  const createNote = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        title,
        content,
      });

      if (error) throw error;

      setOpen(false);
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota criada com sucesso!");
    } catch (error) {
      console.error("Error creating note:", error);
      toast.error("Erro ao criar nota");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suas Notas</h1>
        <Button onClick={() => setOpen(true)}>Criar Nota</Button>
      </div>

      {isLoading && <p>Carregando notas...</p>}
      {isError && <p>Erro ao carregar notas.</p>}

      <ScrollArea className="mb-4 h-[70vh] w-full rounded-md border">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {notes.map((note) => (
            <Note key={note.id} note={note} onDeleteSuccess={() => {
              const newNotes = notes.filter((n) => n.id !== note.id);
              setNotes(newNotes);
            }} />
          ))}
        </div>
      </ScrollArea>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Nota</DialogTitle>
            <DialogDescription>
              Adicione um título e conteúdo para sua nova nota.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right mt-2">
                Conteúdo
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit" onClick={createNote}>
            Criar nota
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
