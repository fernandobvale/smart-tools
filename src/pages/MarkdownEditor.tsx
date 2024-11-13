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
import { Copy } from "lucide-react";
import { EditorToolbar } from "@/components/markdown-editor/EditorToolbar";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState("");
  const md = new MarkdownIt();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          HTMLAttributes: {
            class: 'text-gray-900 font-bold',
          },
        },
        bold: {
          HTMLAttributes: {
            class: 'text-gray-900 font-bold',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gray-900 underline font-medium',
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
        class: "prose prose-sm max-w-none dark:prose-invert p-4 min-h-[300px] outline-none [&>*]:text-gray-900",
      },
    },
    content: "",
    editable: true,
  });

  // Update editor content when markdown changes
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
            className="min-h-[200px] font-mono bg-gray-900 text-white"
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
            <EditorToolbar editor={editor} addImage={addImage} />
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;