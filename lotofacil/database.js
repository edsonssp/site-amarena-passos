// Gerenciador de Banco de Dados da Lotofácil e Algoritmos de Análise
const LOTOFACIL_API_URL = "https://loteriascaixa-api.herokuapp.com/api/lotofacil";

// Dados semente para o caso de estar offline no primeiro acesso
const SEED_DRAWS = [
  { concurso: 3155, data: "18/07/2026", dezenas: ["01", "02", "03", "05", "06", "08", "09", "10", "12", "15", "16", "17", "18", "21", "24"] },
  { concurso: 3154, data: "17/07/2026", dezenas: ["02", "04", "05", "07", "09", "11", "12", "14", "15", "16", "17", "20", "22", "23", "25"] },
  { concurso: 3153, data: "16/07/2026", dezenas: ["01", "03", "04", "06", "07", "08", "10", "11", "13", "14", "18", "19", "21", "22", "25"] },
  { concurso: 3152, data: "15/07/2026", dezenas: ["01", "02", "04", "06", "08", "09", "10", "12", "13", "14", "17", "19", "21", "23", "24"] },
  { concurso: 3151, data: "14/07/2026", dezenas: ["02", "03", "05", "06", "08", "09", "11", "13", "15", "16", "18", "20", "22", "24", "25"] },
  { concurso: 3150, data: "13/07/2026", dezenas: ["01", "02", "04", "05", "08", "10", "11", "12", "14", "16", "17", "19", "20", "23", "25"] },
  { concurso: 3149, data: "11/07/2026", dezenas: ["02", "03", "04", "06", "07", "09", "12", "13", "15", "17", "18", "21", "22", "24", "25"] },
  { concurso: 3148, data: "10/07/2026", dezenas: ["01", "03", "04", "05", "07", "08", "10", "12", "13", "15", "16", "19", "20", "22", "23"] },
  { concurso: 3147, data: "09/07/2026", dezenas: ["01", "02", "03", "05", "06", "08", "09", "11", "14", "15", "17", "18", "20", "21", "24"] },
  { concurso: 3146, data: "08/07/2026", dezenas: ["03", "04", "06", "07", "09", "10", "11", "12", "14", "16", "17", "19", "22", "23", "25"] }
];

class LotofacilDB {
  constructor() {
    this.draws = [];
    this.isLoaded = false;
  }

  // Inicializa o banco de dados carregando do localStorage ou usando a semente
  async init() {
    try {
      const stored = localStorage.getItem("lotofacil_draws");
      if (stored) {
        this.draws = JSON.parse(stored);
      } else {
        this.draws = SEED_DRAWS;
      }
      this.isLoaded = true;
    } catch (e) {
      console.error("Erro ao ler do localStorage, utilizando dados semente.", e);
      this.draws = SEED_DRAWS;
    }
  }

