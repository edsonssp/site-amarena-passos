/* ==========================================================================
   INTERACTIVE LOGIC & FIREBASE INTEGRATION - AMARENA SORVETES
   Premium Agency-Level Interactive Experience
   ========================================================================== */

// Estado global do aplicativo
let menuItems = [];
let cart = JSON.parse(localStorage.getItem('amarena_cart')) || [];
const WHATSAPP_NUMBER = "5535997509179"; // (35) 9 9750-9179 - Passos/MG

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatusBadge();
  initPhoneClock();
  initMenu();
  // initCart(); // Carrinho desativado para segurança (compra apenas pelo app oficial)
  initScrollAnimations();
  initParallaxEffects();
});

/* ==========================================================================
   1. NAVBAR & MENU MÓVEL
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('main-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navbar = document.getElementById('main-navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  // Efeito de rolagem do cabeçalho
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Atualiza o link ativo com base no scroll da página
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Toggle do menu mobile
  menuToggleBtn.addEventListener('click', () => {
    menuToggleBtn.classList.toggle('open');
    navbar.classList.toggle('open');
  });

  // Fecha o menu mobile ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggleBtn.classList.remove('open');
      navbar.classList.remove('open');
    });
  });
}

/* ==========================================================================
   2. FUNCIONAMENTO E BADGE DE STATUS DINÂMICO
   ========================================================================== */
function initStatusBadge() {
  const badge = document.getElementById('open-status-badge');
  
  function checkStatus() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Horário de funcionamento: todos os dias das 12:00 às 22:00
    const openTime = 12 * 60; // 12:00 em minutos
    const closeTime = 22 * 60; // 22:00 em minutos
    const currentMinutes = hour * 60 + minute;
    
    if (currentMinutes >= openTime && currentMinutes < closeTime) {
      badge.textContent = "● Aberto Agora — Pedidos Liberados";
      badge.className = "badge open";
    } else {
      badge.textContent = "Fechado agora (Abrimos todos os dias às 12:00)";
      badge.className = "badge closed";
    }
  }
  
  checkStatus();
  setInterval(checkStatus, 30000);
}

/* ==========================================================================
   3. RELÓGIO DO SMARTPHONE (MOCKUP)
   ========================================================================== */
function initPhoneClock() {
  const clockDisplay = document.getElementById('phone-time-display');
  
  function updateClock() {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    clockDisplay.textContent = `${hh}:${mm}`;
  }
  
  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   4. INTEGRAÇÃO E CARREGAMENTO DO CARDÁPIO (FIRESTORE / LOCAL)
   ========================================================================== */
async function initMenu() {
  const menuGrid = document.getElementById('menu-grid');
  
  // Verifica se o Firebase deve ser usado e se as chaves foram devidamente configuradas pelo usuário
  const isFirebaseConfigured = typeof USE_FIREBASE !== 'undefined' && USE_FIREBASE && 
                               typeof firebaseConfig !== 'undefined' && 
                               firebaseConfig.apiKey !== "SUA_API_KEY" && 
                               firebaseConfig.projectId !== "SEU_PROJECT_ID";

  if (isFirebaseConfigured) {
    try {
      console.log("Inicializando conexão com Firebase Firestore...");
      // Inicializa o Firebase (se ainda não inicializado)
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      const db = firebase.firestore();
      
      // Carrega os dados da coleção 'cardapio'
      const snapshot = await db.collection('cardapio').get();
      menuItems = [];
      
      snapshot.forEach(doc => {
        menuItems.push({ id: doc.id, ...doc.data() });
      });

      console.log(`Carregados ${menuItems.length} itens do Firestore.`);
    } catch (error) {
      console.error("Erro ao carregar do Firestore, ativando fallback local:", error);
      loadLocalData();
    }
  } else {
    console.log("Firebase desativado ou não configurado. Carregando dados locais (Modo Demo)...");
    loadLocalData();
  }
  
  renderMenu(menuItems);
  renderDestaques(menuItems);
  setupFilters();
}

function loadLocalData() {
  if (typeof defaultMenu !== 'undefined') {
    menuItems = defaultMenu;
  } else {
    menuItems = [];
  }
}

/* ==========================================================================
   DESTAQUES — Produtos Premium em Grid Featured
   ========================================================================== */
function renderDestaques(items) {
  const destaquesGrid = document.getElementById('destaques-grid');
  if (!destaquesGrid) return;
  
  const destaques = items.filter(item => item.destaque && item.disponivel).slice(0, 6);
  destaquesGrid.innerHTML = '';
  
  destaques.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `destaque-card ${index === 0 ? 'destaque-featured' : ''}`;
    
    card.innerHTML = `
      <div class="destaque-img-wrapper">
        <img src="${item.imagem}" alt="${item.nome}" class="destaque-img" loading="lazy">
        <div class="destaque-img-glow"></div>
      </div>
      <div class="destaque-info">
        <span class="destaque-category">${item.categoria}</span>
        <h3 class="destaque-name">${item.nome}</h3>
        <p class="destaque-desc">${item.descricao}</p>
      </div>
    `;
    
    destaquesGrid.appendChild(card);
  });
}

