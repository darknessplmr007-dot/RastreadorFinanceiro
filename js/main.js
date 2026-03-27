// ============================================================
// PASSO 1: ESTADO DA APLICAÇÃO
// Guarda os dados principais e o tema selecionado.
// ============================================================

const STORAGE_KEY = 'rastreador-financeiro:v2';

const estado = {
  transacoes: [],
  saldo: 0,
  meta: 10000,
  streak: 7,
  tema: 'light',
};

const categoriasPorTipo = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Vendas', 'Outros'],
  expense: ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Educação', 'Contas', 'Outros'],
};

// ============================================================
// PASSO 2: DICAS FINANCEIRAS
// ============================================================

const dicas = [
  'Guarde pelo menos 20% da sua renda mensal!',
  'Evite compras por impulso: espere 24h antes de decidir.',
  'Crie uma reserva de emergência equivalente a 6 meses de gastos.',
  'Invista cedo: o tempo é seu maior aliado nos juros compostos.',
  'Anote tudo que você gasta. Consciência é o primeiro passo.',
  'Compare preços antes de comprar. Pequenas economias somam muito.',
  'Evite parcelar compras desnecessárias com juros.',
  'Defina metas financeiras claras e acompanhe seu progresso.',
];

// ============================================================
// PASSO 3: PEGAR OS ELEMENTOS DO HTML
// ============================================================

const elementos = {
  saldo: document.querySelector('.balance-amount'),
  receitas: document.getElementById('totalIncome'),
  despesas: document.getElementById('totalExpenses'),
  progresso: document.getElementById('goalProgress'),
  dica: document.getElementById('dailyTip'),
  streak: document.getElementById('streakDays'),
  streakText: document.getElementById('streakText'),
  lista: document.getElementById('transactionsList'),
  celebracao: document.getElementById('celebrationContainer'),
  status: document.querySelector('.status-indicator'),
  statusIcon: document.querySelector('.status-icon'),
  statusTexto: document.querySelector('.status-text'),
  form: document.getElementById('transactionForm'),
  descricaoInput: document.getElementById('descriptionInput'),
  valorInput: document.getElementById('amountInput'),
  tipoInput: document.getElementById('typeInput'),
  categoriaInput: document.getElementById('categoryInput'),
  dataInput: document.getElementById('dateInput'),
  chart: document.getElementById('expenseChart'),
  chartEmpty: document.getElementById('chartEmpty'),
  tipButton: document.querySelector('.tip-refresh'),
  heroButton: document.querySelector('section button'),
};

// ============================================================
// PASSO 4: UTILITÁRIOS
// ============================================================

