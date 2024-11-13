import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditorToolbar } from "@/components/markdown-editor/EditorToolbar";
import { NotesList } from "@/components/notes/NotesList";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Download } from "lucide-react";

const Notes = () => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: "text-gray-900 font-bold",
          },
        },
        bold: {
          HTMLAttributes: {
            class: "text-gray-900 font-bold",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-gray-900 underline font-medium",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
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
        class: "prose prose-sm max-w-none dark:prose-invert p-4 min-h-[300px] outline-none [&>*]:text-gray-900",
      },
    },
  });

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createNote = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.from("notes").insert({
        title: "Nova nota",
        content: "",
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setSelectedNoteId(data.id);
      setTitle("Nova nota");
      editor?.commands.setContent("");
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title: string; content: string }) => {
      const { error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Nota salva com sucesso!");
    },
  });

  useEffect(() => {
    if (selectedNoteId) {
      const note = notes.find((n) => n.id === selectedNoteId);
      if (note) {
        setTitle(note.title);
        editor?.commands.setContent(note.content);
      }
    }
  }, [selectedNoteId, notes, editor]);

  const handleSave = () => {
    if (selectedNoteId && editor) {
      updateNote.mutate({
        id: selectedNoteId,
        title,
        content: editor.getHTML(),
      });
    }
  };

  const exportToDoc = () => {
    if (!editor || !title) return;
    
    const content = editor.getHTML();
    const blob = new Blob([content], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container max-w-screen-xl py-8 h-[calc(100vh-4rem)] flex animate-fade-in">
      <NotesList
        notes={notes}
        onNoteSelect={setSelectedNoteId}
        selectedNoteId={selectedNoteId}
      />
      
      <div className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => createNote.mutate()}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da nota"
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportToDoc}>
              <Download className="h-4 w-4 mr-2" />
              Exportar DOC
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>

        <div className="flex-1 border rounded-md bg-white overflow-hidden">
          <EditorToolbar editor={editor} addImage={() => {}} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default Notes;