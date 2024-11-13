import { Button } from "@/components/ui/button";
import {
  Bold, Italic, List, Link as LinkIcon, ListOrdered,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
  AlignRight, Underline as UnderlineIcon, Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon, Image as ImageIcon,
  Palette, Undo, Redo, Type
} from "lucide-react";
import { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  addImage: () => void;
}

export const EditorToolbar = ({ editor, addImage }: EditorToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2 flex flex-wrap gap-2 bg-white">
      {/* Text Style */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`text-gray-900 ${editor.isActive("paragraph") ? "bg-muted" : ""}`}
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`text-gray-900 ${editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}`}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`text-gray-900 ${editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}`}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`text-gray-900 ${editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}`}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      {/* Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`text-gray-900 ${editor.isActive("bold") ? "bg-muted" : ""}`}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`text-gray-900 ${editor.isActive("italic") ? "bg-muted" : ""}`}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`text-gray-900 ${editor.isActive("underline") ? "bg-muted" : ""}`}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`text-gray-900 ${editor.isActive("bulletList") ? "bg-muted" : ""}`}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`text-gray-900 ${editor.isActive("orderedList") ? "bg-muted" : ""}`}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      {/* Alignment */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`text-gray-900 ${editor.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}`}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`text-gray-900 ${editor.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}`}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`text-gray-900 ${editor.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}`}
      >
        <AlignRight className="h-4 w-4" />
      </Button>

      {/* Subscript/Superscript */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        className={`text-gray-900 ${editor.isActive("subscript") ? "bg-muted" : ""}`}
      >
        <SubscriptIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        className={`text-gray-900 ${editor.isActive("superscript") ? "bg-muted" : ""}`}
      >
        <SuperscriptIcon className="h-4 w-4" />
      </Button>

      {/* Links and Images */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const url = window.prompt('URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`text-gray-900 ${editor.isActive("link") ? "bg-muted" : ""}`}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={addImage}
        className="text-gray-900"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      {/* Text Color */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          const color = window.prompt('Cor (ex: #000000):');
          if (color) {
            editor.chain().focus().setColor(color).run();
          }
        }}
        className="text-gray-900"
      >
        <Palette className="h-4 w-4" />
      </Button>

      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="text-gray-900"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="text-gray-900"
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
};