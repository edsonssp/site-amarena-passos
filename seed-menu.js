// Script para popular (seed) o Firestore com o cardápio inicial da Amarena Sorvetes.
//
// Para rodar este script:
// 1. Instale o Firebase: npm install firebase
// 2. Configure suas credenciais do Firebase abaixo.
// 3. Execute o script no terminal: node seed-menu.js

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

// Substitua com as credenciais do seu projeto Firebase Console
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const defaultMenu = [
  {
    id: "amarena-premium",
    nome: "Sorvete Especial Amarena",
    descricao: "Nossa especialidade! Sorvete cremoso de nata artesanal com mesclas generosas de cereja amarena italiana silvestre.",
    preco: 14.50,
    categoria: "Sorvetes",
    imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  },
  {
    id: "pistache-premium",
    nome: "Pistache Siciliano",
    descricao: "Gelato artesanal cremoso de pistache tostado italiano. Sabor intenso e textura incomparável.",
    preco: 16.00,
    categoria: "Sorvetes",
    imagem: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  },
  {
    id: "ninho-trufado",
    nome: "Ninho Trufado",
    descricao: "Sorvete suave de leite Ninho com fitas espessas de trufa de chocolate meio amargo.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: false
  },
  {
    id: "chocolate-belga",
    nome: "Chocolate Belga Extra Cacau",
    descricao: "Sorvete cremoso feito com puro chocolate belga 70% cacau. Uma tentação intensa.",
    preco: 13.00,
    categoria: "Sorvetes",
    imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: false
  },
  {
    id: "paleta-morango",
    nome: "Paleta Mexicana de Morango",
    descricao: "Picolé artesanal de morango fresco recheado com leite condensado cremoso.",
    preco: 9.50,
    categoria: "Picolés",
    imagem: "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  },
  {
    id: "picole-coco-queimado",
    nome: "Picolé de Coco Queimado",
    descricao: "Feito com coco ralado fresco tostado e leite de coco artesanal. Cremoso e leve.",
    preco: 6.00,
    categoria: "Picolés",
    imagem: "https://images.unsplash.com/photo-1488900128323-21503983a07e?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: false
  },
  {
    id: "taca-amarena-premium",
    nome: "Super Taça Amarena",
    descricao: "Duas bolas de sorvete de Nata e Amarena, calda artesanal de amarena, chantilly fresco, farofa doce crocante e waffer.",
    preco: 26.90,
    categoria: "Taças & Sundaes",
    imagem: "https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  },
  {
    id: "sundae-morango",
    nome: "Sundae Clássico de Morango",
    descricao: "Sorvete de creme com cobertura farta de morango morna, castanhas picadas, chantilly e cereja no topo.",
    preco: 18.00,
    categoria: "Taças & Sundaes",
    imagem: "https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: false
  },
  {
    id: "shake-nutella",
    nome: "Milkshake Crocante de Nutella",
    descricao: "Batido com sorvete de baunilha, calda abundante de Nutella genuína, pedaços de avelã tostada e chantilly.",
    preco: 19.90,
    categoria: "Milkshakes",
    imagem: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  },
  {
    id: "shake-ninho",
    nome: "Milkshake Ninho Trufado",
    descricao: "Milkshake super cremoso de leite Ninho mesclado com calda artesanal de chocolate belga trufado.",
    preco: 19.90,
    categoria: "Milkshakes",
    imagem: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: false
  },
  {
    id: "acai-tigela-completo",
    nome: "Açaí na Tigela Completo (500ml)",
    descricao: "Açaí premium cremoso, acompanhado de morangos e bananas frescas fatiadas, granola crocante, leite em pó Ninho e leite condensado.",
    preco: 22.00,
    categoria: "Açaí",
    imagem: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=400&q=80",
    disponivel: true,
    destaque: true
  }
];

async function seed() {
  if (firebaseConfig.projectId === "SUA_PROJECT_ID") {
    console.log("-----------------------------------------------------------------");
    console.log("AVISO: Altere 'SUA_PROJECT_ID' e outras chaves com seus dados");
    console.log("do Firebase no arquivo seed-menu.js para rodar o script no terminal.");
    console.log("-----------------------------------------------------------------");
    return;
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Iniciando o cadastro dos itens no Firestore (Coleção: cardapio)...");
  
  for (const item of defaultMenu) {
    try {
      // Cria ou atualiza o documento do prato
      await setDoc(doc(db, "cardapio", item.id), item);
      console.log(`[SUCESSO] Adicionado: ${item.nome}`);
    } catch (error) {
      console.error(`[ERRO] Falha ao adicionar ${item.nome}:`, error);
    }
  }

  console.log("Cadastro finalizado!");
  process.exit(0);
}

seed();
