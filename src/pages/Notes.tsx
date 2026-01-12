import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { NotesList } from "@/components/notes/NotesList";
import { NoteHeader } from "@/components/notes/NoteHeader";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { useNoteMutations } from "@/components/notes/NoteMutations";
import { toast } from "sonner";

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
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

  const handleExport = () => {
    if (selectedNoteId && editor) {
      const content = editor.getHTML();
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            img { max-width: 100%; height: auto; }
            p { margin-bottom: 1em; }
            h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
          </style>
        </head>
        <body>${content}</body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'application/vnd.ms-word;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const selectedNote = notes?.find((note) => note.id === selectedNoteId);
      const fileName = `${selectedNote?.title || 'nota'}.doc`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleNewNote = async () => {
    try {
      if (editor) {
        editor.commands.clearContent();
      }
      
      const { data, error } = await supabase
        .from('notes')
        .insert([{ 
          title: 'Nova nota', 
          content: '<p>Digite o conteúdo da sua nota aqui...</p>' 
        }])
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSelectedNoteId(data.id);
        refetch();
        toast.success('Nova nota criada');
      }
    } catch (error) {
      toast.error('Erro ao criar nova nota');
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
        <>
          <NoteHeader
            title={selectedNote.title}
            onRename={(newTitle) => {
              updateNoteMutation.mutate({
                id: selectedNoteId,
                title: newTitle,
                content: editor?.getHTML() || '',
              });
            }}
            onDelete={() => deleteNoteMutation.mutate(selectedNoteId)}
            onNewNote={handleNewNote}
          />
          <NoteEditor
            editor={editor}
            onSave={handleSave}
            onExport={handleExport}
            addImage={addImage}
          />
        </>
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