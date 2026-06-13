// =====================================================================
// CARDÁPIO AMARENA SORVETES — Dados Premium com Imagens Reais
// Textos persuasivos de alto nível para máxima percepção de valor
// =====================================================================
const defaultMenu = [
  // ═══════════════════════════════════════════════════════════════════
  // SORVETES PREMIUM
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "pistache-premium",
    nome: "Pistache Siciliano",
    descricao: "Eleito o favorito da casa. Gelato artesanal de pistache torrado importado da Sicília, com textura aveludada e sabor intenso que derrete na boca.",
    preco: 16.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/pistache.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "brigadeiro-gourmet",
    nome: "Brigadeiro Gourmet",
    descricao: "A receita que conquistou milhares de paladares. Chocolate nobre 60% cacau combinado com leite condensado artesanal e granulado belga crocante.",
    preco: 14.50,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/brigadeiro.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "morango-ninho",
    nome: "Morango com Ninho",
    descricao: "Um clássico irresistível. Morangos frescos selecionados envolvidos em creme de leite Ninho artesanal. Pura nostalgia em cada colherada.",
    preco: 14.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/morango_ninho.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "cookies-cream",
    nome: "Cookies & Cream",
    descricao: "Pedaços generosos de cookies artesanais em um gelato de baunilha bourbon premium. Crocância perfeita a cada mordida.",
    preco: 14.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/cookies.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "chocomaltine",
    nome: "Chocomaltine",
    descricao: "O sabor que marcou gerações. Ovomaltine crocante mesclado em gelato de chocolate ao leite premium. Impossível resistir.",
    preco: 13.50,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/chocomaltine.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "doce-de-leite",
    nome: "Doce de Leite Artesanal",
    descricao: "Feito com doce de leite cozido por horas em tacho de cobre. Cremosidade incomparável e sabor autêntico que remete ao interior.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/doce_de_leite.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "coco-queimado",
    nome: "Coco Queimado",
    descricao: "Coco fresco tostado artesanalmente até atingir a caramelização perfeita. Sabor tropical com toque sofisticado e textura cremosa.",
    preco: 12.50,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/coco_queimado.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "flocos",
    nome: "Flocos Premium",
    descricao: "Delicados flocos de chocolate artesanal em um gelato de leite fresco. Simplicidade que encanta pelo sabor puro e autêntico.",
    preco: 12.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/flocos_certo.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "chocomenta",
    nome: "Chocomenta",
    descricao: "A fusão perfeita: chocolate meio amargo com essência natural de menta fresca. Refrescância e indulgência em harmonia.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/chocomenta.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "acai-trufado",
    nome: "Açaí Trufado",
    descricao: "Açaí premium da Amazônia com veios generosos de trufa de chocolate belga. Superalimento com sabor irresistível.",
    preco: 15.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/acai_trufado.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "leitinho-trufado",
    nome: "Leitinho Trufado",
    descricao: "Gelato suave de leite artesanal com fitas generosas de trufa de chocolate. Cremosidade que surpreende a cada colherada.",
    preco: 13.50,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/leitinho_trufado.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "sorvete-chocolate",
    nome: "Chocolate Intenso",
    descricao: "Para os verdadeiros amantes de chocolate. Cacau nobre em alta concentração, textura densa e sabor profundamente marcante.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/sorvete_chocolate.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "coco-branco",
    nome: "Coco Branco Cremoso",
    descricao: "Leite de coco fresco batido em gelato aveludado. Sabor tropical suave com textura que derrete delicadamente.",
    preco: 12.50,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/coco_branco.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "leite-condensado",
    nome: "Leite Condensado",
    descricao: "O sabor da infância em sua forma mais nobre. Leite condensado caramelizado transformado em gelato ultra cremoso.",
    preco: 12.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/leite_condensado.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "goiaba",
    nome: "Goiaba da Roça",
    descricao: "Goiabas vermelhas maduras colhidas no ponto perfeito. Sabor frutado intenso com textura naturalmente cremosa.",
    preco: 11.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/goiaba.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "torta-de-limao",
    nome: "Torta de Limão",
    descricao: "Inspirado na clássica sobremesa francesa. Creme de limão siciliano com farofa amanteigada e toque de merengue.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/torta_de_limao.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "queijo-goiabada",
    nome: "Queijo com Goiabada",
    descricao: "O famoso Romeu & Julieta em versão gelato. Creme de queijo minas com pedaços de goiabada cascão derretida.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "assets/images/drawable/queijo_com_goiabada.jpg",
    disponivel: true,
    destaque: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // PICOLÉS DE FRUTAS — Refrescância Natural
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "picole-melancia",
    nome: "Picolé de Melancia",
    descricao: "Frutas frescas congeladas no ponto ideal. Refrescância pura e natural, sem conservantes. Verão o ano inteiro.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/melancia.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-tangerina",
    nome: "Picolé de Tangerina",
    descricao: "Tangerinas maduras e suculentas transformadas em picolé artesanal. Cítrico natural que revigora.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/tangerina.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-limao-fruta",
    nome: "Picolé de Limão",
    descricao: "Limões tahiti frescos em um picolé intensamente refrescante. Acidez equilibrada e sabor que acorda os sentidos.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/limao_fruta.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-uva",
    nome: "Picolé de Uva",
    descricao: "Uvas selecionadas em sua forma mais refrescante. Doçura natural sem adição de açúcar artificial.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/Picolé_de_uva.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-kiwi",
    nome: "Picolé de Kiwi",
    descricao: "Kiwi maduro com acidez equilibrada e refrescância tropical. Rico em vitamina C e sabor exótico.",
    preco: 5.50,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/picole_de_kiwi.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-groselha",
    nome: "Picolé de Groselha",
    descricao: "Sabor nostálgico da groselha em picolé artesanal. Cor vibrante e doçura que remete à infância.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/Picole_de_groselha.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-abacaxi-fruta",
    nome: "Picolé de Abacaxi",
    descricao: "Abacaxi pérola fresco em picolé tropical. Fibras naturais e sabor doce-ácido perfeitamente balanceado.",
    preco: 5.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-frutas/Picolé_Abacaxi_fruta.jpg",
    disponivel: true,
    destaque: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // PICOLÉS CREMOSOS — Indulgência no Palito
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "picole-chocolate",
    nome: "Picolé de Chocolate Cremoso",
    descricao: "Chocolate nobre em picolé ultra cremoso. Cobertura crocante que se parte revelando pura indulgência.",
    preco: 7.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/Amarena-Picole_Chocolate.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "picole-morango-cremoso",
    nome: "Picolé de Morango Cremoso",
    descricao: "Morango fresco em base cremosa de leite. O equilíbrio perfeito entre frutado e aveludado.",
    preco: 7.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/Amarena-Picole_Morango.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-abacaxi-suico",
    nome: "Picolé Abacaxi Suíço",
    descricao: "Abacaxi com creme suíço em combinação exclusiva. Cremosidade europeia com frescor tropical brasileiro.",
    preco: 7.50,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/Amarena-Picole_AbacaxiSuico.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-mousse-maracuja",
    nome: "Picolé Mousse de Maracujá",
    descricao: "Mousse leve de maracujá congelada no palito. Textura aerada e sabor cítrico que dança no paladar.",
    preco: 7.50,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/Amarena_Picole_Mousse_Maracuja.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-coco-queimado",
    nome: "Picolé Coco Queimado",
    descricao: "Coco tostado artesanalmente em picolé cremoso premium. Sabor caramelizado que vicia.",
    preco: 7.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/coco_queimado.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-limao-suico",
    nome: "Picolé Limão Suíço",
    descricao: "Creme suíço com limão siciliano em picolé sofisticado. Refrescância com cremosidade de primeiro mundo.",
    preco: 7.50,
    categoria: "Picolés",
    imagem: "assets/images/picole-leite/limao_suico.jpg",
    disponivel: true,
    destaque: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // PICOLÉS ESPECIAIS — Experiências Únicas
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "picole-brigadeiro",
    nome: "Picolé de Brigadeiro",
    descricao: "Todo o sabor do brigadeiro gourmet em formato picolé. Chocolate intenso com granulado belga crocante.",
    preco: 8.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-especial/brigadeiro.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "picole-pistache",
    nome: "Picolé de Pistache",
    descricao: "Pistache siciliano em picolé cremoso premium. O mesmo sabor do nosso campeão de vendas, agora no palito.",
    preco: 9.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-especial/pistache.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "picole-chocomenta",
    nome: "Picolé Chocomenta",
    descricao: "Chocolate premium com menta natural em picolé refrescante. A combinação clássica em sua melhor versão.",
    preco: 8.00,
    categoria: "Picolés",
    imagem: "assets/images/picole-especial/chocomenta.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "picole-skimo",
    nome: "Picolé Skimo",
    descricao: "Nosso picolé exclusivo com camadas alternadas de sabores surpreendentes. Uma aventura a cada mordida.",
    preco: 7.50,
    categoria: "Picolés",
    imagem: "assets/images/picole-especial/skimo.jpg",
    disponivel: true,
    destaque: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // MINI PALETAS — Porções de Felicidade
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "mini-paleta-morango",
    nome: "Mini Paleta Morango com Ninho",
    descricao: "Paleta artesanal de morango recheada com creme de leite Ninho. Porção perfeita de pura indulgência.",
    preco: 9.50,
    categoria: "Picolés",
    imagem: "assets/images/mine-paleta/morango_ninho.jpg",
    disponivel: true,
    destaque: true
  },
  {
    id: "mini-paleta-cookies",
    nome: "Mini Paleta Cookies",
    descricao: "Cookies artesanais em paleta cremosa premium. Crocância e cremosidade em perfeita harmonia.",
    preco: 9.50,
    categoria: "Picolés",
    imagem: "assets/images/mine-paleta/cookies.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "mini-paleta-acai",
    nome: "Mini Paleta Açaí Trufado",
    descricao: "Açaí da Amazônia com trufa de chocolate em paleta mexicana. Superfood encontra indulgência.",
    preco: 10.00,
    categoria: "Picolés",
    imagem: "assets/images/mine-paleta/açai-trufado.jpg",
    disponivel: true,
    destaque: false
  },

  // ═══════════════════════════════════════════════════════════════════
  // TAÇAS & SUNDAES — Experiências Compartilháveis
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "taca-kinder-bueno",
    nome: "Taça Kinder Bueno®",
    descricao: "Bolas de sorvete de avelã e chocolate branco, pedaços de Kinder Bueno®, calda quente de Nutella, chantilly e wafer crocante. Uma obra-prima.",
    preco: 28.90,
    categoria: "Taças & Sundaes",
    imagem: "assets/images/sobremesas/taça-kinder-dueno-editada.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "taca-laka-oreo",
    nome: "Taça Laka com Oreo®",
    descricao: "Chocolate branco Laka® derretido sobre sorvete premium, biscoitos Oreo® triturados, chantilly artesanal e farofa crocante. Pura tentação.",
    preco: 26.90,
    categoria: "Taças & Sundaes",
    imagem: "assets/images/sobremesas/taça-laka-oero.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "torta-sorvete-premium",
    nome: "Torta de Sorvete Suprema",
    descricao: "Exclusiva torta de gelato trufado. Deliciosas camadas de gelato de baunilha bourbon e chocolate belga com cobertura de ganache de chocolate, chantilly premium e cerejas marrasquino.",
    preco: 32.90,
    categoria: "Taças & Sundaes",
    imagem: "assets/images/sobremesas/torta-sorvete-premium.jpg",
    disponivel: true,
    destaque: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // ESPECIAL DE INVERNO — Cardápio de Inverno Sazonal
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "brownie-na-chapa",
    nome: "Brownie na Chapa",
    descricao: "Brownie artesanal grelhado na chapa quente, servido com bola de gelato de creme, calda quente de chocolate belga borbulhando e farofa de castanhas.",
    preco: 24.90,
    categoria: "Especial de Inverno",
    imagem: "assets/images/sobremesas/brounie-na-chapa -bom.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "grand-gateau",
    nome: "Grand Gâteau Chocolat",
    descricao: "Bolo vulcão quente de chocolate com recheio cremoso e escorrido, servido com um picolé artesanal de creme e cobertura generosa de chocolate belga.",
    preco: 27.90,
    categoria: "Especial de Inverno",
    imagem: "assets/images/sobremesas/grand-gateu.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "petit-gateau",
    nome: "Petit Gâteau Clássico",
    descricao: "Bolo de chocolate artesanal assado na hora com recheio cremoso quente, acompanhado de uma bola de gelato italiano de creme.",
    preco: 21.90,
    categoria: "Especial de Inverno",
    imagem: "assets/images/sobremesas/2.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "fondue-chocolate",
    nome: "Fondue de Gelato Premium",
    descricao: "Morangos frescos, uvas e bananas picadas servidos com mini bolas de gelato artesanal para mergulhar em uma ganache de chocolate belga quente.",
    preco: 35.90,
    categoria: "Especial de Inverno",
    imagem: "assets/images/sobremesas/taça-laka-oero.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "chocolate-quente",
    nome: "Chocolate Quente Belga",
    descricao: "Chocolate quente cremoso tipo europeu feito com chocolate belga e creme de leite, finalizado com chantilly artesanal e raspas de chocolate nobre.",
    preco: 15.90,
    categoria: "Especial de Inverno",
    imagem: "assets/images/sobremesas/frap-gelado.jfif",
    disponivel: true,
    destaque: true
  },
  {
    id: "frap-gelado",
    nome: "Frappuccino Gelado",
    descricao: "Café espresso premium batido com sorvete artesanal e gelo, finalizado com chantilly e calda. Energia e indulgência.",
    preco: 18.90,
    categoria: "Milkshakes",
    imagem: "assets/images/sobremesas/frap-gelado.jfif",
    disponivel: true,
    destaque: false
  },
  {
    id: "milkshake-premium",
    nome: "Milkshake Premium de Chocolate",
    descricao: "Gelato artesanal de chocolate belga batido com leite cremoso, servido com calda rica de chocolate nobre, finalizado com chantilly aerado e raspas de chocolate premium.",
    preco: 21.90,
    categoria: "Milkshakes",
    imagem: "assets/images/sobremesas/milkshake-premium.jpg",
    disponivel: true,
    destaque: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // AÇAÍ — Energia da Amazônia
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "acai-tigela-completo",
    nome: "Açaí na Tigela Completo (500ml)",
    descricao: "Açaí premium da Amazônia, morangos e bananas frescas, granola crocante artesanal, leite Ninho e leite condensado. O combustível perfeito.",
    preco: 22.00,
    categoria: "Açaí",
    imagem: "assets/images/sobremesas/açai-com-preço.jfif",
    disponivel: true,
    destaque: true
  },

  // ═══════════════════════════════════════════════════════════════════
  // POTES PARA LEVAR — Leve a Experiência Para Casa
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "pote-chocotella",
    nome: "Pote Chocotella (500ml)",
    descricao: "Leve para casa nosso exclusivo sabor Chocotella. Chocolate com avelã em textura ultra cremosa. Porção generosa para compartilhar.",
    preco: 28.00,
    categoria: "Sorvetes",
    imagem: "assets/images/potes/pote_chocotella.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "pote-maracuja",
    nome: "Pote Maracujá (500ml)",
    descricao: "Maracujá fresco em gelato cremoso, pronto para levar. Sabor tropical intenso para apreciar quando quiser.",
    preco: 25.00,
    categoria: "Sorvetes",
    imagem: "assets/images/potes/pote_maracuja.jpg",
    disponivel: true,
    destaque: false
  },
  {
    id: "pote-chocolate",
    nome: "Pote Chocolate Premium (500ml)",
    descricao: "Nosso chocolate intenso em pote para você desfrutar em casa. Qualidade artesanal sem sair do conforto.",
    preco: 25.00,
    categoria: "Sorvetes",
    imagem: "assets/images/potes/sorvete-chocolate.jpg",
    disponivel: true,
    destaque: false
  }
];
