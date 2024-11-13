import { useState, useEffect } from "react";
import MarkdownIt from "markdown-it";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Copy, Bold, Italic, List, Link as LinkIcon, ListOrdered } from "lucide-react";

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
            <div className="border-b p-2 flex gap-2 bg-white">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const url = window.prompt("URL:");
                  if (url) {
                    editor?.chain().focus().setLink({ href: url }).run();
                  }
                }}
                className={`text-gray-900 ${editor?.isActive("link") ? "bg-muted" : ""}`}
              >
                <LinkIcon className="h-4 w-4" />
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