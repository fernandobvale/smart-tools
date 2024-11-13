import { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold, Italic, List, Link as LinkIcon, ListOrdered,
  Heading1, Heading2, Heading3, AlignLeft, AlignCenter,
  AlignRight, Underline as UnderlineIcon, Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon, Image as ImageIcon,
  Palette, Undo, Redo, Paragraph
} from "lucide-react";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const md = new MarkdownIt();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
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
        class: "prose prose-sm max-w-none dark:prose-invert p-4 min-h-[300px] outline-none text-gray-900",
      },
    },
    content: "",
    editable: true,
  });

  useEffect(() => {
    if (editor && markdown) {
      const html = md.render(markdown);
      editor.commands.setContent(html);
    }
  }, [markdown, editor]);

  const handleCopy = async () => {
    try {
      if (editor) {
        const textContent = editor.getText();
        await navigator.clipboard.writeText(textContent);
        toast.success("Texto formatado copiado para a área de transferência");
      }
    } catch (error) {
      toast.error("Erro ao copiar o texto");
    }
  };

  const addImage = () => {
    const url = window.prompt('URL da imagem:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Converta Markdown para Texto</h1>
        <p className="text-muted-foreground">
          Cole ou digite seu markdown e veja-o renderizado como texto.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
          <label className="text-lg font-medium">Insira o Markdown</label>
          <Textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Digite ou cole seu texto em Markdown aqui..."
            className="min-h-[200px] font-mono text-gray-900"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-lg font-medium">Resultado</label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </Button>
          </div>
          <div className="border rounded-md bg-white">
            <div className="border-b p-2 flex flex-wrap gap-2 bg-white">
              {/* Parágrafos e Títulos */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className={`text-gray-900 ${editor?.isActive("paragraph") ? "bg-muted" : ""}`}
              >
                <Paragraph className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`text-gray-900 ${editor?.isActive("heading", { level: 1 }) ? "bg-muted" : ""}`}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`text-gray-900 ${editor?.isActive("heading", { level: 2 }) ? "bg-muted" : ""}`}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`text-gray-900 ${editor?.isActive("heading", { level: 3 }) ? "bg-muted" : ""}`}
              >
                <Heading3 className="h-4 w-4" />
              </Button>

              {/* Formatação Básica */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`text-gray-900 ${editor?.isActive("bold") ? "bg-muted" : ""}`}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`text-gray-900 ${editor?.isActive("italic") ? "bg-muted" : ""}`}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`text-gray-900 ${editor?.isActive("underline") ? "bg-muted" : ""}`}
              >
                <UnderlineIcon className="h-4 w-4" />
              </Button>

              {/* Listas */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`text-gray-900 ${editor?.isActive("bulletList") ? "bg-muted" : ""}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className={`text-gray-900 ${editor?.isActive("orderedList") ? "bg-muted" : ""}`}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>

              {/* Alinhamento */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                className={`text-gray-900 ${editor?.isActive({ textAlign: 'left' }) ? "bg-muted" : ""}`}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                className={`text-gray-900 ${editor?.isActive({ textAlign: 'center' }) ? "bg-muted" : ""}`}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                className={`text-gray-900 ${editor?.isActive({ textAlign: 'right' }) ? "bg-muted" : ""}`}
              >
                <AlignRight className="h-4 w-4" />
              </Button>

              {/* Subscript/Superscript */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleSubscript().run()}
                className={`text-gray-900 ${editor?.isActive("subscript") ? "bg-muted" : ""}`}
              >
                <SubscriptIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().toggleSuperscript().run()}
                className={`text-gray-900 ${editor?.isActive("superscript") ? "bg-muted" : ""}`}
              >
                <SuperscriptIcon className="h-4 w-4" />
              </Button>

              {/* Links e Imagens */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = window.prompt('URL:');
                  if (url) {
                    editor?.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`text-gray-900 ${editor?.isActive("link") ? "bg-muted" : ""}`}
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

              {/* Cor do Texto */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const color = window.prompt('Cor (ex: #000000):');
                  if (color) {
                    editor?.chain().focus().setColor(color).run();
                  }
                }}
                className="text-gray-900"
              >
                <Palette className="h-4 w-4" />
              </Button>

              {/* Desfazer/Refazer */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().undo().run()}
                disabled={!editor?.can().undo()}
                className="text-gray-900"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor?.chain().focus().redo().run()}
                disabled={!editor?.can().redo()}
                className="text-gray-900"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;