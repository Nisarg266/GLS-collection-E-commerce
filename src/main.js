import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  BRAND_CONFIG,
  resolveCollectionMeta,
} from './data/categories.js';
import {
  PRODUCTS,
  INSTAGRAM_SHOWCASE,
  findProductByHandleOrId,
} from './data/products.js';
import {
  calculateCartSummary,
} from './utils/currency.js';
import {
  addItemToCartList,
  updateCartListQuantity,
  removeCartListItem,
  toggleWishlistList,
  loadCart,
  saveCart,
  loadWishlist,
  saveWishlist,
} from './utils/storage.js';
import { renderIcon } from './utils/icons.js';
import {
  renderAnnouncementBar,
  renderHeader,
  renderFooter,
} from './components/header.js';
import {
  renderMobileNavigationDrawer,
  renderMobileBottomNav,
} from './components/mobile-navigation.js';
import {
  renderCartDrawer,
  renderDemoCheckoutModal,
} from './components/cart-drawer.js';
import {
  renderFilterGroupsHtml,
  renderQuickViewModal,
  renderReelModal,
} from './components/search.js';
import {
  renderHomePage,
  renderCollectionsPage,
  renderSingleCollectionPage,
  renderProductDetailPage,
  renderAboutPage,
  renderContactPage,
  renderSearchPage,
  renderCartPage,
  renderWishlistPage,
  renderFaqPage,
  renderPoliciesPage,
} from './components/pages.js';

gsap.registerPlugin(ScrollTrigger);

function detectCurrentPage() {
  const bodyPage = document.body?.dataset?.page;
  if (bodyPage) return bodyPage;

  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (path.endsWith('/collections') || path.endsWith('/collections.html')) return 'collections';
  if (path.endsWith('/collection') || path.endsWith('/collection.html')) return 'collection';
  if (path.endsWith('/product') || path.endsWith('/product.html')) return 'product';
  if (path.endsWith('/about') || path.endsWith('/about.html')) return 'about';
  if (path.endsWith('/contact') || path.endsWith('/contact.html')) return 'contact';
  if (path.endsWith('/search') || path.endsWith('/search.html')) return 'search';
  if (path.endsWith('/cart') || path.endsWith('/cart.html')) return 'cart';
  if (path.endsWith('/wishlist') || path.endsWith('/wishlist.html')) return 'wishlist';
  if (path.endsWith('/faq') || path.endsWith('/faq.html')) return 'faq';
  if (path.endsWith('/policies') || path.endsWith('/policies.html')) return 'policies';
  return 'home';
}

function getInitialUrlState() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get('category') || 'all',
    priceRange: params.get('price') || 'all',
    size: params.get('size') || 'all',
    sortBy: params.get('sort') || 'featured',
    inStockOnly: params.get('stock') === '1',
    handle: params.get('handle') || 'cute-bow-cardigan',
    query: params.get('q') || '',
  };
}

const initialUrl = getInitialUrlState();
const currentPage = detectCurrentPage();

const state = {
  page: currentPage,
  cart: loadCart(PRODUCTS),
  wishlist: loadWishlist(PRODUCTS),
  isHeaderSearchOpen: false,
  headerSearchQuery: initialUrl.query,

  // Collection page filter state
  collectionCriteria: {
    filter: initialUrl.category,
    priceRange: initialUrl.priceRange,
    size: initialUrl.size,
    inStockOnly: initialUrl.inStockOnly,
    sortBy: initialUrl.sortBy,
    query: '',
  },
  isCollectionFilterDrawerOpen: false,

  // Product Detail page state
  pdpHandle: initialUrl.handle,
  pdpPageState: {
    imageIndex: 0,
    size: '',
    color: '',
    quantity: 1,
    openAccordion: 'details',
  },
  lightboxImage: '',

  // Search page state
  searchPageQuery: initialUrl.query,

  // FAQ page state
  openFaqId: 'faq-demo',

  // Newsletter & Contact demo form states
  newsletterState: {
    submittedEmail: '',
    error: '',
  },
  contactState: {
    submitted: false,
    name: '',
    subject: '',
    error: '',
  },

  // Global overlays
  isMobileNavOpen: false,
  isCartOpen: false,
  isCheckoutOpen: false,
  checkoutConfirmed: null,
  checkoutError: '',
  quickView: {
    productId: null,
    selectedImageIndex: 0,
    selectedSize: '',
    selectedColor: '',
    quantity: 1,
  },
  activeReelId: null,
  toasts: [],
};

// Initialize default size & color for PDP if on product page
const initialPdpProduct = findProductByHandleOrId(state.pdpHandle);
if (initialPdpProduct) {
  state.pdpPageState.size =
    (initialPdpProduct.sizes && initialPdpProduct.sizes[0]) || 'Free Size';
  const colors =
    initialPdpProduct.colors || initialPdpProduct.availableColors || [];
  state.pdpPageState.color = colors[0] || 'Standard';
}

function getActiveNavKey() {
  if (state.page === 'home') return 'home';
  if (state.page === 'collections') return 'collections';
  if (state.page === 'about') return 'about';
  if (state.page === 'search') return 'search';
  if (state.page === 'cart') return 'cart';
  if (state.page === 'wishlist') return 'wishlist';
  if (state.page === 'collection') {
    const cat = String(state.collectionCriteria.filter || 'all').toLowerCase();
    if (cat === 'new-arrivals') return 'new-arrivals';
    if (cat === 'kidswear') return 'kidswear';
    if (cat === 'women') return 'women';
    if (cat === 'knitwear') return 'knitwear';
    return 'collections';
  }
  return '';
}

