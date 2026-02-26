
## Alterar exportação de notas de .doc para .docx

Mudança simples em dois pontos no arquivo `src/pages/Notes.tsx`:

1. **Alterar o Content-Type do Blob** de `application/vnd.ms-word` para `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
2. **Alterar a extensão do arquivo** de `.doc` para `.docx`

E no componente `src/components/notes/NoteEditor.tsx`:

3. **Alterar o texto do botão** de "Exportar como DOC" para "Exportar como .docx"
