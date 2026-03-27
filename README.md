# Rastreador Financeiro

Aplicação web para acompanhar receitas e despesas, visualizar saldo atual e organizar a vida financeira com uma interface simples, responsiva e interativa.

## Acesse online

Quando o GitHub Pages estiver ativo no repositório, o site ficará disponível em:

[https://darknessplmr007-dot.github.io/RastreadorFinanceiro/](https://darknessplmr007-dot.github.io/RastreadorFinanceiro/)

## Destaques do projeto

- Cadastro de transações com descrição, valor, tipo, categoria e data
- Cálculo automático de saldo, receitas e despesas
- Gráfico dinâmico de gastos por categoria
- Persistência local com `localStorage`
- Temas claro, escuro e colorido
- Dica financeira aleatória
- Controle manual do streak de dias economizando
- Layout responsivo para desktop e mobile

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript
- GitHub Pages
- GitHub Actions

## Como executar localmente

### Opção 1: abrir direto no navegador

Abra o arquivo `index.html` no navegador.

### Opção 2: usar Live Server no VS Code

1. Abra a pasta no VS Code.
2. Instale a extensão `Live Server`.
3. Clique com o botão direito em `index.html`.
4. Escolha `Open with Live Server`.

## Estrutura do projeto

```text
Rastreador Financeiro/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── css/
│   └── style.css
├── images/
├── js/
│   └── main.js
├── index.html
└── README.md
```

## Deploy com GitHub Pages

O projeto foi preparado para publicação automática no GitHub Pages usando GitHub Actions.

Sempre que houver push no branch `main`, o workflow de deploy será executado para publicar o site.

Se o Pages ainda não abrir imediatamente, confira no repositório:

`Settings > Pages > Build and deployment > Source: GitHub Actions`

## Funcionalidades atuais

- Adicionar transações
- Remover transações
- Salvar dados no navegador
- Atualizar cards financeiros automaticamente
- Exibir status financeiro com base no saldo
- Renderizar gráfico de despesas por categoria
- Trocar tema da interface
- Controlar o streak manualmente com aumentar, diminuir e resetar

## Melhorias futuras

- Edição de transações
- Filtro por período
- Resumo mensal
- Metas financeiras personalizadas
- Exportação de dados

## Autor

Desenvolvido por `darknessplmr007-dot`.
