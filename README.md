# Rastreador Financeiro

Aplicação web simples para acompanhar receitas e despesas, visualizar saldo atual e organizar o controle financeiro de forma prática.

## Visão geral

O projeto foi desenvolvido com HTML, CSS e JavaScript puro, com foco em uma interface visual leve e interativa. Os dados ficam salvos no navegador com `localStorage`, então as transações continuam disponíveis mesmo após recarregar a página.

## Funcionalidades

- Adição de transações com descrição, valor, tipo, categoria e data
- Remoção de transações
- Cálculo automático de saldo, receitas e despesas
- Barra de progresso da meta financeira
- Gráfico dinâmico de despesas por categoria
- Dica financeira aleatória
- Troca de tema entre claro, escuro e colorido
- Controle manual de streak de dias economizando
- Persistência local com `localStorage`

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript

## Como executar

Você pode abrir o arquivo `index.html` diretamente no navegador.

Para uma experiência melhor durante o desenvolvimento:

1. Abra a pasta no VS Code.
2. Instale a extensão `Live Server`.
3. Clique com o botão direito em `index.html`.
4. Escolha `Open with Live Server`.

## Estrutura do projeto

```text
Rastreador Financeiro/
├── css/
│   └── style.css
├── images/
├── js/
│   └── main.js
├── index.html
└── README.md
```

## Melhorias futuras

- Edição de transações
- Filtro por período
- Resumo mensal
- Metas financeiras personalizadas
- Exportação de dados

## Autor

Desenvolvido por `darknessplmr007-dot`.