function syncDocumentMetadata() {
  if (state.page === 'collection') {
    const meta = resolveCollectionMeta(state.collectionCriteria.filter);
    document.title = `${meta.name} — ${BRAND_CONFIG.name}`;
  } else if (state.page === 'product') {
    const product = findProductByHandleOrId(state.pdpHandle);
    if (product) {
      document.title = `${product.name} — ${BRAND_CONFIG.name}`;
    } else {
      document.title = `Product Not Found — ${BRAND_CONFIG.name}`;
    }
  } else if (state.page === 'search' && state.searchPageQuery) {
    document.title = `Search: "${state.searchPageQuery}" — ${BRAND_CONFIG.name}`;
  }
}

function syncCollectionUrl() {
  if (state.page !== 'collection') return;
  const params = new URLSearchParams();
  const { filter, priceRange, size, inStockOnly, sortBy } =
    state.collectionCriteria;
  if (filter && filter !== 'all') params.set('category', filter);
  else params.set('category', 'all');
  if (priceRange && priceRange !== 'all') params.set('price', priceRange);
  if (size && size !== 'all') params.set('size', size);
  if (inStockOnly) params.set('stock', '1');
  if (sortBy && sortBy !== 'featured') params.set('sort', sortBy);

  const nextUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', nextUrl);
  syncDocumentMetadata();
}

function showToast(message) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  state.toasts.push({ id, message });
  renderToastContainer();

  window.setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
    renderToastContainer();
  }, 2900);
}

function renderToastContainer() {
  const container = document.getElementById('toast-container');
  if (!container) return;
  container.innerHTML = state.toasts
    .map(
      (t) => `
      <div class="toast" role="status" aria-live="polite">
        <span style="color: #F3D1DC;">${renderIcon('check', 15)}</span>
        <span>${t.message}</span>
      </div>
    `
    )
    .join('');
}

function hasAnyOpenOverlay() {
  return Boolean(
    state.isMobileNavOpen ||
      state.isCollectionFilterDrawerOpen ||
      state.isCartOpen ||
      state.isCheckoutOpen ||
      state.quickView.productId ||
      state.activeReelId ||
      state.lightboxImage
  );
}

function closeAllOverlays() {
  state.isMobileNavOpen = false;
  state.isCollectionFilterDrawerOpen = false;
  state.isCartOpen = false;
  state.isCheckoutOpen = false;
  state.checkoutConfirmed = null;
  state.checkoutError = '';
  state.quickView.productId = null;
  state.activeReelId = null;
  state.lightboxImage = '';
  renderOverlaysAndBadges();
}

function renderCollectionFilterDrawer() {
  if (state.page !== 'collection') return '';
  const isOpen = state.isCollectionFilterDrawerOpen;
  return `
    <aside
      class="drawer drawer--left ${isOpen ? 'is-open' : ''}"
      id="collection-filter-drawer"
      aria-label="Filter and Refine Collection"
      aria-hidden="${isOpen ? 'false' : 'true'}"
    >
      <div class="drawer__header">
        <h2 class="drawer__title">Filter &amp; Refine</h2>
        <button
          type="button"
          class="icon-btn"
          data-action="close-overlays"
          aria-label="Close filter drawer"
        >
          ${renderIcon('close', 20)}
        </button>
      </div>
      <div class="drawer__body">
        ${renderFilterGroupsHtml(state.collectionCriteria)}
      </div>
      <div class="drawer__footer">
        <button
          type="button"
          class="btn btn--accent btn--sm btn--full"
          data-action="close-overlays"
        >
          View Filtered Products
        </button>
      </div>
    </aside>
  `;
}

function renderLightboxModal() {
  if (!state.lightboxImage) {
    return `<div class="modal-container" id="lightbox-modal" aria-hidden="true"></div>`;
  }
  return `
    <div
      class="modal-container is-open"
      id="lightbox-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged product image"
    >
      <div class="modal-card modal-card--lightbox">
        <button
          type="button"
          class="modal-close-btn"
          data-action="close-overlays"
          aria-label="Close enlarged image"
        >
          ${renderIcon('close', 18)}
        </button>
        <img
          src="${state.lightboxImage}"
          alt="Enlarged garment view"
          class="lightbox-img"
          referrerpolicy="no-referrer"
        />
      </div>
    </div>
  `;
}

function renderPageMainContent() {
  switch (state.page) {
    case 'collections':
      return renderCollectionsPage();
    case 'collection':
      return renderSingleCollectionPage({
        collectionCriteria: state.collectionCriteria,
        wishlist: state.wishlist,
      });
    case 'product':
      return renderProductDetailPage({
        handle: state.pdpHandle,
        pdpState: state.pdpPageState,
        wishlist: state.wishlist,
      });
    case 'about':
      return renderAboutPage();
    case 'contact':
      return renderContactPage({
        contactState: state.contactState,
      });
    case 'search':
      return renderSearchPage({
        query: state.searchPageQuery,
        wishlist: state.wishlist,
      });
    case 'cart':
      return renderCartPage({
        cartItems: state.cart,
      });
    case 'wishlist':
      return renderWishlistPage({
        wishlist: state.wishlist,
      });
    case 'faq':
      return renderFaqPage({
        openFaqId: state.openFaqId,
      });
    case 'policies':
      return renderPoliciesPage();
    case 'home':
    default:
      return renderHomePage({
        wishlist: state.wishlist,
        newsletterState: state.newsletterState,
      });
  }
}

