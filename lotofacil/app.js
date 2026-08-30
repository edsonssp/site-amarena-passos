// Lógica principal do aplicativo Lotofácil Inteligente

document.addEventListener("DOMContentLoaded", async () => {
  // Inicialização do Banco de Dados
  await window.LotofacilDB.init();
  
  // Variáveis de Estado
  let activeBetIndex = null; // Para saber qual aposta está sendo editada no modal
  let selectedModalDezenas = new Set(); // Dezenas selecionadas temporariamente no modal
  
  // Estado dos 18 jogos/apostas (carrega do localStorage ou inicia vazio)
  let bets = JSON.parse(localStorage.getItem("lotofacil_bets")) || [];
  while (bets.length < 18) {
    bets.push([]);
  }

  // Cache de Elementos DOM
  const tabs = document.querySelectorAll(".tab-btn");
  const tabViews = document.querySelectorAll(".tab-view");
  const dbStatusDot = document.getElementById("db-status-dot");
  const dbStatusText = document.getElementById("db-status-text");
  const btnSyncNow = document.getElementById("btn-sync-now");
  
  // Elementos do Dashboard
  const latestConcursoTitle = document.getElementById("latest-concurso-title");
  const latestConcursoDate = document.getElementById("latest-concurso-date");
  const latestDezenasContainer = document.getElementById("latest-dezenas-container");
  const statPares = document.getElementById("stat-pares");
  const statImpares = document.getElementById("stat-impares");
  const statPrimos = document.getElementById("stat-primos");
  const statSoma = document.getElementById("stat-soma");
  const cycleMissingContainer = document.getElementById("cycle-missing-container");
  const historyListContainer = document.getElementById("history-list-container");
  const searchDrawInput = document.getElementById("search-draw-input");

  // Elementos do Conferidor
  const betsRowsWrapper = document.getElementById("bets-rows-wrapper");
  const btnClearAllBets = document.getElementById("btn-clear-all-bets");
  const conferidorConcursoSelect = document.getElementById("conferidor-concurso-select");

  // Elementos de Análises
  const cooccurrenceSelect = document.getElementById("cooccurrence-select");
  const hypothesesWrapper = document.getElementById("hypotheses-wrapper");
  const correlatedListWrapper = document.getElementById("correlated-list-wrapper");
  const similarDrawsWrapper = document.getElementById("similar-draws-wrapper");

  // Elementos do Gerador
  const filterMinImpares = document.getElementById("filter-min-impares");
  const filterMaxImpares = document.getElementById("filter-max-impares");
  const filterMinPrimos = document.getElementById("filter-min-primos");
  const filterMaxPrimos = document.getElementById("filter-max-primos");
  const filterMinSoma = document.getElementById("filter-min-soma");
  const filterMaxSoma = document.getElementById("filter-max-soma");
  const filterMinRepetidos = document.getElementById("filter-min-repetidos");
  const filterMaxRepetidos = document.getElementById("filter-max-repetidos");
  const filterBlockPast = document.getElementById("filter-block-past");
  const btnGenerateGame = document.getElementById("btn-generate-game");
  const generatedGameCard = document.getElementById("generated-game-card");
  const generatedGameBalls = document.getElementById("generated-game-balls");
  const genStatImpares = document.getElementById("gen-stat-impares");
  const genStatPrimos = document.getElementById("gen-stat-primos");
  const genStatSoma = document.getElementById("gen-stat-soma");
  const genStatRepetidos = document.getElementById("gen-stat-repetidos");
  const selectBetTarget = document.getElementById("select-bet-target");
  const btnSendToBet = document.getElementById("btn-send-to-bet");
  const retrospectiveAnalysisCard = document.getElementById("retrospective-analysis-card");
  
  // Elementos do Modal
  const modalRegisterBet = document.getElementById("modal-register-bet");
  const modalGridDezenas = document.getElementById("modal-grid-dezenas");
  const modalSelectedCount = document.getElementById("modal-selected-count");
  const modalBtnClear = document.getElementById("modal-btn-clear");
  const modalBtnCancel = document.getElementById("modal-btn-cancel");
  const modalBtnSave = document.getElementById("modal-btn-save");

  // Elementos do Modal de Checagem Histórica
  const modalRetroCheck = document.getElementById("modal-retro-check");
  const retroStatusBlock = document.getElementById("retro-status-block");
  const modalRetro11 = document.getElementById("modal-retro-11");
  const modalRetro12 = document.getElementById("modal-retro-12");
  const modalRetro13 = document.getElementById("modal-retro-13");
  const modalRetro14 = document.getElementById("modal-retro-14");
  const modalRetro15 = document.getElementById("modal-retro-15");
  const modalRetroDetailsList = document.getElementById("modal-retro-details-list");
  const modalRetroLast10List = document.getElementById("modal-retro-last10-list");
  const modalRetroBtnClose = document.getElementById("modal-retro-btn-close");
  const filterBlockLast10 = document.getElementById("filter-block-last10");

  // Armazena o último jogo gerado temporariamente
  let lastGeneratedGame = null;

  /* ═══════════════════════════════════════════════════════════════════
     SISTEMA DE NAVEGAÇÃO DE ABAS
     ═══════════════════════════════════════════════════════════════════ */
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tabViews.forEach(v => v.classList.remove("active"));
      
      tab.classList.add("active");
      const targetView = document.getElementById(tab.dataset.tab);
      if (targetView) targetView.classList.add("active");
      
      // Gatilho para atualizar dados específicos da aba
      if (tab.dataset.tab === "tab-analises") {
        updateAnalysisTab();
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     BANCO DE DADOS & SINCRONIZAÇÃO
     ═══════════════════════════════════════════════════════════════════ */
  function updateDBStatus(message, type = "success") {
    dbStatusText.textContent = message;
    dbStatusDot.className = "status-dot";
    if (type === "syncing") {
      dbStatusDot.classList.add("syncing");
    } else if (type === "error") {
      dbStatusDot.style.backgroundColor = "var(--accent-danger)";
      dbStatusDot.style.boxShadow = "0 0 8px var(--accent-danger)";
    } else {
      dbStatusDot.style.backgroundColor = "var(--accent-success)";
      dbStatusDot.style.boxShadow = "0 0 8px var(--accent-success)";
    }
  }

  async function performSync() {
    updateDBStatus("Sincronizando...", "syncing");
    const success = await window.LotofacilDB.sync((msg) => {
      dbStatusText.textContent = msg;
    });
    if (success) {
      updateDBStatus(`Atualizado! ${window.LotofacilDB.draws.length} sorteios.`, "success");
      renderAll();
    } else {
      updateDBStatus("Erro ao sincronizar. Usando dados locais.", "error");
    }
  }

  btnSyncNow.addEventListener("click", performSync);

  // Inicialização e primeira sincronização automática
  updateDBStatus("Dados locais carregados.", "success");
  renderAll();
  performSync(); // Roda em segundo plano

  /* ═══════════════════════════════════════════════════════════════════
     RENDERIZADORES DA INTERFACE
     ═══════════════════════════════════════════════════════════════════ */
  function renderAll() {
    renderDashboard();
    populateConferidorConcursosSelect();
    renderBetsRows();
    populateDezenasSelects();
    updateAnalysisTab();
  }

  // ABA 1: RENDERIZA DASHBOARD
  function renderDashboard() {
    const latest = window.LotofacilDB.getLatestDraw();
    if (!latest) return;

    latestConcursoTitle.textContent = `Concurso ${latest.concurso}`;
    latestConcursoDate.textContent = `Data: ${latest.data}`;

    // Renderiza Bolas
    latestDezenasContainer.innerHTML = "";
    latest.dezenas.forEach(dez => {
      const ball = document.createElement("span");
      ball.className = "dezena-ball drawn";
      ball.textContent = dez;
      latestDezenasContainer.appendChild(ball);
    });

    // Estatísticas
    const stats = window.LotofacilDB.getStats(latest.dezenas);
    statPares.textContent = stats.pares;
    statImpares.textContent = stats.impares;
    statPrimos.textContent = stats.primos;
    statSoma.textContent = stats.soma;

    // Ciclo de dezenas
    renderCycleMissing();

    // Histórico de sorteios
    renderHistoryList(window.LotofacilDB.draws);
  }

  function renderCycleMissing() {
    cycleMissingContainer.innerHTML = "";
    
    // Algoritmo do ciclo
    const seen = new Set();
    const missing = new Set(Array.from({length: 25}, (_, i) => String(i+1).padStart(2, '0')));
    
    for (const draw of window.LotofacilDB.draws) {
      const tempSeen = new Set(seen);
      draw.dezenas.forEach(d => tempSeen.add(d));
      
      if (tempSeen.size === 25) {
        // Encontrou o limite do ciclo anterior
        break;
      }
      
      draw.dezenas.forEach(d => {
        seen.add(d);
        missing.delete(d);
      });
    }

    const missingArr = Array.from(missing).sort();

    if (missingArr.length === 0) {
      cycleMissingContainer.innerHTML = `<p style="font-size:0.9rem; color:var(--accent-success);"><i class="fa-solid fa-circle-check"></i> Ciclo fechado no último concurso! Novo ciclo iniciará no próximo sorteio.</p>`;
    } else {
      missingArr.forEach(dez => {
        const ball = document.createElement("span");
        ball.className = "dezena-ball";
        ball.style.borderColor = "var(--accent-secondary)";
        ball.style.color = "var(--accent-secondary)";
        ball.textContent = dez;
        cycleMissingContainer.appendChild(ball);
      });
    }
  }

  function renderHistoryList(drawsList) {
    historyListContainer.innerHTML = "";
    
    if (drawsList.length === 0) {
      historyListContainer.innerHTML = `<div class="text-center text-muted" style="padding:2rem;">Nenhum concurso encontrado.</div>`;
      return;
    }

    drawsList.slice(0, 50).forEach(draw => {
      const item = document.createElement("div");
      item.className = "history-item";
      
      const header = document.createElement("div");
      header.className = "history-item-header";
      header.innerHTML = `<span>Concurso ${draw.concurso}</span><span>${draw.data}</span>`;
      
      const dezenasWrapper = document.createElement("div");
      dezenasWrapper.className = "history-item-dezenas";
      
      draw.dezenas.forEach(d => {
        const ball = document.createElement("span");
        ball.className = "dezena-ball drawn";
        ball.textContent = d;
        dezenasWrapper.appendChild(ball);
      });

      item.appendChild(header);
      item.appendChild(dezenasWrapper);
      historyListContainer.appendChild(item);
    });
  }

  // Filtro de busca do histórico
  searchDrawInput.addEventListener("input", () => {
    const query = searchDrawInput.value.trim();
    if (!query) {
      renderHistoryList(window.LotofacilDB.draws);
      return;
    }

    const filtered = window.LotofacilDB.draws.filter(d => String(d.concurso).includes(query));
    renderHistoryList(filtered);
  });

  /* ═══════════════════════════════════════════════════════════════════
     ABA 2: CONFERIDOR DE APOSTAS (6 JOGOS)
     ═══════════════════════════════════════════════════════════════════ */
  function renderBetsRows() {
    betsRowsWrapper.innerHTML = "";
    const targetConcursoNum = parseInt(conferidorConcursoSelect.value);
    const targetDraw = window.LotofacilDB.getDrawByNumber(targetConcursoNum) || window.LotofacilDB.getLatestDraw();

    // Popula o select do gerador dinamicamente
    selectBetTarget.innerHTML = "";

    bets.forEach((bet, idx) => {
      // Adiciona opção no select
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `Enviar para Aposta ${idx + 1}`;
      selectBetTarget.appendChild(opt);

      const row = document.createElement("div");
      row.className = "bet-row";

      // Label do Cartão
      const label = document.createElement("div");
      label.className = "bet-label";
      label.textContent = `Aposta ${idx + 1}`;

      // Visualização de Dezenas
      const display = document.createElement("div");
      display.className = "bet-balls-display";

      let resultBadgeHtml = `<div class="bet-result-badge">-- acertos</div>`;

      if (!bet || bet.length === 0) {
        display.innerHTML = `<span style="font-size:0.85rem; color:var(--text-disabled); font-style:italic;">Sem dezenas cadastradas.</span>`;
      } else {
        // Se temos o sorteio alvo, podemos conferir
        let checkRes = null;
        if (targetDraw) {
          checkRes = window.LotofacilDB.checkBet(bet, targetDraw.dezenas);
        }

        bet.forEach(d => {
          const ball = document.createElement("span");
          ball.className = "dezena-ball";
          ball.textContent = d;
          
          if (checkRes) {
            if (checkRes.hits.includes(d)) {
              ball.classList.add("hit"); // Verde se acertou
            } else {
              ball.classList.add("miss"); // Opaco se errou
            }
          } else {
            ball.style.borderColor = "var(--accent-primary)";
          }
          display.appendChild(ball);
        });

        // Atualiza a badge de pontuação
        if (checkRes) {
          let winClass = "";
          if (checkRes.hitsCount >= 11) winClass = `win-${checkRes.hitsCount}`;
          resultBadgeHtml = `<div class="bet-result-badge ${winClass}">${checkRes.hitsCount} acertos</div>`;
        }
      }

      // Ações do Jogo
      const actions = document.createElement("div");
      actions.className = "bet-actions";
      
      const btnEdit = document.createElement("button");
      btnEdit.className = "btn btn-secondary btn-sm";
      btnEdit.innerHTML = `<i class="fa-solid fa-pen"></i> Editar`;
      btnEdit.addEventListener("click", () => openRegisterModal(idx));

      actions.appendChild(btnEdit);

      if (bet && bet.length > 0) {
        const btnAnalyze = document.createElement("button");
        btnAnalyze.className = "btn btn-secondary btn-sm";
        btnAnalyze.style.backgroundColor = "rgba(6, 182, 212, 0.15)";
        btnAnalyze.style.borderColor = "var(--accent-secondary)";
        btnAnalyze.style.color = "var(--accent-secondary)";
        btnAnalyze.innerHTML = `<i class="fa-solid fa-shield-halved"></i> Checar`;
        btnAnalyze.title = "Checar antiduplicidade histórica";
        btnAnalyze.addEventListener("click", () => openRetroCheckModal(bet, idx));
        actions.appendChild(btnAnalyze);

        const btnClear = document.createElement("button");
        btnClear.className = "btn btn-danger btn-sm";
        btnClear.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        btnClear.title = "Limpar jogo";
        btnClear.addEventListener("click", () => {
          bets[idx] = [];
          saveBets();
          renderBetsRows();
        });
        actions.appendChild(btnClear);
      }

      row.appendChild(label);
      row.appendChild(display);
      row.innerHTML += resultBadgeHtml;
      row.appendChild(actions);

      betsRowsWrapper.appendChild(row);
    });
  }

  function saveBets() {
    localStorage.setItem("lotofacil_bets", JSON.stringify(bets));
  }

  btnClearAllBets.addEventListener("click", () => {
    if (confirm("Tem certeza que deseja apagar os 18 cartões?")) {
      bets = Array(18).fill(null).map(() => []);
      saveBets();
      renderBetsRows();
    }
  });

  // Listener para mudar o concurso de checagem
  conferidorConcursoSelect.addEventListener("change", () => {
    renderBetsRows();
  });

  function populateConferidorConcursosSelect() {
    const selectedVal = conferidorConcursoSelect.value;
    conferidorConcursoSelect.innerHTML = "";
    
    window.LotofacilDB.draws.forEach((draw, index) => {
      const opt = document.createElement("option");
      opt.value = draw.concurso;
      opt.textContent = `Concurso ${draw.concurso} (${draw.data})${index === 0 ? " [Último]" : ""}`;
      conferidorConcursoSelect.appendChild(opt);
    });
    
    if (selectedVal && window.LotofacilDB.getDrawByNumber(selectedVal)) {
      conferidorConcursoSelect.value = selectedVal;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     MODAL DE SELEÇÃO DE DEZENAS (INTERFACE DO VOLANTE)
     ═══════════════════════════════════════════════════════════════════ */
  function openRegisterModal(idx) {
    activeBetIndex = idx;
    selectedModalDezenas = new Set(bets[idx] || []);
    
    renderModalGrid();
    updateModalCount();
    
    modalRegisterBet.style.display = "flex";
  }

  function renderModalGrid() {
    modalGridDezenas.innerHTML = "";
    for (let i = 1; i <= 25; i++) {
      const numStr = String(i).padStart(2, '0');
      const btn = document.createElement("button");
      btn.className = "dezena-btn";
      btn.textContent = numStr;
      
      if (selectedModalDezenas.has(numStr)) {
        btn.classList.add("selected");
      }

      btn.addEventListener("click", () => {
        if (selectedModalDezenas.has(numStr)) {
          selectedModalDezenas.delete(numStr);
          btn.classList.remove("selected");
        } else {
          if (selectedModalDezenas.size >= 20) {
            alert("Limite máximo de 20 dezenas por jogo excedido!");
            return;
          }
          selectedModalDezenas.add(numStr);
          btn.classList.add("selected");
        }
        updateModalCount();
      });

      modalGridDezenas.appendChild(btn);
    }
  }

  function updateModalCount() {
    modalSelectedCount.textContent = selectedModalDezenas.size;
    if (selectedModalDezenas.size >= 15 && selectedModalDezenas.size <= 20) {
      modalSelectedCount.style.color = "var(--accent-success)";
    } else {
      modalSelectedCount.style.color = "var(--accent-warning)";
    }
  }

  modalBtnClear.addEventListener("click", () => {
    selectedModalDezenas.clear();
    renderModalGrid();
    updateModalCount();
  });

  modalBtnCancel.addEventListener("click", () => {
    modalRegisterBet.style.display = "none";
  });

  modalBtnSave.addEventListener("click", () => {
    if (selectedModalDezenas.size < 15) {
      alert("Selecione pelo menos 15 dezenas para salvar o jogo!");
      return;
    }
    
    bets[activeBetIndex] = Array.from(selectedModalDezenas).sort();
    saveBets();
    renderBetsRows();
    modalRegisterBet.style.display = "none";
  });

  /* ═══════════════════════════════════════════════════════════════════
     MODAL DE CHECAGEM HISTÓRICA COMPLETA
     ═══════════════════════════════════════════════════════════════════ */
  function openRetroCheckModal(bet, idx) {
    if (!bet || bet.length === 0) return;
    
    const retro = window.LotofacilDB.checkRetrospective(bet);
    const alreadyDrawn = window.LotofacilDB.isAlreadyDrawn(bet);
    
    modalRetro11.textContent = retro[11];
    modalRetro12.textContent = retro[12];
    modalRetro13.textContent = retro[13];
    modalRetro14.textContent = retro[14];
    modalRetro15.textContent = retro[15];
    
    if (alreadyDrawn) {
      const matchDraw = window.LotofacilDB.draws.find(draw => {
        const drawStr = [...draw.dezenas].sort().join(",");
        const betStr = [...bet].sort().join(",");
        return drawStr === betStr;
      });
      
      retroStatusBlock.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
      retroStatusBlock.style.border = "1px solid var(--accent-danger)";
      retroStatusBlock.style.color = "var(--accent-danger)";
      retroStatusBlock.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ALERTA! Este jogo já foi sorteado no Concurso ${matchDraw ? matchDraw.concurso : "---"} (em ${matchDraw ? matchDraw.data : "--/--/----"}). Não jogue!`;
    } else {
      retroStatusBlock.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
      retroStatusBlock.style.border = "1px solid var(--accent-success)";
      retroStatusBlock.style.color = "var(--accent-success)";
      retroStatusBlock.innerHTML = `<i class="fa-solid fa-circle-check"></i> JOGO INÉDITO! Esta combinação de 15 dezenas nunca foi sorteada antes.`;
    }
    
    modalRetroDetailsList.innerHTML = "";
    const highHits = retro.history.filter(h => h.hitsCount >= 13);
    
    if (highHits.length === 0) {
      modalRetroDetailsList.innerHTML = `<div class="text-muted" style="text-align:center; padding:1rem 0;">Este jogo nunca atingiu 13 ou mais acertos.</div>`;
    } else {
      highHits.sort((a,b) => b.hitsCount - a.hitsCount).forEach(item => {
        const origDraw = window.LotofacilDB.getDrawByNumber(item.concurso);
        let missingText = "";
        
        if (origDraw && (item.hitsCount === 13 || item.hitsCount === 14)) {
          const missing = bet.filter(d => !origDraw.dezenas.includes(d));
          missingText = `<div style="font-size:0.75rem; color:var(--accent-danger); margin-top:0.2rem;">Não saíram: <strong>${missing.join(', ')}</strong></div>`;
        }

        const row = document.createElement("div");
        row.style.padding = "0.4rem 0";
        row.style.borderBottom = "1px solid rgba(255, 255, 255, 0.04)";
        
        let valColor = "var(--text-primary)";
        if (item.hitsCount === 15) valColor = "var(--accent-warning)";
        else if (item.hitsCount === 14) valColor = "var(--accent-secondary)";
        else if (item.hitsCount === 13) valColor = "var(--accent-success)";
        
        row.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span>Concurso ${item.concurso} (${item.data})</span>
            <span style="font-weight:700; color: ${valColor}">${item.hitsCount} acertos</span>
          </div>
          ${missingText}
        `;
        modalRetroDetailsList.appendChild(row);
      });
    }

    // Renderiza comparação detalhada com os 10 últimos sorteios
    modalRetroLast10List.innerHTML = "";
    const last10 = window.LotofacilDB.draws.slice(0, 10);
    let hasAlertLast10 = false;
    
    last10.forEach(draw => {
      const res = window.LotofacilDB.checkBet(bet, draw.dezenas);
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justify = "space-between";
      row.style.padding = "0.25rem 0";
      row.style.borderBottom = "1px solid rgba(255, 255, 255, 0.02)";
      
      let styleText = "";
      if (res.hitsCount > 13) {
        styleText = "color: var(--accent-danger); font-weight: 700;";
        hasAlertLast10 = true;
      } else if (res.hitsCount === 13) {
        styleText = "color: var(--accent-warning); font-weight: 600;";
      } else {
        styleText = "color: var(--text-muted);";
      }
      
      row.innerHTML = `
        <span>Concurso ${draw.concurso} (${draw.data})</span>
        <span style="${styleText}">${res.hitsCount} acertos</span>
      `;
      modalRetroLast10List.appendChild(row);
    });

    const alertDiv = document.createElement("div");
    alertDiv.style.marginTop = "0.75rem";
    alertDiv.style.fontWeight = "700";
    if (hasAlertLast10) {
      alertDiv.style.color = "var(--accent-danger)";
      alertDiv.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> CUIDADO! Este jogo repetiu 14 ou 15 dezenas com um concurso recente.`;
    } else {
      alertDiv.style.color = "var(--accent-success)";
      alertDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> SEGURO! Nenhuma repetição acima de 13 dezenas nos últimos 10 concursos.`;
    }
    modalRetroLast10List.appendChild(alertDiv);
    
    modalRetroCheck.style.display = "flex";
  }

  modalRetroBtnClose.addEventListener("click", () => {
    modalRetroCheck.style.display = "none";
  });

  /* ═══════════════════════════════════════════════════════════════════
     ABA 3: INTELIGÊNCIA & CORRELAÇÃO DE DEZENAS
     ═══════════════════════════════════════════════════════════════════ */
  function populateDezenasSelects() {
    cooccurrenceSelect.innerHTML = "";
    for (let i = 1; i <= 25; i++) {
      const numStr = String(i).padStart(2, '0');
      const opt = document.createElement("option");
      opt.value = numStr;
      opt.textContent = numStr;
      if (i === 11) opt.selected = true; // Valor padrão citado pelo usuário
      cooccurrenceSelect.appendChild(opt);
    }
  }

  function updateAnalysisTab() {
    const baseNum = cooccurrenceSelect.value;
    if (!baseNum || window.LotofacilDB.draws.length === 0) return;

    // 1. Analisa Co-ocorrência
    const data = window.LotofacilDB.analyzeCooccurrence(baseNum);
    
    // Renderiza Hipóteses
    hypothesesWrapper.innerHTML = "";
    if (data.hypotheses.length === 0) {
      hypothesesWrapper.innerHTML = `<p class="text-muted">Aguardando dados...</p>`;
    } else {
      data.hypotheses.forEach(hyp => {
        const div = document.createElement("div");
        div.className = "hypothesis-card";
        
        const title = document.createElement("div");
        title.className = "hypothesis-title";
        title.innerHTML = `<span>${hyp.nome}</span> <span class="confidence-badge">Frequência: ${hyp.confiancaMedia}%</span>`;
        
        const balls = document.createElement("div");
        balls.className = "dezenas-container";
        hyp.dezenas.forEach(d => {
          const ball = document.createElement("span");
          ball.className = "dezena-ball";
          ball.style.borderColor = "var(--accent-secondary)";
          ball.textContent = d;
          balls.appendChild(ball);
        });

        div.appendChild(title);
        div.appendChild(balls);
        hypothesesWrapper.appendChild(div);
      });
    }

    // Renderiza Lista de Afinidades (Progress bars)
    correlatedListWrapper.innerHTML = "";
    data.topCorrelated.forEach(item => {
      const row = document.createElement("div");
      row.className = "correlated-item";
      row.innerHTML = `
        <span class="dezena-ball" style="width:30px; height:30px; font-size:0.85rem; border-color:var(--accent-primary);">${item.dezena}</span>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${item.percentual}%"></div>
        </div>
        <span style="font-weight:700; color:var(--accent-secondary);">${item.percentual}%</span>
        <span style="color:var(--text-muted); font-size:0.75rem; margin-left: 0.5rem;">(${item.quantidade}x)</span>
      `;
      correlatedListWrapper.appendChild(row);
    });

    // 2. Concursos Similares
    renderSimilarDraws();
  }

  cooccurrenceSelect.addEventListener("change", updateAnalysisTab);

  function renderSimilarDraws() {
    similarDrawsWrapper.innerHTML = "";
    const matches = window.LotofacilDB.findSimilarDrawsToLast(12);

    if (matches.length === 0) {
      similarDrawsWrapper.innerHTML = `<div class="text-muted" style="padding:1rem 0;">Sem dados de comparação suficientes.</div>`;
      return;
    }

    matches.forEach(m => {
      const div = document.createElement("div");
      div.className = "history-item";
      
      const header = document.createElement("div");
      header.className = "history-item-header";
      header.innerHTML = `
        <span>Concurso ${m.concurso} (${m.hitsCount} acertos)</span>
        <span style="color:var(--accent-success);">${m.data}</span>
      `;
      
      const dezenasWrapper = document.createElement("div");
      dezenasWrapper.className = "history-item-dezenas";
      
      m.dezenas.forEach(d => {
        const ball = document.createElement("span");
        ball.className = "dezena-ball drawn";
        ball.textContent = d;
        dezenasWrapper.appendChild(ball);
      });

      // Diferenças (Gaps)
      const diffWrapper = document.createElement("div");
      diffWrapper.style.fontSize = "0.8rem";
      diffWrapper.style.marginTop = "0.4rem";
      diffWrapper.style.color = "var(--text-muted)";
      diffWrapper.innerHTML = `Diferenças p/ o último: ` + 
        m.differences.map(d => `<strong style="color:var(--accent-warning);">${d}</strong>`).join(", ");

      div.appendChild(header);
      div.appendChild(dezenasWrapper);
      div.appendChild(diffWrapper);
      similarDrawsWrapper.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     ABA 4: GERADOR INTELIGENTE DE JOGOS E RETROSPECTIVA
     ═══════════════════════════════════════════════════════════════════ */
  btnGenerateGame.addEventListener("click", () => {
    const config = {
      minImpares: parseInt(filterMinImpares.value),
      maxImpares: parseInt(filterMaxImpares.value),
      minPrimos: parseInt(filterMinPrimos.value),
      maxPrimos: parseInt(filterMaxPrimos.value),
      minSoma: parseInt(filterMinSoma.value),
      maxSoma: parseInt(filterMaxSoma.value),
      minRepetidos: parseInt(filterMinRepetidos.value),
      maxRepetidos: parseInt(filterMaxRepetidos.value),
      bloquearSorteados: filterBlockPast.checked,
      bloquearMaisDe13NosUltimos10: filterBlockLast10.checked
    };

    btnGenerateGame.disabled = true;
    btnGenerateGame.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Filtrando combinações...`;

    // Timeout rápido para simular pensamento/cálculo do app e não travar UI
    setTimeout(() => {
      const result = window.LotofacilDB.generateSmartGame(config);
      lastGeneratedGame = result.dezenas;

      // Exibe Cartão do Jogo Gerado
      generatedGameCard.style.display = "block";
      generatedGameBalls.innerHTML = "";
      
      result.dezenas.forEach(d => {
        const ball = document.createElement("span");
        ball.className = "dezena-ball hit";
        ball.textContent = d;
        generatedGameBalls.appendChild(ball);
      });

      genStatImpares.textContent = result.stats.impares;
      genStatPrimos.textContent = result.stats.primos;
      genStatSoma.textContent = result.stats.soma;
      genStatRepetidos.textContent = result.stats.repetidos;

      // Realiza Análise Retrospectiva
      const retro = window.LotofacilDB.checkRetrospective(result.dezenas);
      retrospectiveAnalysisCard.style.display = "block";
      
      document.getElementById("retro-11").textContent = retro[11];
      document.getElementById("retro-12").textContent = retro[12];
      document.getElementById("retro-13").textContent = retro[13];
      document.getElementById("retro-14").textContent = retro[14];
      document.getElementById("retro-15").textContent = retro[15];

      // Histórico de Premiações
      const listWrapper = document.getElementById("retro-history-list");
      listWrapper.innerHTML = "";
      if (retro.history.length === 0) {
        listWrapper.innerHTML = `<div class="text-muted">Este jogo nunca teria pontuado acima de 10 acertos.</div>`;
      } else {
        // Ordena mais valiosos primeiro
        retro.history.sort((a,b) => b.hitsCount - a.hitsCount).forEach(item => {
          const row = document.createElement("div");
          row.style.display = "flex";
          row.style.justify = "space-between";
          row.style.padding = "0.25rem 0";
          row.style.borderBottom = "1px solid rgba(255, 255, 255, 0.02)";
          
          let color = "var(--text-muted)";
          if (item.hitsCount === 15) color = "var(--accent-warning)";
          else if (item.hitsCount === 14) color = "var(--accent-secondary)";
          else if (item.hitsCount >= 11) color = "var(--accent-success)";

          row.innerHTML = `
            <span>Concurso ${item.concurso} (${item.data})</span>
            <span style="font-weight:700; color: ${color};">${item.hitsCount} acertos</span>
          `;
          listWrapper.appendChild(row);
        });
      }

      btnGenerateGame.disabled = false;
      btnGenerateGame.innerHTML = `<i class="fa-solid fa-cogs"></i> Gerar Jogo Assertivo`;
    }, 400);
  });

  // Enviar Jogo Gerado para uma das apostas
  btnSendToBet.addEventListener("click", () => {
    if (!lastGeneratedGame) return;
    const targetIdx = parseInt(selectBetTarget.value);
    bets[targetIdx] = [...lastGeneratedGame];
    saveBets();
    renderBetsRows();
    alert(`Jogo enviado com sucesso para a Aposta ${targetIdx + 1}!`);
  });

});