  // Sincroniza dados com a API pública
  async sync(onProgress = null) {
    try {
      if (onProgress) onProgress("Buscando resultados atualizados...");
      
      let baseDraws = [];
      
      // 1. Tenta carregar a lista geral da API Heroku (Desativando cache HTTP)
      try {
        const response = await fetch(LOTOFACIL_API_URL, { cache: "no-store" });
        if (response.ok) {
          const apiData = await response.json();
          if (Array.isArray(apiData)) {
            baseDraws = apiData.map(draw => {
              const dezenasRaw = draw.dezenas || draw.numbers || [];
              const dezenas = dezenasRaw
                .map(d => String(d).padStart(2, '0'))
                .sort((a, b) => parseInt(a) - parseInt(b));
              
              return {
                concurso: parseInt(draw.concurso || draw.contest),
                data: draw.data || draw.date || "",
                dezenas: dezenas
              };
            });
          }
        }
      } catch (err) {
        console.warn("API Heroku indisponível, tentando usar dados locais/semente.", err);
      }
      
      // Se falhar o download completo e já tivermos dados na memória, usamos eles como base
      if (baseDraws.length === 0) {
        baseDraws = [...this.draws];
      }
      
      // Ordena por concurso crescente para facilitar manipulação incremental
      baseDraws.sort((a, b) => a.concurso - b.concurso);
      
      let lastConcursoLocal = baseDraws.length > 0 ? baseDraws[baseDraws.length - 1].concurso : 0;
      
      // 2. Consulta o concurso mais recente absoluto diretamente do portal oficial da Caixa
      if (onProgress) onProgress("Checando se há sorteios mais recentes no portal da Caixa...");
      let targetLatestNum = 0;
      let latestDrawData = null;
      
      try {
        const caixaRes = await fetch("https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil", { cache: "no-store" });
        if (caixaRes.ok) {
          const caixaData = await caixaRes.json();
          targetLatestNum = parseInt(caixaData.numero);
          latestDrawData = {
            concurso: targetLatestNum,
            data: caixaData.dataApuracao || "",
            dezenas: (caixaData.listaDezenas || [])
              .map(d => String(d).padStart(2, '0'))
              .sort((a, b) => parseInt(a) - parseInt(b))
          };
        }
      } catch (caixaErr) {
        console.warn("Falha ao consultar API oficial da Caixa", caixaErr);
      }
      
      // Fallback: Tenta Heroku Latest se a Caixa falhar por instabilidade
      if (targetLatestNum === 0) {
        try {
          const latestRes = await fetch("https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest", { cache: "no-store" });
          if (latestRes.ok) {
            const latestData = await latestRes.json();
            targetLatestNum = parseInt(latestData.concurso || latestData.contest);
            const dezenasRaw = latestData.dezenas || latestData.numbers || [];
            latestDrawData = {
              concurso: targetLatestNum,
              data: latestData.data || latestData.date || "",
              dezenas: dezenasRaw
                .map(d => String(d).padStart(2, '0'))
                .sort((a, b) => parseInt(a) - parseInt(b))
            };
          }
        } catch (errLatest) {
          console.warn("Falha ao consultar Heroku Latest", errLatest);
        }
      }
      
      // 3. Se houver concursos novos (ou para garantir que buscamos o próximo mesmo se a API principal estiver com cache desatualizado)
      const maxTargetNum = Math.max(targetLatestNum, lastConcursoLocal + 1);
      if (maxTargetNum > lastConcursoLocal) {
        if (onProgress) onProgress("Sincronizando novos sorteios da Caixa...");
        
        for (let num = lastConcursoLocal + 1; num <= maxTargetNum; num++) {
          if (latestDrawData && num === latestDrawData.concurso) {
            baseDraws.push(latestDrawData);
            lastConcursoLocal = num;
          } else {
            // Busca concurso intermediário ou mais recente direto do portal oficial da Caixa
            try {
              const singleRes = await fetch(`https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/${num}`, { cache: "no-store" });
              if (singleRes.ok) {
                const singleData = await singleRes.json();
                if (singleData && singleData.listaDezenas && singleData.listaDezenas.length > 0) {
                  const dezenas = (singleData.listaDezenas || [])
                    .map(d => String(d).padStart(2, '0'))
                    .sort((a, b) => parseInt(a) - parseInt(b));
                  
                  baseDraws.push({
                    concurso: num,
                    data: singleData.dataApuracao || "",
                    dezenas: dezenas
                  });
                  lastConcursoLocal = num;
                }
              }
            } catch (singleErr) {
              console.error(`Falha ao buscar concurso oficial ${num}`, singleErr);
            }
          }
        }
      }
      
      // Ordena decrescente (mais recentes primeiro)
      baseDraws.sort((a, b) => b.concurso - a.concurso);
      
      if (baseDraws.length > 0) {
        this.draws = baseDraws;
        localStorage.setItem("lotofacil_draws", JSON.stringify(this.draws));
        if (onProgress) onProgress(`Sincronizado! ${this.draws.length} concursos carregados (Último: ${this.draws[0].concurso}).`);
        return true;
      }
      
      return false;
    } catch (e) {
      console.error("Falha ao sincronizar com a API.", e);
      if (onProgress) onProgress("Erro ao sincronizar. Operando com dados salvos localmente.");
      return false;
    }
  }

