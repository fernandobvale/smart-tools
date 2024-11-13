import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { NotesList } from "@/components/notes/NotesList";
import { EditorToolbar } from "@/components/markdown-editor/EditorToolbar";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Image,
    ],
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none dark:prose-invert p-4 min-h-[500px] outline-none",
      },
    },
  });

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ title: 'Nova nota', content: '' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNoteId(data.id);
      toast.success('Nova nota criada');
    },
    onError: () => {
      toast.error('Erro ao criar nota');
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('notes')
        .update({ title, content, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Nota salva');
    },
    onError: () => {
      toast.error('Erro ao salvar nota');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setSelectedNoteId(null);
      toast.success('Nota excluída');
    },
    onError: () => {
      toast.error('Erro ao excluir nota');
    },
  });

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  useEffect(() => {
    if (notes?.length && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (selectedNoteId && notes) {
      const selectedNote = notes.find((note) => note.id === selectedNoteId);
      if (selectedNote && editor) {
        editor.commands.setContent(selectedNote.content);
        setNewTitle(selectedNote.title);
      }
    }
  }, [selectedNoteId, notes, editor]);

  const handleSave = () => {
    if (selectedNoteId && editor) {
      const selectedNote = notes?.find((note) => note.id === selectedNoteId);
      if (selectedNote) {
        updateNoteMutation.mutate({
          id: selectedNoteId,
          title: selectedNote.title,
          content: editor.getHTML(),
        });
      }
    }
  };

  const handleRename = () => {
    if (selectedNoteId && newTitle.trim()) {
      updateNoteMutation.mutate({
        id: selectedNoteId,
        title: newTitle,
        content: editor?.getHTML() || '',
      });
    }
  };

  const handleExport = () => {
    if (editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'note.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const selectedNote = notes?.find((note) => note.id === selectedNoteId);

  return (
    <div className="container py-8 animate-fade-in h-[calc(100vh-4rem)] flex flex-col gap-4">
      <div className="h-[250px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Minhas Notas</h2>
          <Button 
            onClick={() => createNoteMutation.mutate()} 
          >
            Nova Nota
          </Button>
        </div>
        <NotesList
          notes={notes || []}
          onNoteSelect={setSelectedNoteId}
          selectedNoteId={selectedNoteId}
        />
      </div>
      
      {selectedNoteId && (
        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-background min-h-[400px]">
          <div className="border-b p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    Renomear
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Renomear Nota</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Digite o novo título"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleRename}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
                    deleteNoteMutation.mutate(selectedNoteId);
                  }
                }}
              >
                Excluir
              </Button>
            </div>
            <span className="text-sm font-medium">
              {selectedNote?.title}
            </span>
          </div>
          <EditorToolbar editor={editor} addImage={addImage} />
          <div className="flex-1 overflow-auto">
            <EditorContent editor={editor} />
          </div>
          <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={handleExport}>
              Exportar como DOC
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;