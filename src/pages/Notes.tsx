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

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
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

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        <div className="flex flex-col gap-4">
          <Button onClick={() => createNoteMutation.mutate()}>Nova Nota</Button>
          <NotesList
            notes={notes || []}
            onNoteSelect={setSelectedNoteId}
            selectedNoteId={selectedNoteId}
          />
        </div>
        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col">
          <div className="border-b bg-background">
            <EditorToolbar editor={editor} addImage={addImage} />
          </div>
          <div className="flex-1 overflow-auto bg-background">
            <EditorContent editor={editor} />
          </div>
          <div className="p-4 border-t bg-background flex justify-end gap-2">
            <Button variant="outline" onClick={handleExport}>
              Exportar como DOC
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;
