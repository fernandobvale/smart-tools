

## Corrigir exportacao de notas para formato compativel com Word

### Problema
O arquivo exportado e um HTML salvo com extensao `.docx` e MIME type de Word, mas nao e um arquivo `.docx` real (que e um ZIP com XMLs internos). O Word rejeita porque o conteudo nao corresponde ao formato.

### Solucao
Alterar para exportar como `.doc` (formato antigo) usando MIME type `application/msword`. O Word abre arquivos `.doc` contendo HTML sem problemas -- este e um formato suportado nativamente.

### Alteracoes

**`src/pages/Notes.tsx`** (2 mudancas):
- Linha 92: Alterar o MIME type do Blob para `application/msword`
- Linha 97: Alterar a extensao do arquivo de `.docx` para `.doc`

**`src/components/notes/NoteEditor.tsx`**:
- Alterar o texto do botao de "Exportar como .docx" para "Exportar como .doc"

Isso garante que o Word consiga abrir o arquivo corretamente, pois o formato `.doc` aceita conteudo HTML embutido.