function renderOverlaysAndBadges() {
  const cartSummary = calculateCartSummary(state.cart, PRODUCTS);
  const wishlistCount = state.wishlist.length;
  const activeNav = getActiveNavKey();

  const cartBadge = document.getElementById('header-cart-badge');
  if (cartBadge) {
    cartBadge.textContent = String(cartSummary.itemCount);
    cartBadge.hidden = cartSummary.itemCount === 0;
  }

  const wishlistBadge = document.getElementById('header-wishlist-badge');
  if (wishlistBadge) {
    wishlistBadge.textContent = String(wishlistCount);
    wishlistBadge.hidden = wishlistCount === 0;
  }

  const backdrop = document.getElementById('global-backdrop');
  if (backdrop) {
    backdrop.classList.toggle('is-open', hasAnyOpenOverlay());
  }

  const mobileNavMount = document.getElementById('mobile-nav-mount');
  if (mobileNavMount) {
    mobileNavMount.innerHTML = renderMobileNavigationDrawer({
      isOpen: state.isMobileNavOpen,
      activeNav,
    });
  }

  const collectionDrawerMount = document.getElementById('collection-drawer-mount');
  if (collectionDrawerMount) {
    collectionDrawerMount.innerHTML = renderCollectionFilterDrawer();
  }

  const cartMount = document.getElementById('cart-drawer-mount');
  if (cartMount) {
    cartMount.innerHTML = renderCartDrawer({
      isOpen: state.isCartOpen,
      cartItems: state.cart,
      products: PRODUCTS,
    });
  }

  const quickViewProduct = state.quickView.productId
    ? PRODUCTS.find((p) => p.id === state.quickView.productId) || null
    : null;
  const quickViewMount = document.getElementById('quick-view-mount');
  if (quickViewMount) {
    quickViewMount.innerHTML = renderQuickViewModal({
      product: quickViewProduct,
      selectedImageIndex: state.quickView.selectedImageIndex,
      selectedSize: state.quickView.selectedSize,
      selectedColor: state.quickView.selectedColor,
      quantity: state.quickView.quantity,
      wishlistIds: state.wishlist,
    });
  }

  const activeReel = state.activeReelId
    ? INSTAGRAM_SHOWCASE.find((r) => r.id === state.activeReelId) || null
    : null;
  const reelMount = document.getElementById('reel-modal-mount');
  if (reelMount) {
    reelMount.innerHTML = renderReelModal({ reel: activeReel });
  }

  const checkoutMount = document.getElementById('checkout-modal-mount');
  if (checkoutMount) {
    checkoutMount.innerHTML = renderDemoCheckoutModal({
      isOpen: state.isCheckoutOpen,
      cartItems: state.cart,
      products: PRODUCTS,
      orderConfirmed: state.checkoutConfirmed,
      formError: state.checkoutError,
    });
  }

  const lightboxMount = document.getElementById('lightbox-modal-mount');
  if (lightboxMount) {
    lightboxMount.innerHTML = renderLightboxModal();
  }

  const bottomNavMount = document.getElementById('mobile-bottom-nav-mount');
  if (bottomNavMount) {
    bottomNavMount.innerHTML = renderMobileBottomNav({
      cartCount: cartSummary.itemCount,
      wishlistCount,
      activeNav,
    });
  }

  document.body.style.overflow = hasAnyOpenOverlay() ? 'hidden' : '';
}

function refreshMainContentOnly() {
  const mainEl = document.getElementById('main-content');
  if (mainEl) {
    mainEl.innerHTML = renderPageMainContent();
  }
  renderOverlaysAndBadges();
  initHomeCarousel();
  if (state.page === 'home') initGsapAnimations();
}

let homeCarouselCleanup = null;
let homeHeroTimeline = null;
let pageGsapContext = null;

