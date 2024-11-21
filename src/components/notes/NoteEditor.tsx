import { EditorContent, Editor } from "@tiptap/react";
import { EditorToolbar } from "@/components/markdown-editor/EditorToolbar";
import { Button } from "@/components/ui/button";
import { NoteCopyButton } from "./NoteCopyButton";

interface NoteEditorProps {
  editor: Editor | null;
  onSave: () => void;
  onExport: () => void;
  addImage: () => void;
}

export const NoteEditor = ({ editor, onSave, onExport, addImage }: NoteEditorProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex-1 border rounded-lg overflow-hidden flex flex-col bg-background">
      <EditorToolbar editor={editor} addImage={addImage} />
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="p-4 border-t flex justify-end gap-2">
        <NoteCopyButton content={editor.getHTML()} />
        <Button variant="outline" onClick={onExport}>
          Exportar como DOC
        </Button>
        <Button onClick={onSave}>Salvar</Button>
      </div>
    </div>
  );
};