
Objetivo: eliminar o erro de exportação em `/notes` e manter o download `.docx` funcionando com textos coloridos.

Diagnóstico confirmado:
- O erro atual não é mais de React; é de serialização de cor no `docx`.
- Stack trace aponta para `src/utils/htmlToDocx.ts` dentro de `extractRuns`.
- Mensagem exata: `Invalid hex value 'rgb(227, 227, 227)'. Expected 6 digit hex value`.
- A coluna `notes.content` já contém HTML com `style="color: rgb(227, 227, 227)"`, então o bug é reproduzível com dados reais.
- Causa raiz: o parser atual pega qualquer valor de `color:` e envia direto ao `TextRun`, mas a lib `docx` aceita apenas hex de 6 dígitos (sem `#`).

Implementação proposta (sequência):
1) Fortalecer a conversão de cor em `src/utils/htmlToDocx.ts`
- Criar helper `normalizeDocxColor(value: string): string | undefined`.
- Regras:
  - Aceitar `#RRGGBB` e retornar `RRGGBB`.
  - Aceitar `#RGB` e expandir para `RRGGBB`.
  - Aceitar `rgb(r,g,b)` e converter para hex.
  - Aceitar `rgba(r,g,b,a)` e ignorar alpha para gerar hex RGB.
  - Para valores inválidos/desconhecidos, retornar `undefined` (sem quebrar exportação).

2) Aplicar a normalização no trecho de `SPAN` em `extractRuns`
- Trocar a atribuição direta:
  - de `opts.color = colorMatch[1].trim().replace("#", "")`
  - para `opts.color = normalizeDocxColor(rawColor)` quando houver valor válido.
- Se `normalizeDocxColor` retornar `undefined`, não enviar `color` para o `TextRun`.

3) Garantir robustez defensiva
- Manter exportação funcionando mesmo com HTML “sujo” (cores fora do padrão).
- Não interromper geração do `.docx` por causa de estilo inválido em um único trecho.

4) Pequeno ajuste de limpeza (opcional, mas recomendado)
- Remover import não utilizado (`ExternalHyperlink`) em `htmlToDocx.ts` para manter o arquivo limpo.

Validação (fim a fim):
1. Abrir `/notes` e selecionar uma nota já existente com `<span style="color: rgb(...)">`.
2. Exportar como `.docx` e confirmar:
   - não aparece `Erro ao exportar nota`;
   - aparece toast de sucesso;
   - arquivo baixa normalmente.
3. Testar também:
   - texto sem cor;
   - texto com cor em hex (`#1a73e8`);
   - texto com `rgb(...)`.
4. Abrir o `.docx` no Word e validar que o documento abre sem corrupção e com conteúdo preservado.

Resultado esperado:
- O botão “Exportar como .docx” volta a funcionar para notas com ou sem cor.
- Valores CSS de cor incompatíveis deixam de derrubar a exportação.