function initHomeCarousel() {
  if (homeCarouselCleanup) {
    homeCarouselCleanup();
    homeCarouselCleanup = null;
  }

  const hero = document.querySelector('.home-hero');
  if (!hero) return;

  const slides = [...hero.querySelectorAll('[data-hero-slide]')];
  const indicators = [...hero.querySelectorAll('[data-hero-indicator]')];
  const currentLabel = hero.querySelector('[data-hero-current]');
  const toggleButton = hero.querySelector('[data-hero-action="toggle"]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const delay = 5500;
  let activeIndex = -1;
  let transitionVersion = 0;
  let timer = null;
  let suspended = false;
  let userPaused = reducedMotion.matches;
  let touchStartX = null;

  const clearTimer = () => {
    if (timer !== null) window.clearTimeout(timer);
    timer = null;
  };
  const schedule = () => {
    clearTimer();
    if (userPaused || suspended || document.hidden) return;
    timer = window.setTimeout(() => {
      showSlide(activeIndex + 1);
      schedule();
    }, delay);
  };
  const animateSlide = (slide) => {
    transitionVersion += 1;
    const currentVersion = transitionVersion;
    if (homeHeroTimeline) {
      homeHeroTimeline.kill();
      homeHeroTimeline = null;
    }

    const animatedParts = [
      slide.querySelector('.home-hero-slide__image'),
      slide.querySelector('.home-hero-slide__title'),
      slide.querySelector('.home-hero-slide__description'),
      slide.querySelector('.home-hero-slide__actions'),
    ].filter(Boolean);
    if (typeof gsap.timeline !== 'function' || typeof gsap.set !== 'function') return;
    try {
      gsap.killTweensOf(animatedParts);
      gsap.set(animatedParts, { clearProps: 'opacity,transform,visibility' });
    } catch {
      return;
    }
    if (reducedMotion.matches) return;

    const image = slide.querySelector('.home-hero-slide__image');
    const title = slide.querySelector('.home-hero-slide__title');
    const description = slide.querySelector('.home-hero-slide__description');
    const actions = slide.querySelector('.home-hero-slide__actions');
    const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
    const motionDuration = isMobile ? 0.68 : 0.82;

    try {
      homeHeroTimeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          if (transitionVersion === currentVersion) homeHeroTimeline = null;
        },
      });
      if (image) {
        homeHeroTimeline.fromTo(image, { scale: 1.04 }, {
          scale: 1,
          duration: motionDuration,
          clearProps: 'transform',
        }, 0);
      }
      if (title) {
        homeHeroTimeline.fromTo(title, { opacity: 0, y: 16 }, {
          opacity: 1,
          y: 0,
          duration: 0.42,
          clearProps: 'opacity,transform',
        }, 0.1);
      }
      if (description) {
        homeHeroTimeline.fromTo(description, { opacity: 0, y: 10 }, {
          opacity: 1,
          y: 0,
          duration: 0.38,
          clearProps: 'opacity,transform',
        }, 0.3);
      }
      if (actions) {
        homeHeroTimeline.fromTo(actions, { opacity: 0, y: 8 }, {
          opacity: 1,
          y: 0,
          duration: 0.32,
          clearProps: 'opacity,transform',
        }, 0.46);
      }
    } catch {
      gsap.set(animatedParts, { clearProps: 'all' });
      homeHeroTimeline = null;
    }
  };
  const showSlide = (index) => {
    const nextIndex = (index + slides.length) % slides.length;
    if (nextIndex === activeIndex) return;
    activeIndex = nextIndex;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    indicators.forEach((indicator, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      indicator.classList.toggle('is-active', isActive);
      indicator.setAttribute('aria-current', String(isActive));
    });
    if (currentLabel) currentLabel.textContent = String(activeIndex + 1).padStart(2, '0');
    animateSlide(slides[activeIndex]);
  };
  const onControlClick = (event) => {
    const indicator = event.target.closest('[data-hero-indicator]');
    const control = event.target.closest('[data-hero-action]');
    if (indicator) {
      showSlide(Number(indicator.dataset.heroIndicator));
      schedule();
      return;
    }
    if (!control) return;
    const action = control.dataset.heroAction;
    if (action === 'toggle') {
      userPaused = !userPaused;
      control.setAttribute('aria-pressed', String(userPaused));
      control.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
      control.innerHTML = renderIcon(userPaused ? 'play' : 'pause', 16);
      schedule();
      return;
    }
    showSlide(activeIndex + (action === 'previous' ? -1 : 1));
    schedule();
  };
  const onPointerEnter = () => { suspended = true; clearTimer(); };
  const onPointerLeave = () => { suspended = false; schedule(); };
  const onFocusIn = () => { suspended = true; clearTimer(); };
  const onFocusOut = (event) => {
    if (!hero.contains(event.relatedTarget)) { suspended = false; schedule(); }
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      clearTimer();
      homeHeroTimeline?.pause();
    } else {
      homeHeroTimeline?.resume();
      schedule();
    }
  };
  const onTouchStart = (event) => { touchStartX = event.changedTouches[0]?.clientX ?? null; clearTimer(); };
  const onTouchEnd = (event) => {
    const endX = event.changedTouches[0]?.clientX;
    if (touchStartX !== null && endX !== undefined && Math.abs(endX - touchStartX) > 42) {
      showSlide(activeIndex + (endX < touchStartX ? 1 : -1));
    }
    touchStartX = null;
    schedule();
  };
  const syncPauseButton = () => {
    if (!toggleButton) return;
    toggleButton.setAttribute('aria-pressed', String(userPaused));
    toggleButton.setAttribute('aria-label', userPaused ? 'Play slideshow' : 'Pause slideshow');
    toggleButton.innerHTML = renderIcon(userPaused ? 'play' : 'pause', 16);
  };
  const onMotionChange = (event) => {
    if (event.matches) {
      userPaused = true;
      homeHeroTimeline?.kill();
      homeHeroTimeline = null;
      gsap.killTweensOf(hero.querySelectorAll('.home-hero-slide__image, .home-hero-slide__title, .home-hero-slide__description, .home-hero-slide__actions'));
      gsap.set(hero.querySelectorAll('.home-hero-slide__image, .home-hero-slide__title, .home-hero-slide__description, .home-hero-slide__actions'), { clearProps: 'opacity,transform,visibility' });
      pageGsapContext?.revert();
      pageGsapContext = null;
    } else {
      initGsapAnimations();
    }
    syncPauseButton();
    schedule();
  };

  hero.addEventListener('click', onControlClick);
  hero.addEventListener('mouseenter', onPointerEnter);
  hero.addEventListener('mouseleave', onPointerLeave);
  hero.addEventListener('focusin', onFocusIn);
  hero.addEventListener('focusout', onFocusOut);
  hero.addEventListener('touchstart', onTouchStart, { passive: true });
  hero.addEventListener('touchend', onTouchEnd, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotion.addEventListener?.('change', onMotionChange);
  syncPauseButton();
  showSlide(0);
  schedule();

  homeCarouselCleanup = () => {
    clearTimer();
    transitionVersion += 1;
    homeHeroTimeline?.kill();
    homeHeroTimeline = null;
    hero.removeEventListener('click', onControlClick);
    hero.removeEventListener('mouseenter', onPointerEnter);
    hero.removeEventListener('mouseleave', onPointerLeave);
    hero.removeEventListener('focusin', onFocusIn);
    hero.removeEventListener('focusout', onFocusOut);
    hero.removeEventListener('touchstart', onTouchStart);
    hero.removeEventListener('touchend', onTouchEnd);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.removeEventListener?.('change', onMotionChange);
  };
}

