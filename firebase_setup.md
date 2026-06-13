# Guia de Configuração do Firebase Firestore - Amarena Sorvetes

Este guia ajudará você a configurar o banco de dados gratuito do **Google Firebase** para que seu cardápio seja carregado de forma 100% dinâmica.

---

## Passo 1: Criar o Projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e faça login com sua conta do Google.
2. Clique em **"Adicionar projeto"** (ou **"Criar um projeto"**).
3. Dê um nome ao seu projeto (ex: `Amarena Sorvetes`) e clique em **Continuar**.
4. Desative o Google Analytics para este projeto (opcional, para ser mais rápido) e clique em **"Criar projeto"**.
5. Aguarde alguns segundos e clique em **Continuar**.

---

## Passo 2: Registrar um Aplicativo Web

1. Na tela inicial do seu projeto (Visão geral do projeto), clique no ícone de **Web** (`</>`) para registrar um aplicativo.
2. Insira o apelido do app (ex: `Amarena Web`) e clique em **Registrar app**.
3. O Firebase mostrará um bloco de código contendo o objeto `firebaseConfig`. Ele se parece com isto:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "seu-projeto.firebaseapp.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:12345:web:abcd"
   };
   ```
4. **Copie estes dados** e substitua no arquivo [firebase-config.js](file:///c:/donizete/riberiossp/firebase-config.js) do seu projeto.
5. No mesmo arquivo [firebase-config.js](file:///c:/donizete/riberiossp/firebase-config.js), mude o valor de `USE_FIREBASE = false` para `USE_FIREBASE = true`.

---

## Passo 3: Criar o Banco de Dados Firestore

1. No menu lateral esquerdo do painel do Firebase, clique em **Build** (Construir) e depois em **Firestore Database**.
2. Clique no botão **"Criar banco de dados"**.
3. Selecione a localização do servidor (pode deixar o padrão ou escolher `southamerica-east1` em São Paulo para menor latência) e clique em **Avançar**.
4. Escolha **"Iniciar no modo de teste"** (isso facilitará os testes iniciais e permitirá a leitura e escrita sem autenticação) e clique em **Criar**.

> [!WARNING]
> O modo de teste deixa o banco aberto publicamente por 30 dias. Depois desse período, você precisará configurar regras de segurança para proteger seus dados contra gravação indevida, mas mantendo a leitura pública para que seus clientes vejam o cardápio.

---

## Passo 4: Cadastrar os Itens do Cardápio (Seeding)

Para facilitar, você tem duas opções para inserir os sorvetes no banco de dados:

### Opção A: Usando o Terminal (Node.js)
1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. No terminal, na pasta do seu projeto (`c:/donizete/riberiossp`), instale o SDK do Firebase:
   ```bash
   npm install firebase
   ```
3. Abra o arquivo [seed-menu.js](file:///c:/donizete/riberiossp/seed-menu.js) e insira suas credenciais do Firebase no topo do arquivo (as mesmas copiadas no Passo 2).
4. Execute o script para cadastrar tudo automaticamente no Firestore:
   ```bash
   node seed-menu.js
   ```
5. Pronto! Acesse a aba **Firestore Database** no Firebase Console para ver todos os itens criados na coleção `cardapio`.

### Opção B: Manualmente no Painel
Se preferir cadastrar pelo painel do Firebase, siga esta estrutura de coleções:
- Crie uma coleção chamada `cardapio`.
- Cada documento da coleção deve ter um ID único (ex: `amarena-premium`) e os seguintes campos:
  - `nome` (String): ex: `Sorvete Especial Amarena`
  - `descricao` (String): descrição do item
  - `preco` (Number): valor numérico (ex: `14.5`)
  - `categoria` (String): ex: `Sorvetes`, `Picolés`, `Milkshakes`, `Taças & Sundaes` ou `Açaí`
  - `imagem` (String): link da imagem (ex: `https://images.unsplash.com/...`)
  - `disponivel` (Boolean): `true` ou `false`
  - `destaque` (Boolean): `true` ou `false`

---

## Pronto! 🎉
Depois de preencher o `firebase-config.js` e rodar a carga de dados, seu site passará a buscar as informações direto do Firestore em tempo real. Se você alterar qualquer valor lá, ele reflete imediatamente no site!