function formatarDinheiro(numero) {
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarData(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function obterDataHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function criarIdTransacao() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function ordenarTransacoes(a, b) {
  if (a.data !== b.data) {
    return b.data.localeCompare(a.data);
  }

  return b.id.localeCompare(a.id);
}

function normalizarTransacao(transacao) {
  if (!transacao || typeof transacao !== 'object') {
    return null;
  }

  const descricao = typeof transacao.descricao === 'string' ? transacao.descricao.trim() : '';
  const valor = Number(transacao.valor);
  const tipo = transacao.tipo;
  const categoria = typeof transacao.categoria === 'string' && transacao.categoria.trim()
    ? transacao.categoria.trim()
    : 'Outros';
  const data = typeof transacao.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(transacao.data)
    ? transacao.data
    : obterDataHoje();

  if (!descricao || !Number.isFinite(valor) || valor <= 0) {
    return null;
  }

  if (tipo !== 'income' && tipo !== 'expense') {
    return null;
  }

  return {
    id: typeof transacao.id === 'string' ? transacao.id : criarIdTransacao(),
    descricao,
    valor,
    tipo,
    categoria,
    data,
  };
}

// ============================================================
// PASSO 5: PERSISTÊNCIA LOCAL
// Salva as informações principais no navegador.
// ============================================================

function salvarEstado() {
  try {
    const dados = {
      transacoes: estado.transacoes,
      streak: estado.streak,
      meta: estado.meta,
      tema: estado.tema,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  } catch (erro) {
    console.error('Não foi possível salvar os dados.', erro);
  }
}

function carregarEstado() {
  try {
    const dadosSalvos = localStorage.getItem(STORAGE_KEY);

    if (!dadosSalvos) {
      return;
    }

    const dados = JSON.parse(dadosSalvos);

    if (Array.isArray(dados.transacoes)) {
      estado.transacoes = dados.transacoes
        .map(normalizarTransacao)
        .filter(Boolean);
    }

    if (Number.isFinite(dados.streak) && dados.streak >= 0) {
      estado.streak = dados.streak;
    }

    if (Number.isFinite(dados.meta) && dados.meta > 0) {
      estado.meta = dados.meta;
    }

    if (typeof dados.tema === 'string' && dados.tema in temas) {
      estado.tema = dados.tema;
    }
  } catch (erro) {
    console.error('Não foi possível carregar os dados salvos.', erro);
  }
}

// ============================================================
// PASSO 6: TEMAS
// ============================================================

const temas = {
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8f9fa',
    '--bg-tertiary': '#e9ecef',
    '--text-primary': '#2c3e50',
    '--text-secondary': '#6c757d',
    '--primary-color': '#3498db',
    '--secondary-color': '#2ecc71',
  },
  dark: {
    '--bg-primary': '#1e1e2e',
    '--bg-secondary': '#181825',
    '--bg-tertiary': '#313244',
    '--text-primary': '#cdd6f4',
    '--text-secondary': '#a6adc8',
    '--primary-color': '#89b4fa',
    '--secondary-color': '#a6e3a1',
  },
  colorful: {
    '--bg-primary': '#fff0f6',
    '--bg-secondary': '#f3f0ff',
    '--bg-tertiary': '#e0c3fc',
    '--text-primary': '#4a0072',
    '--text-secondary': '#7b2ff7',
    '--primary-color': '#f72585',
    '--secondary-color': '#7209b7',
  },
};

function mudarTema(nomeTema, deveSalvar = true) {
  const tema = temas[nomeTema];

  if (!tema) {
    return;
  }

  Object.keys(tema).forEach(function(variavel) {
    document.documentElement.style.setProperty(variavel, tema[variavel]);
  });

  document.querySelectorAll('.theme-btn').forEach(function(botao) {
    botao.classList.remove('active');
  });

  const botaoAtivo = document.querySelector(`[data-theme="${nomeTema}"]`);
  if (botaoAtivo) {
    botaoAtivo.classList.add('active');
  }

  estado.tema = nomeTema;

  if (deveSalvar) {
    salvarEstado();
  }
}

// ============================================================
// PASSO 7: FORMULÁRIO E CATEGORIAS
// ============================================================

function atualizarCategorias(categoriaSelecionada = '') {
  const tipo = elementos.tipoInput.value;
  const categorias = categoriasPorTipo[tipo] || [];
  const categoriaAtual = categoriaSelecionada || elementos.categoriaInput.value;

  elementos.categoriaInput.innerHTML = '';

  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = tipo ? 'Selecione a categoria' : 'Selecione o tipo primeiro';
  elementos.categoriaInput.appendChild(placeholder);

  categorias.forEach(function(categoria) {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    elementos.categoriaInput.appendChild(option);
  });

  elementos.categoriaInput.disabled = categorias.length === 0;

  if (categorias.includes(categoriaAtual)) {
    elementos.categoriaInput.value = categoriaAtual;
  } else {
    elementos.categoriaInput.value = '';
  }
}

function criarTransacao() {
  const descricao = elementos.descricaoInput.value.trim();
  const valor = Number(elementos.valorInput.value);
  const tipo = elementos.tipoInput.value;
  const categoria = elementos.categoriaInput.value;
  const data = elementos.dataInput.value;

  if (!descricao || !Number.isFinite(valor) || valor <= 0 || !tipo || !categoria || !data) {
    animacaoErro(elementos.form);
    return null;
  }

  return {
    id: criarIdTransacao(),
    descricao,
    valor,
    tipo,
    categoria,
    data,
  };
}

function limparFormulario() {
  elementos.form.reset();
  elementos.dataInput.value = obterDataHoje();
  atualizarCategorias();
  elementos.descricaoInput.focus();
}

// ============================================================
// PASSO 8: ATUALIZAR O ESTADO VISUAL
// ============================================================

function atualizarTela() {
  const totalReceitas = estado.transacoes
    .filter(t => t.tipo === 'income')
    .reduce((soma, t) => soma + t.valor, 0);

  const totalDespesas = estado.transacoes
    .filter(t => t.tipo === 'expense')
    .reduce((soma, t) => soma + t.valor, 0);

  estado.saldo = totalReceitas - totalDespesas;

  elementos.receitas.textContent = formatarDinheiro(totalReceitas);
  elementos.despesas.textContent = formatarDinheiro(totalDespesas);
  elementos.saldo.textContent = formatarDinheiro(estado.saldo);
  elementos.streak.textContent = estado.streak;
  elementos.streakText.textContent = estado.streak === 1 ? 'dia economizando!' : 'dias economizando!';

  elementos.saldo.style.color = estado.saldo >= 0 ? '#2ecc71' : '#e74c3c';

  const porcentagemMeta = Math.min((totalReceitas / estado.meta) * 100, 100);
  elementos.progresso.style.width = `${porcentagemMeta}%`;

  atualizarStatus(estado.saldo);
  renderizarTransacoes();
  renderizarGrafico();
}

function atualizarStatus(saldo) {
  if (estado.transacoes.length === 0) {
    elementos.status.setAttribute('data-status', 'positive');
    elementos.statusIcon.textContent = '🧾';
    elementos.statusTexto.textContent = 'Adicione sua primeira transação para começar.';
    return;
  }

  if (saldo >= 0) {
    elementos.status.setAttribute('data-status', 'positive');
    elementos.statusIcon.textContent = '📈';
    elementos.statusTexto.textContent = 'Suas finanças estão em alta!';
  } else {
    elementos.status.setAttribute('data-status', 'negative');
    elementos.statusIcon.textContent = '📉';
    elementos.statusTexto.textContent = 'Atenção: seu saldo está negativo!';
  }
}

// ============================================================
// PASSO 9: LISTA DE TRANSAÇÕES
// ============================================================

function renderizarTransacoes() {
  elementos.lista.innerHTML = '';

  if (estado.transacoes.length === 0) {
    const mensagemVazia = document.createElement('p');
    mensagemVazia.className = 'transactions-empty';
    mensagemVazia.textContent = 'Nenhuma transação ainda. Adicione a primeira acima.';
    elementos.lista.appendChild(mensagemVazia);
    return;
  }

  const transacoesOrdenadas = [...estado.transacoes].sort(ordenarTransacoes);

  transacoesOrdenadas.forEach(function(transacao) {
    const item = document.createElement('article');
    item.className = `transaction-item transaction-item--${transacao.tipo}`;

    const corpo = document.createElement('div');
    corpo.className = 'transaction-main';

    const icone = document.createElement('span');
    icone.className = 'transaction-icon';
    icone.textContent = transacao.tipo === 'income' ? '💰' : '💸';

    const conteudo = document.createElement('div');
    conteudo.className = 'transaction-content';

    const linhaPrincipal = document.createElement('div');
    linhaPrincipal.className = 'transaction-topline';

    const descricao = document.createElement('strong');
    descricao.className = 'transaction-description';
    descricao.textContent = transacao.descricao;

    const valor = document.createElement('span');
    valor.className = `transaction-value transaction-value--${transacao.tipo}`;
    valor.textContent = `${transacao.tipo === 'income' ? '+' : '-'} ${formatarDinheiro(transacao.valor)}`;

    linhaPrincipal.appendChild(descricao);
    linhaPrincipal.appendChild(valor);

    const metadados = document.createElement('div');
    metadados.className = 'transaction-meta';

    const categoria = document.createElement('span');
    categoria.className = 'transaction-tag';
    categoria.textContent = transacao.categoria;

    const data = document.createElement('span');
    data.className = 'transaction-date';
    data.textContent = formatarData(transacao.data);

    metadados.appendChild(categoria);
    metadados.appendChild(data);

    conteudo.appendChild(linhaPrincipal);
    conteudo.appendChild(metadados);

    corpo.appendChild(icone);
    corpo.appendChild(conteudo);

    const botaoRemover = document.createElement('button');
    botaoRemover.type = 'button';
    botaoRemover.className = 'transaction-remove';
    botaoRemover.dataset.id = transacao.id;
    botaoRemover.setAttribute('aria-label', `Remover transação ${transacao.descricao}`);
    botaoRemover.textContent = 'Remover';

    item.appendChild(corpo);
    item.appendChild(botaoRemover);

    elementos.lista.appendChild(item);
  });
}

function removerTransacao(id) {
  estado.transacoes = estado.transacoes.filter(t => t.id !== id);
  salvarEstado();
  atualizarTela();
}

// ============================================================
// PASSO 10: GRÁFICO DINÂMICO DE DESPESAS
// ============================================================

function renderizarGrafico() {
  elementos.chart.innerHTML = '';

  const despesasPorCategoria = estado.transacoes
    .filter(t => t.tipo === 'expense')
    .reduce(function(acumulador, transacao) {
      const categoria = transacao.categoria || 'Outros';
      acumulador[categoria] = (acumulador[categoria] || 0) + transacao.valor;
      return acumulador;
    }, {});

  const categorias = Object.entries(despesasPorCategoria)
    .sort(function(a, b) {
      return b[1] - a[1];
    });

  if (categorias.length === 0) {
    elementos.chartEmpty.hidden = false;
    return;
  }

  elementos.chartEmpty.hidden = true;

  const maiorValor = categorias[0][1];

  categorias.forEach(function([categoria, valor]) {
    const coluna = document.createElement('div');
    coluna.className = 'chart-column';

    const barra = document.createElement('div');
    barra.className = 'chart-bar';
    barra.style.height = `${Math.max((valor / maiorValor) * 100, 18)}%`;
    barra.title = `${categoria}: ${formatarDinheiro(valor)}`;

    const label = document.createElement('span');
    label.className = 'bar-label';
    label.textContent = formatarDinheiro(valor);

    const legenda = document.createElement('span');
    legenda.className = 'chart-category';
    legenda.textContent = categoria;

    barra.appendChild(label);
    coluna.appendChild(barra);
    coluna.appendChild(legenda);
    elementos.chart.appendChild(coluna);
  });
}

// ============================================================
// PASSO 11: DICA DO DIA
// ============================================================

function getNewTip() {
  const indiceAleatorio = Math.floor(Math.random() * dicas.length);
  const novaDica = dicas[indiceAleatorio];

  elementos.dica.style.transition = 'all 0.3s ease';
  elementos.dica.style.opacity = '0';
  elementos.dica.style.transform = 'translateY(-10px)';

  setTimeout(function() {
    elementos.dica.textContent = novaDica;
    elementos.dica.style.opacity = '1';
    elementos.dica.style.transform = 'translateY(0)';
  }, 300);
}

// ============================================================
// PASSO 12: ANIMAÇÕES
// ============================================================

function animacaoCard(elemento) {
  elemento.style.transition = 'transform 0.15s ease';
  elemento.style.transform = 'scale(1.2)';

  setTimeout(function() {
    elemento.style.transform = 'scale(1)';
  }, 150);
}

function animacaoErro(elemento) {
  elemento.style.animation = 'none';
  void elemento.offsetWidth;
  elemento.style.animation = 'shake 0.4s ease';
}

const estilosAnimacao = document.createElement('style');
estilosAnimacao.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-8px); }
    80% { transform: translateX(8px); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;
document.head.appendChild(estilosAnimacao);

function celebrar() {
  elementos.celebracao.classList.add('active');

  setTimeout(function() {
    elementos.celebracao.classList.remove('active');
  }, 4000);
}

function animarStreak() {
  elementos.streak.style.transition = 'transform 0.3s ease';
  elementos.streak.style.transform = 'scale(1.5)';

  setTimeout(function() {
    elementos.streak.style.transform = 'scale(1)';
  }, 300);
}

function atualizarStreak(valor) {
  estado.streak = Math.max(0, valor);
  salvarEstado();
  atualizarTela();
  animarStreak();
}

function incrementarStreak() {
  atualizarStreak(estado.streak + 1);
}

function diminuirStreak() {
  atualizarStreak(estado.streak - 1);
}

function resetarStreak() {
  atualizarStreak(0);
}

function lidarAcaoDoStreak(event) {
  const botao = event.target.closest('[data-streak-action]');

  if (!botao) {
    return;
  }

  const acao = botao.dataset.streakAction;

  if (acao === 'increase') {
    incrementarStreak();
    return;
  }

  if (acao === 'decrease') {
    diminuirStreak();
    return;
  }

  if (acao === 'reset') {
    resetarStreak();
  }
}

// ============================================================
// PASSO 13: AÇÕES PRINCIPAIS
// ============================================================

function adicionarTransacao(event) {
  event.preventDefault();

  const novaTransacao = criarTransacao();

  if (!novaTransacao) {
    return;
  }

  estado.transacoes.push(novaTransacao);
  salvarEstado();
  atualizarTela();

  if (novaTransacao.tipo === 'income') {
    animacaoCard(elementos.receitas);

    const totalReceitas = estado.transacoes
      .filter(t => t.tipo === 'income')
      .reduce((soma, t) => soma + t.valor, 0);

    if (totalReceitas >= estado.meta) {
      celebrar();
    }
  } else {
    animacaoCard(elementos.despesas);
  }

  limparFormulario();
}

function lidarCliqueNaLista(event) {
  const botaoRemover = event.target.closest('.transaction-remove');

  if (!botaoRemover) {
    return;
  }

  removerTransacao(botaoRemover.dataset.id);
}

// ============================================================
// PASSO 14: INICIALIZAR O SITE
// ============================================================

function inicializar() {
  carregarEstado();

  elementos.dataInput.value = obterDataHoje();
  atualizarCategorias();
  mudarTema(estado.tema, false);
  atualizarTela();

  elementos.form.addEventListener('submit', adicionarTransacao);
  elementos.lista.addEventListener('click', lidarCliqueNaLista);

  document.querySelectorAll('.theme-btn').forEach(function(botao) {
    botao.addEventListener('click', function() {
      mudarTema(botao.getAttribute('data-theme'));
    });
  });

  elementos.tipoInput.addEventListener('change', function() {
    atualizarCategorias();
  });

  elementos.tipButton.addEventListener('click', getNewTip);

  const streakActions = document.querySelector('.streak-actions');
  if (streakActions) {
    streakActions.addEventListener('click', lidarAcaoDoStreak);
  }

  if (elementos.heroButton) {
    elementos.heroButton.addEventListener('click', function() {
      document.querySelector('.transactions-form').scrollIntoView({
        behavior: 'smooth',
      });
    });
  }

  document.querySelectorAll('.floating-card').forEach(function(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(function() {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * (index + 1));
  });
}

// ============================================================
// INÍCIO
// ============================================================

document.addEventListener('DOMContentLoaded', inicializar);