function renderApp() {
  const appRoot = document.getElementById('app');
  if (!appRoot) return;

  syncDocumentMetadata();
  const cartSummary = calculateCartSummary(state.cart, PRODUCTS);
  const wishlistCount = state.wishlist.length;
  const activeNav = getActiveNavKey();

  appRoot.innerHTML = `
    <div class="page-shell">
      ${renderAnnouncementBar()}
      ${renderHeader({
        activeNav,
        cartCount: cartSummary.itemCount,
        wishlistCount,
        isSearchOpen: state.isHeaderSearchOpen,
        searchQuery: state.headerSearchQuery,
      })}

      <main id="main-content">
        ${renderPageMainContent()}
      </main>

      ${renderFooter()}

      <div id="mobile-bottom-nav-mount"></div>
      <div class="overlay-backdrop" id="global-backdrop" data-action="close-overlays"></div>
      <div id="mobile-nav-mount"></div>
      <div id="collection-drawer-mount"></div>
      <div id="cart-drawer-mount"></div>
      <div id="quick-view-mount"></div>
      <div id="reel-modal-mount"></div>
      <div id="checkout-modal-mount"></div>
      <div id="lightbox-modal-mount"></div>
      <div class="toast-container" id="toast-container" aria-live="polite"></div>
    </div>
  `;

  renderOverlaysAndBadges();
  renderToastContainer();
}

function initGsapAnimations() {
  pageGsapContext?.revert();
  pageGsapContext = null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return;

  try {
    pageGsapContext = gsap.context(() => {
      document.querySelectorAll('.gs-reveal').forEach((element) => {
        gsap.fromTo(element, { opacity: 0.94, y: 14 }, {
          opacity: 1,
          y: 0,
          duration: 0.52,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: element,
            start: 'top 92%',
            once: true,
          },
        });
      });

      const footerItems = gsap.utils.toArray('.footer-newsletter, .footer-grid > *');
      const footer = document.querySelector('.site-footer');
      if (footerItems.length && footer) {
        gsap.fromTo(footerItems, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.07,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger: footer, start: 'top 90%', once: true },
        });
      }

      if (state.page !== 'home') return;

      const revealGroup = (selector, triggerSelector, stagger = 0.06) => {
        const elements = gsap.utils.toArray(selector);
        const trigger = document.querySelector(triggerSelector);
        if (!elements.length || !trigger) return;
        gsap.fromTo(elements, { opacity: 0, y: 18 }, {
          opacity: 1,
          y: 0,
          duration: 0.52,
          stagger,
          ease: 'power2.out',
          clearProps: 'opacity,transform',
          scrollTrigger: { trigger, start: 'top 88%', once: true },
        });
      };

      revealGroup('.home-category-card', '.home-category-grid', 0.055);
      revealGroup('.home-product-reveal', '.home-arrivals .product-grid', 0.075);
      revealGroup('.home-values__item', '.home-values', 0.07);
      revealGroup('.home-lookbook-card', '.home-lookbook__grid', 0.1);
      const editorialImage = document.querySelector('.home-editorial__image');
      const editorialLayout = document.querySelector('.home-editorial__layout');
      if (editorialImage && editorialLayout) {
        const simpleReveal = window.matchMedia('(max-width: 767.98px)').matches;
        gsap.fromTo(editorialImage, {
          opacity: 0,
          y: simpleReveal ? 14 : 0,
          clipPath: simpleReveal ? 'inset(0 0 0 0)' : 'inset(0 0 0 12%)',
        }, {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0 0)',
          duration: 0.58,
          ease: 'power2.out',
          clearProps: 'opacity,transform,clipPath',
          scrollTrigger: { trigger: editorialLayout, start: 'top 88%', once: true },
        });
      }
      revealGroup('.home-editorial__copy', '.home-editorial__layout', 0);
      revealGroup('.home-knitwear__image, .home-knitwear__copy', '.home-knitwear', 0.12);
      revealGroup('.home-store-story__media, .home-store-story__content', '.home-store-story', 0.12);

      const lookbookImages = gsap.utils.toArray('.home-lookbook-card img');
      if (lookbookImages.length) {
        gsap.fromTo(lookbookImages, { scale: 1.06 }, {
          scale: 1,
          duration: 1.05,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: '.home-lookbook__grid', start: 'top 86%', once: true },
        });
      }

      const storeImage = document.querySelector('.home-store-story__media img');
      if (storeImage && window.matchMedia('(min-width: 768px)').matches) {
        gsap.fromTo(storeImage, { scale: 1.07, yPercent: -2 }, {
          scale: 1.07,
          yPercent: 2,
          ease: 'none',
          scrollTrigger: {
            trigger: '.home-store-story',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    });
  } catch {
    pageGsapContext?.revert();
    pageGsapContext = null;
    try {
      gsap.set(document.querySelectorAll('.gs-reveal, .footer-newsletter, .footer-grid > *, .home-values__item, .home-category-card, .home-product-reveal, .home-lookbook-card, .home-lookbook-card img, .home-editorial__image, .home-editorial__copy, .home-knitwear__image, .home-knitwear__copy, .home-store-story__media, .home-store-story__content, .home-store-story__media img'), { clearProps: 'all' });
    } catch {
      // CSS keeps all reveal targets visible if GSAP cannot initialize.
    }
  }
}

