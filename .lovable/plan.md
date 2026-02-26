
## Abrir detalhes do professor em nova pagina

Substituir o modal de detalhes do professor por uma pagina dedicada `/teacher-list/:id`, permitindo visualizar todo o conteudo sem limitacao de espaco.

### Alteracoes

1. **Criar pagina `src/pages/TeacherDetail.tsx`**
   - Pagina que recebe o `id` via `useParams`
   - Busca os dados do professor no Supabase pelo ID
   - Exibe todos os campos (nome, email, WhatsApp, formacao, experiencia, video, motivacao, data) em layout de pagina completa
   - Botao "Voltar" para retornar a `/teacher-list`

2. **Atualizar `src/pages/TeacherList.tsx`**
   - Remover o Dialog de detalhes e imports relacionados (Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger)
   - Remover estado `selectedTeacher`
   - Alterar botao "Ver Detalhes" para navegar com `Link` para `/teacher-list/${teacher.id}` (abrindo na mesma aba dentro do layout protegido)

3. **Atualizar `src/App.tsx`**
   - Importar `TeacherDetail`
   - Adicionar rota protegida `/teacher-list/:id` apontando para `TeacherDetail`