  // Retorna o último concurso
  getLatestDraw() {
    return this.draws[0] || null;
  }

  // Busca um concurso específico pelo número
  getDrawByNumber(num) {
    return this.draws.find(d => d.concurso === parseInt(num)) || null;
  }

  // Confere um jogo (array de dezenas) contra um concurso específico
  checkBet(bet, drawDezenas) {
    const betStr = bet.map(d => String(d).padStart(2, '0'));
    const hits = betStr.filter(d => drawDezenas.includes(d));
    return {
      hitsCount: hits.length,
      hits: hits,
      misses: betStr.filter(d => !drawDezenas.includes(d))
    };
  }

  // Confere um jogo contra TODO o histórico
  checkRetrospective(bet) {
    const summary = { 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, totalDraws: this.draws.length, history: [] };
    
    this.draws.forEach(draw => {
      const res = this.checkBet(bet, draw.dezenas);
      if (res.hitsCount >= 11) {
        summary[res.hitsCount]++;
        summary.history.push({
          concurso: draw.concurso,
          data: draw.data,
          hitsCount: res.hitsCount,
          hits: res.hits
        });
      }
    });

    return summary;
  }

  // Identifica os concursos que mais se aproximam do último sorteio (ex: compartilham 12+ dezenas)
  findSimilarDrawsToLast(minHits = 12) {
    const latest = this.getLatestDraw();
    if (!latest) return [];

    const matches = [];
    // Pula o primeiro (que é o próprio último)
    for (let i = 1; i < this.draws.length; i++) {
      const draw = this.draws[i];
      const res = this.checkBet(latest.dezenas, draw.dezenas);
      if (res.hitsCount >= minHits) {
        matches.push({
          concurso: draw.concurso,
          data: draw.data,
          hitsCount: res.hitsCount,
          dezenas: draw.dezenas,
          // Dezenas que estão no último sorteio mas NÃO estão neste concurso antigo (diferenças)
          differences: latest.dezenas.filter(d => !draw.dezenas.includes(d))
        });
      }
    }
    return matches.sort((a, b) => b.hitsCount - a.hitsCount).slice(0, 15);
  }

  // Analisa correlação condicional para uma dezena base (co-ocorrência)
  // Ex: Quando sai a dezena X, quais outras 4 saem juntas mais frequentemente?
  analyzeCooccurrence(baseNum) {
    const baseStr = String(baseNum).padStart(2, '0');
    const counts = {};
    
    // Inicializa contador para as dezenas 01-25 (exceto a base)
    for (let i = 1; i <= 25; i++) {
      const numStr = String(i).padStart(2, '0');
      if (numStr !== baseStr) counts[numStr] = 0;
    }

    let drawsWithBase = 0;

    this.draws.forEach(draw => {
      if (draw.dezenas.includes(baseStr)) {
        drawsWithBase++;
        draw.dezenas.forEach(d => {
          if (d !== baseStr) {
            counts[d] = (counts[d] || 0) + 1;
          }
        });
      }
    });

    if (drawsWithBase === 0) return { drawsWithBase: 0, hypotheses: [] };

    // Converte para array ordenado
    const sorted = Object.entries(counts)
      .map(([num, val]) => ({
        dezena: num,
        quantidade: val,
        percentual: ((val / drawsWithBase) * 100).toFixed(1)
      }))
      .sort((a, b) => b.quantidade - a.quantidade);

    // Cria 3 hipóteses (grupos de 4 dezenas altamente correlacionadas)
    const hypotheses = [
      {
        nome: "Alta Afinidade Primária",
        dezenas: sorted.slice(0, 4).map(x => x.dezena),
        confiancaMedia: (sorted.slice(0, 4).reduce((acc, curr) => acc + parseFloat(curr.percentual), 0) / 4).toFixed(1)
      },
      {
        nome: "Alta Afinidade Secundária",
        dezenas: sorted.slice(4, 8).map(x => x.dezena),
        confiancaMedia: (sorted.slice(4, 8).reduce((acc, curr) => acc + parseFloat(curr.percentual), 0) / 4).toFixed(1)
      },
      {
        nome: "Mix Estatístico Equilibrado",
        dezenas: [sorted[1].dezena, sorted[2].dezena, sorted[4].dezena, sorted[5].dezena],
        confiancaMedia: ((parseFloat(sorted[1].percentual) + parseFloat(sorted[2].percentual) + parseFloat(sorted[4].percentual) + parseFloat(sorted[5].percentual)) / 4).toFixed(1)
      }
    ];

    return {
      drawsWithBase: drawsWithBase,
      totalDrawsAnalyzed: this.draws.length,
      topCorrelated: sorted.slice(0, 8),
      hypotheses: hypotheses
    };
  }

