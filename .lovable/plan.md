
## Definir "Grazielle" como editor padrao no formulario de novo lancamento

Alteracao simples no arquivo `src/components/courses/CourseForm.tsx`:

- Na linha 54, alterar o valor padrao de `nome_editor` de `""` para `"Grazielle"` (apenas quando nao ha `initialData`, ou seja, ao criar novo lancamento)

Isso fara com que ao abrir o formulario de "Novo Lancamento", o campo Editor ja venha pre-selecionado com "Grazielle". Ao editar um lancamento existente, o editor original sera mantido.
