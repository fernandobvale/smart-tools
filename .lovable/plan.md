

## Exportar notas como .docx real

### Problema
O arquivo `.doc` (HTML renomeado) funciona, mas o usuario quer o formato `.docx` moderno. Um `.docx` real e um arquivo ZIP contendo XMLs estruturados -- nao basta renomear HTML.

### Solucao
Usar a biblioteca `docx` (npm) para gerar arquivos `.docx` reais a partir do conteudo HTML do editor.

### Alteracoes

1. **Instalar dependencia `docx`** e `file-saver` para download
   - `docx` gera documentos Word reais
   - `file-saver` facilita o download do blob

2. **Criar utilitario `src/utils/htmlToDocx.ts`**
   - Funcao que converte HTML do TipTap em objetos do `docx` (paragrafos, headings, texto formatado)
   - Parseia o HTML com DOMParser e mapeia elementos para a API do `docx`
   - Suporta: paragrafos, headings (h1-h6), negrito, italico, sublinhado, listas, imagens, links

3. **Atualizar `src/pages/Notes.tsx`**
   - Substituir a funcao `handleExport` para usar o utilitario `htmlToDocx`
   - Gerar o documento com `docx.Packer.toBlob()` e baixar com `file-saver`

4. **Atualizar `src/components/notes/NoteEditor.tsx`**
   - Alterar texto do botao para "Exportar como .docx"