  // Verifica as estatísticas fundamentais de um jogo
  getStats(dezenas) {
    const numList = dezenas.map(d => parseInt(d));
    const pares = numList.filter(n => n % 2 === 0).length;
    const impares = dezenas.length - pares;
    
    const primesList = [2, 3, 5, 7, 11, 13, 17, 19, 23];
    const primos = numList.filter(n => primesList.includes(n)).length;
    
    const soma = numList.reduce((acc, curr) => acc + curr, 0);
    
    // Repetidos do último concurso
    let repetidos = 0;
    const latest = this.getLatestDraw();
    if (latest) {
      repetidos = dezenas.filter(d => latest.dezenas.includes(d)).length;
    }

    return { pares, impares, primos, soma, repetidos };
  }

  // Verifica se uma combinação específica já foi sorteada
  isAlreadyDrawn(dezenas) {
    const betStr = dezenas.map(d => String(d).padStart(2, '0')).sort().join(",");
    return this.draws.some(draw => {
      const drawStr = [...draw.dezenas].sort().join(",");
      return drawStr === betStr;
    });
  }

  // Verifica se o jogo compartilha mais de 13 dezenas com qualquer um dos 10 últimos concursos
  sharesMoreThan13WithLast10(dezenas) {
    const last10 = this.draws.slice(0, 10);
    return last10.some(draw => {
      const res = this.checkBet(dezenas, draw.dezenas);
      return res.hitsCount > 13;
    });
  }

  // Gerador Inteligente de Jogos baseado em padrões probabilísticos e dados históricos
  generateSmartGame(config = {}) {
    const {
      minImpares = 7,
      maxImpares = 9,
      minPrimos = 5,
      maxPrimos = 6,
      minSoma = 180,
      maxSoma = 220,
      minRepetidos = 8,
      maxRepetidos = 10,
      bloquearSorteados = true,
      bloquearMaisDe13NosUltimos10 = true
    } = config;

    const latest = this.getLatestDraw();
    let attempts = 0;
    const maxAttempts = 5000;

    while (attempts < maxAttempts) {
      attempts++;
      const game = [];
      
      while (game.length < 15) {
        const r = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
        if (!game.includes(r)) {
          game.push(r);
        }
      }
      game.sort();

      const stats = this.getStats(game);

      if (stats.impares < minImpares || stats.impares > maxImpares) continue;
      if (stats.primos < minPrimos || stats.primos > maxPrimos) continue;
      if (stats.soma < minSoma || stats.soma > maxSoma) continue;
      
      if (latest) {
        if (stats.repetidos < minRepetidos || stats.repetidos > maxRepetidos) continue;
      }

      if (bloquearSorteados && this.isAlreadyDrawn(game)) continue;
      if (bloquearMaisDe13NosUltimos10 && this.sharesMoreThan13WithLast10(game)) continue;

      return {
        dezenas: game,
        stats: stats,
        attempts: attempts
      };
    }

    const fallbackGame = [];
    while (fallbackGame.length < 15) {
      const r = String(Math.floor(Math.random() * 25) + 1).padStart(2, '0');
      if (!fallbackGame.includes(r)) fallbackGame.push(r);
    }
    fallbackGame.sort();
    return {
      dezenas: fallbackGame,
      stats: this.getStats(fallbackGame),
      attempts: attempts,
      fallback: true
    };
  }
}

// Exporta para ser usado globalmente no navegador
window.LotofacilDB = new LotofacilDB();