function handleActionClick(actionBtn) {
  const action = actionBtn.dataset.action;

  switch (action) {
    case 'close-overlays': {
      closeAllOverlays();
      break;
    }

    case 'open-mobile-menu': {
      closeAllOverlays();
      state.isMobileNavOpen = true;
      renderOverlaysAndBadges();
      break;
    }

    case 'toggle-header-search': {
      state.isHeaderSearchOpen = !state.isHeaderSearchOpen;
      const bar = document.getElementById('header-search-bar');
      if (bar) {
        bar.classList.toggle('is-open', state.isHeaderSearchOpen);
      }
      if (state.isHeaderSearchOpen) {
        const input = document.getElementById('global-header-search-input');
        if (input) input.focus();
      }
      break;
    }

    case 'open-cart': {
      closeAllOverlays();
      state.isCartOpen = true;
      renderOverlaysAndBadges();
      break;
    }

    // Collection Filters
    case 'open-collection-filter-drawer': {
      closeAllOverlays();
      state.isCollectionFilterDrawerOpen = true;
      renderOverlaysAndBadges();
      break;
    }

    case 'set-collection-category': {
      state.collectionCriteria.filter = actionBtn.dataset.value || 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'set-collection-price': {
      state.collectionCriteria.priceRange = actionBtn.dataset.value || 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'set-collection-size': {
      state.collectionCriteria.size = actionBtn.dataset.value || 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'toggle-collection-stock': {
      state.collectionCriteria.inStockOnly = !state.collectionCriteria.inStockOnly;
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'clear-filter-category': {
      state.collectionCriteria.filter = 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'clear-filter-price': {
      state.collectionCriteria.priceRange = 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'clear-filter-size': {
      state.collectionCriteria.size = 'all';
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'clear-filter-stock': {
      state.collectionCriteria.inStockOnly = false;
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    case 'clear-collection-filters': {
      state.collectionCriteria = {
        filter: 'all',
        priceRange: 'all',
        size: 'all',
        inStockOnly: false,
        sortBy: 'featured',
        query: '',
      };
      syncCollectionUrl();
      refreshMainContentOnly();
      break;
    }

    // Quick-Add / Wishlist
    case 'quick-add':
    case 'add-to-bag': {
      const productId = actionBtn.dataset.productId;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      const defaultSize = (product.sizes && product.sizes[0]) || 'Free Size';
      const colors = product.colors || product.availableColors || [];
      const defaultColor = colors[0] || 'Standard';

      state.cart = addItemToCartList(state.cart, PRODUCTS, {
        productId: product.id,
        size: defaultSize,
        color: defaultColor,
        quantity: 1,
      });
      saveCart(state.cart);
      closeAllOverlays();
      state.isCartOpen = true;
      renderOverlaysAndBadges();
      showToast(`Added "${product.name}" (${defaultSize}) to Shopping Bag`);
      break;
    }

    case 'wishlist-move-to-bag': {
      const productId = actionBtn.dataset.productId;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      const defaultSize = (product.sizes && product.sizes[0]) || 'Free Size';
      const colors = product.colors || product.availableColors || [];
      const defaultColor = colors[0] || 'Standard';

      state.cart = addItemToCartList(state.cart, PRODUCTS, {
        productId: product.id,
        size: defaultSize,
        color: defaultColor,
        quantity: 1,
      });
      saveCart(state.cart);
      state.wishlist = toggleWishlistList(state.wishlist, product.id, PRODUCTS);
      saveWishlist(state.wishlist);
      refreshMainContentOnly();
      showToast(`Moved "${product.name}" to Shopping Bag`);
      break;
    }

    case 'toggle-wishlist': {
      const productId = actionBtn.dataset.productId;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      const wasWishlisted = state.wishlist.includes(productId);
      state.wishlist = toggleWishlistList(state.wishlist, productId, PRODUCTS);
      const isAdded = !wasWishlisted && state.wishlist.includes(productId);
      saveWishlist(state.wishlist);

      if (state.page === 'wishlist' || state.page === 'product') {
        refreshMainContentOnly();
      } else {
        document
          .querySelectorAll(
            `[data-action="toggle-wishlist"][data-product-id="${productId}"]`
          )
          .forEach((btn) => {
            btn.classList.toggle('is-wishlisted', isAdded);
            btn.setAttribute('aria-pressed', isAdded ? 'true' : 'false');
          });
        renderOverlaysAndBadges();
      }

      showToast(
        isAdded
          ? `Saved "${product.name}" to Wishlist`
          : `Removed "${product.name}" from Wishlist`
      );
      break;
    }

    // Quick View Modal
    case 'open-quick-view': {
      const productId = actionBtn.dataset.productId;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      closeAllOverlays();
      const colors = product.colors || product.availableColors || [];
      state.quickView = {
        productId: product.id,
        selectedImageIndex: 0,
        selectedSize: (product.sizes && product.sizes[0]) || 'Free Size',
        selectedColor: colors[0] || 'Standard',
        quantity: 1,
      };
      renderOverlaysAndBadges();
      break;
    }

    case 'pdp-select-image': {
      state.quickView.selectedImageIndex =
        Number(actionBtn.dataset.imageIndex) || 0;
      renderOverlaysAndBadges();
      break;
    }

    case 'pdp-select-size': {
      state.quickView.selectedSize = actionBtn.dataset.size || 'Free Size';
      renderOverlaysAndBadges();
      break;
    }

    case 'pdp-select-color': {
      state.quickView.selectedColor = actionBtn.dataset.color || 'Standard';
      renderOverlaysAndBadges();
      break;
    }

    case 'pdp-add-to-bag': {
      const productId = actionBtn.dataset.productId;
      const product = PRODUCTS.find((p) => p.id === productId);
      if (!product) return;

      state.cart = addItemToCartList(state.cart, PRODUCTS, {
        productId: product.id,
        size: state.quickView.selectedSize || product.sizes[0] || 'Free Size',
        color:
          state.quickView.selectedColor ||
          (product.colors && product.colors[0]) ||
          'Standard',
        quantity: state.quickView.quantity || 1,
      });
      saveCart(state.cart);
      closeAllOverlays();
      state.isCartOpen = true;
      renderOverlaysAndBadges();
      showToast(
        `Added ${state.quickView.quantity || 1} × "${product.name}" to Shopping Bag`
      );
      break;
    }

    // Dedicated Product Detail Page (product.html) actions
    case 'page-pdp-select-image': {
      state.pdpPageState.imageIndex = Number(actionBtn.dataset.imageIndex) || 0;
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-prev-img': {
      const product = findProductByHandleOrId(state.pdpHandle);
      if (!product || !product.images?.length) return;
      const count = product.images.length;
      state.pdpPageState.imageIndex =
        (state.pdpPageState.imageIndex - 1 + count) % count;
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-next-img': {
      const product = findProductByHandleOrId(state.pdpHandle);
      if (!product || !product.images?.length) return;
      const count = product.images.length;
      state.pdpPageState.imageIndex =
        (state.pdpPageState.imageIndex + 1) % count;
      refreshMainContentOnly();
      break;
    }

    case 'open-lightbox': {
      state.lightboxImage = actionBtn.dataset.imageSrc || '';
      renderOverlaysAndBadges();
      break;
    }

    case 'page-pdp-select-size': {
      state.pdpPageState.size = actionBtn.dataset.size || 'Free Size';
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-select-color': {
      state.pdpPageState.color = actionBtn.dataset.color || 'Standard';
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-qty-dec': {
      state.pdpPageState.quantity = Math.max(
        1,
        (state.pdpPageState.quantity || 1) - 1
      );
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-qty-inc': {
      state.pdpPageState.quantity = Math.min(
        20,
        (state.pdpPageState.quantity || 1) + 1
      );
      refreshMainContentOnly();
      break;
    }

    case 'page-pdp-add-to-bag': {
      const product = findProductByHandleOrId(state.pdpHandle);
      if (!product) return;

      const size =
        state.pdpPageState.size ||
        (product.sizes && product.sizes[0]) ||
        'Free Size';
      const colors = product.colors || product.availableColors || [];
      const color = state.pdpPageState.color || colors[0] || 'Standard';
      const qty = Math.max(1, Number(state.pdpPageState.quantity) || 1);

      state.cart = addItemToCartList(state.cart, PRODUCTS, {
        productId: product.id,
        size,
        color,
        quantity: qty,
      });
      saveCart(state.cart);
      closeAllOverlays();
      state.isCartOpen = true;
      renderOverlaysAndBadges();
      showToast(`Added ${qty} × "${product.name}" (${size}) to Shopping Bag`);
      break;
    }

    case 'toggle-pdp-accordion': {
      const key = actionBtn.dataset.accKey || '';
      state.pdpPageState.openAccordion =
        state.pdpPageState.openAccordion === key ? '' : key;
      refreshMainContentOnly();
      break;
    }

    // Cart Drawer & Cart Page Quantity / Removal
    case 'cart-qty-inc': {
      const lineKey = actionBtn.dataset.lineKey;
      const existing = state.cart.find((item) => item.key === lineKey);
      if (!existing) return;
      state.cart = updateCartListQuantity(
        state.cart,
        lineKey,
        existing.quantity + 1
      );
      saveCart(state.cart);
      if (state.page === 'cart') refreshMainContentOnly();
      else renderOverlaysAndBadges();
      break;
    }

    case 'cart-qty-dec': {
      const lineKey = actionBtn.dataset.lineKey;
      const existing = state.cart.find((item) => item.key === lineKey);
      if (!existing) return;
      state.cart = updateCartListQuantity(
        state.cart,
        lineKey,
        existing.quantity - 1
      );
      saveCart(state.cart);
      if (state.page === 'cart') refreshMainContentOnly();
      else renderOverlaysAndBadges();
      break;
    }

    case 'cart-remove-item': {
      const lineKey = actionBtn.dataset.lineKey;
      state.cart = removeCartListItem(state.cart, lineKey);
      saveCart(state.cart);
      if (state.page === 'cart') refreshMainContentOnly();
      else renderOverlaysAndBadges();
      showToast('Item removed from Shopping Bag');
      break;
    }

    case 'open-checkout': {
      if (state.cart.length === 0) return;
      closeAllOverlays();
      state.isCheckoutOpen = true;
      state.checkoutConfirmed = null;
      state.checkoutError = '';
      renderOverlaysAndBadges();
      break;
    }

    case 'open-reel': {
      const reelId = actionBtn.dataset.reelId;
      if (!reelId) return;
      closeAllOverlays();
      state.activeReelId = reelId;
      renderOverlaysAndBadges();
      break;
    }

    case 'toggle-faq-item': {
      const faqId = actionBtn.dataset.faqId || '';
      state.openFaqId = state.openFaqId === faqId ? '' : faqId;
      refreshMainContentOnly();
      break;
    }

    case 'reset-contact-form': {
      state.contactState = {
        submitted: false,
        name: '',
        subject: '',
        error: '',
      };
      refreshMainContentOnly();
      break;
    }

    default:
      break;
  }
}

function attachEventListeners() {
  document.addEventListener('click', (event) => {
    const actionBtn = event.target.closest('[data-action]');
    if (!actionBtn) return;
    // Allow checkboxes to toggle via click handler cleanly
    if (actionBtn.tagName !== 'A') {
      event.preventDefault();
    }
    handleActionClick(actionBtn);
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'search-page-input') {
      state.searchPageQuery = event.target.value;
      const params = new URLSearchParams(window.location.search);
      if (state.searchPageQuery.trim()) {
        params.set('q', state.searchPageQuery.trim());
      } else {
        params.delete('q');
      }
      const qs = params.toString();
      window.history.replaceState(
        {},
        '',
        qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      );
      syncDocumentMetadata();

      // Re-render search results while preserving input focus and cursor position
      const selectionStart = event.target.selectionStart;
      refreshMainContentOnly();
      const nextInput = document.getElementById('search-page-input');
      if (nextInput) {
        nextInput.focus();
        if (typeof selectionStart === 'number') {
          nextInput.setSelectionRange(selectionStart, selectionStart);
        }
      }
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.id === 'collection-sort-select') {
      state.collectionCriteria.sortBy = event.target.value;
      syncCollectionUrl();
      refreshMainContentOnly();
    }
  });

  document.addEventListener('submit', (event) => {
    // 1. Demo Checkout Form
    if (event.target.id === 'demo-checkout-form') {
      event.preventDefault();
      const formData = new FormData(event.target);
      const customerName = String(formData.get('customerName') || '').trim();
      const customerPhone = String(formData.get('customerPhone') || '').trim();
      const customerCity = String(formData.get('customerCity') || '').trim();

      if (!customerName || !customerPhone || !customerCity) {
        state.checkoutError =
          'Please complete all required fields (Name, Mobile Number, and Delivery City) to preview demo order confirmation.';
        renderOverlaysAndBadges();
        return;
      }

      const summary = calculateCartSummary(state.cart, PRODUCTS);
      state.checkoutConfirmed = {
        orderId: `GLS-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        itemCount: summary.itemCount,
        total: summary.subtotal,
      };
      state.checkoutError = '';
      state.cart = [];
      saveCart(state.cart);
      if (state.page === 'cart') refreshMainContentOnly();
      else renderOverlaysAndBadges();
      showToast('Demo Order Preview Confirmed!');
      return;
    }

    // 2. Newsletter Demo Form
    if (event.target.id === 'newsletter-demo-form') {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = String(formData.get('email') || '').trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!validEmail) {
        state.newsletterState = {
          submittedEmail: '',
          error: 'Please enter a valid email address (e.g. name@example.com).',
        };
        refreshMainContentOnly();
        return;
      }

      state.newsletterState = {
        submittedEmail: email,
        error: '',
      };
      refreshMainContentOnly();
      showToast('Demo Newsletter Subscription Confirmed');
      return;
    }

    // 3. Contact Demo Form
    if (event.target.id === 'contact-demo-form') {
      event.preventDefault();
      const formData = new FormData(event.target);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const subject = String(formData.get('subject') || '').trim();
      const message = String(formData.get('message') || '').trim();
      const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !validEmail || !subject || !message) {
        state.contactState = {
          submitted: false,
          name: '',
          subject: '',
          error:
            'Please fill in your name, a valid email address, subject, and message to test the inquiry form.',
        };
        refreshMainContentOnly();
        return;
      }

      state.contactState = {
        submitted: true,
        name,
        subject,
        error: '',
      };
      refreshMainContentOnly();
      showToast('Demo Inquiry Validated Successfully');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hasAnyOpenOverlay()) {
      closeAllOverlays();
    }
  });

  window.addEventListener(
    'scroll',
    () => {
      const header = document.getElementById('site-header');
      if (header) {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
      }
    },
    { passive: true }
  );
}

renderApp();
attachEventListeners();
initHomeCarousel();
initGsapAnimations();