// Renderiza a lista de pratos no grid
function renderMenu(items) {
  const menuGrid = document.getElementById('menu-grid');
  menuGrid.innerHTML = '';
  
  if (items.length === 0) {
    menuGrid.innerHTML = `
      <div class="menu-loading-spinner">
        <i class="fa-solid fa-circle-exclamation"></i> Nenhum produto encontrado.
      </div>
    `;
    return;
  }
  
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = `menu-card ${item.disponivel ? '' : 'indisponivel'}`;
    card.id = `item-${item.id}`;
    card.style.animationDelay = `${index * 0.05}s`;
    
    let badgeHTML = item.destaque ? `<span class="menu-badge-destaque"><i class="fa-solid fa-crown"></i> Destaque</span>` : '';
    let overlayHTML = item.disponivel ? '' : `<div class="indisponivel-overlay">INDISPONÍVEL</div>`;
    
    card.innerHTML = `
      <div class="menu-card-img-wrapper">
        <img src="${item.imagem || 'assets/images/drawable/brigadeiro.jpg'}" alt="${item.nome}" class="menu-card-img" loading="lazy">
        <div class="menu-card-img-shine"></div>
        ${badgeHTML}
        ${overlayHTML}
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-title">${item.nome}</h3>
        <p class="menu-card-desc">${item.descricao}</p>
      </div>
    `;
    
    menuGrid.appendChild(card);
  });
}

// Lógica de Filtros e Busca do Cardápio
function setupFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryBtns = document.querySelectorAll('.category-btn');
  let currentCategory = 'Todos';
  let searchQuery = '';

  function filterMenu() {
    const filtered = menuItems.filter(item => {
      const matchCategory = currentCategory === 'Todos' || item.categoria === currentCategory;
      const matchSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.descricao.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
    renderMenu(filtered);
  }

  // Evento de busca textual
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterMenu();
  });

  // Evento de categorias
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      filterMenu();
    });
  });
}

/* ==========================================================================
   5. CARRINHO DE COMPRAS E PEDIDOS WHATSAPP
   ========================================================================== */
function initCart() {
  const cartToggleHeader = document.getElementById('cart-toggle-header');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const btnSubmitOrder = document.getElementById('btn-submit-order');
  const orderType = document.getElementById('order-type');
  const addressGroup = document.getElementById('delivery-address-group');
  const orderAddress = document.getElementById('order-address');

  // Abre carrinho
  cartToggleHeader.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
  });

  // Fecha carrinho
  const closeCart = () => {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
  };
  cartCloseBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Toggle do campo endereço com base no tipo de entrega
  orderType.addEventListener('change', () => {
    if (orderType.value === 'Retirada') {
      addressGroup.style.display = 'none';
      orderAddress.removeAttribute('required');
    } else {
      addressGroup.style.display = 'block';
      orderAddress.setAttribute('required', 'required');
    }
  });

  // Enviar pedido para o WhatsApp
  btnSubmitOrder.addEventListener('click', submitOrder);
  
  updateCartUI();
}

function addToCart(itemId) {
  const item = menuItems.find(i => i.id === itemId);
  if (!item || !item.disponivel) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.quantidade += 1;
  } else {
    cart.push({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      imagem: item.imagem,
      quantidade: 1
    });
  }

  saveCart();
  updateCartUI();
  
  // Feedback visual premium — pulso no botão + notificação
  const cartBtn = document.getElementById('cart-toggle-header');
  cartBtn.classList.add('cart-pulse');
  setTimeout(() => cartBtn.classList.remove('cart-pulse'), 600);
  
  // Toast notification
  showToast(`${item.nome} adicionado ao carrinho!`);
}

// Toast notification premium
function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

