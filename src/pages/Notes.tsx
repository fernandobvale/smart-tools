import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
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
import { NoteHeader } from "@/components/notes/NoteHeader";
import { useNoteMutations } from "@/components/notes/NoteMutations";
import { toast } from "sonner";

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
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

  const { data: notes, isLoading, refetch } = useQuery({
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

  const { updateNoteMutation, deleteNoteMutation } = useNoteMutations(() => {
    setSelectedNoteId(null);
  });

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

  const handleRename = (newTitle: string) => {
    if (selectedNoteId && editor) {
      updateNoteMutation.mutate({
        id: selectedNoteId,
        title: newTitle,
        content: editor.getHTML(),
      });
    }
  };

  const handleDelete = () => {
    if (selectedNoteId) {
      deleteNoteMutation.mutate(selectedNoteId);
    }
  };

  const handleNewNote = async () => {
    try {
      if (editor) {
        editor.commands.clearContent();
      }
      
      const { data, error } = await supabase
        .from('notes')
        .insert([
          { 
            title: 'Nova nota', 
            content: '<p>Digite o conteúdo da sua nota aqui...</p>' 
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSelectedNoteId(data.id);
        refetch(); // Refresh the notes list
        toast.success('Nova nota criada');
      }
    } catch (error) {
      toast.error('Erro ao criar nova nota');
    }
  };

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleExport = () => {
    if (selectedNoteId && editor) {
      const content = editor.getHTML();
      const blob = new Blob([content], { type: 'text/html' });
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const selectedNote = notes?.find((note) => note.id === selectedNoteId);

  return (
    <div className="container py-8 animate-fade-in flex flex-col gap-4">
      {selectedNoteId && selectedNote && (
        <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-background">
          <NoteHeader
            title={selectedNote.title}
            onRename={handleRename}
            onDelete={handleDelete}
            onNewNote={handleNewNote}
          />
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
      
      <NotesList
        notes={notes || []}
        onNoteSelect={setSelectedNoteId}
        selectedNoteId={selectedNoteId}
      />
    </div>
  );
};

export default Notes;