function updateCartQuantity(itemId, change) {
  const existing = cart.find(c => c.id === itemId);
  if (!existing) return;

  existing.quantidade += change;
  if (existing.quantidade <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  }

  saveCart();
  updateCartUI();
}

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('amarena_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const cartList = document.getElementById('cart-items-list');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartTotalPrice = document.getElementById('cart-total-price');
  
  // Conta o total de itens
  const totalItems = cart.reduce((acc, curr) => acc + curr.quantidade, 0);
  cartCountBadge.textContent = totalItems;
  
  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-message">
        <i class="fa-solid fa-basket-shopping"></i>
        <p>Seu carrinho está vazio!</p>
        <p class="subtitle">Adicione itens deliciosos do nosso cardápio acima.</p>
      </div>
    `;
    cartTotalPrice.textContent = "R$ 0,00";
    return;
  }

  cartList.innerHTML = '';
  let totalPrice = 0;

  cart.forEach(item => {
    const itemSubtotal = item.preco * item.quantidade;
    totalPrice += itemSubtotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <img src="${item.imagem || 'assets/images/drawable/brigadeiro.jpg'}" alt="${item.nome}" class="cart-item-img">
      <div class="cart-item-info">
        <h4 class="cart-item-name">${item.nome}</h4>
        <p class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn dec-btn" data-id="${item.id}" aria-label="Diminuir quantidade"><i class="fa-solid fa-minus"></i></button>
            <span class="qty-number">${item.quantidade}</span>
            <button class="qty-btn inc-btn" data-id="${item.id}" aria-label="Aumentar quantidade"><i class="fa-solid fa-plus"></i></button>
          </div>
          <button class="remove-item-btn" data-id="${item.id}" aria-label="Remover item"><i class="fa-solid fa-trash-can"></i></button>
        </div>
      </div>
    `;

    // Eventos dos botões do carrinho
    itemEl.querySelector('.dec-btn').addEventListener('click', () => updateCartQuantity(item.id, -1));
    itemEl.querySelector('.inc-btn').addEventListener('click', () => updateCartQuantity(item.id, 1));
    itemEl.querySelector('.remove-item-btn').addEventListener('click', () => removeFromCart(item.id));

    cartList.appendChild(itemEl);
  });

  cartTotalPrice.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// Finalização e envio do pedido para o WhatsApp
function submitOrder() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const name = document.getElementById('order-name').value.trim();
  const type = document.getElementById('order-type').value;
  const address = document.getElementById('order-address').value.trim();
  const payment = document.getElementById('order-payment').value;

  if (!name) {
    alert("Por favor, informe seu nome.");
    document.getElementById('order-name').focus();
    return;
  }

  if (type === 'Entrega' && !address) {
    alert("Por favor, preencha o endereço para a entrega.");
    document.getElementById('order-address').focus();
    return;
  }

  // Monta a mensagem de texto
  let message = `🍦 *NOVO PEDIDO - AMARENA SORVETES* 🍦\n\n`;
  message += `👤 *Cliente:* ${name}\n`;
  message += `🛵 *Tipo:* ${type}\n`;
  
  if (type === 'Entrega') {
    message += `📍 *Endereço:* ${address}\n`;
  }
  
  message += `💳 *Forma de Pagamento:* ${payment}\n\n`;
  message += `📋 *Itens do Pedido:*\n`;

  let total = 0;
  cart.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    message += `- *${item.quantidade}x* ${item.nome} (R$ ${item.preco.toFixed(2).replace('.', ',')} cada) -> *R$ ${subtotal.toFixed(2).replace('.', ',')}*\n`;
  });

  message += `\n💰 *Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
  message += `Obrigado pela preferência! Aguardando confirmação.`;

  // Codifica a URL
  const urlEncoded = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${urlEncoded}`;

  // Abre a URL do WhatsApp
  window.open(whatsappUrl, '_blank');

  // Limpa o carrinho após fechar o pedido (feedback positivo)
  cart = [];
  saveCart();
  updateCartUI();
  
  // Fecha o carrinho lateral
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  
  showToast("Pedido enviado com sucesso para o WhatsApp!");
}

/* ==========================================================================
   6. ANIMAÇÕES DE SCROLL — Reveal Premium
   ========================================================================== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Não desobserva para permitir re-reveal em scroll reverso se desejado
      }
    });
  }, observerOptions);

  // Observa elementos para animação
  const animatedElements = document.querySelectorAll(
    '.section-header, .destaque-card, .menu-card, .step-card, .gallery-item, ' +
    '.testimonial-card, .metric-box, .contact-item, .sobre-content, .sobre-images, ' +
    '.contato-info, .contato-map, .promo-content, .feature-item'
  );

  animatedElements.forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

/* ==========================================================================
   7. EFEITOS PARALLAX — Profundidade Visual
   ========================================================================== */
function initParallaxEffects() {
  const heroBg = document.querySelector('.hero-bg-image');
  
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      heroBg.style.transform = `translateY(${rate}px) scale(1.1)`;
    }, { passive: true });
  }

  // Parallax nos floating cards do hero
  const floatingCards = document.querySelectorAll('.hero-card-floating');
  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    floatingCards.forEach((card, index) => {
      const factor = (index + 1) * 8;
      card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }, { passive: true });
}
