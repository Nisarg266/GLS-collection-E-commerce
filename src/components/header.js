import { BRAND_CONFIG } from '../data/categories.js';
import { renderIcon } from '../utils/icons.js';

export const PRIMARY_NAV_ITEMS = [
  { key: 'home', label: 'Home', href: '/index.html' },
  { key: 'new-arrivals', label: 'New Arrivals', href: '/collection.html?category=new-arrivals' },
  { key: 'collections', label: 'Shop All', href: '/collections.html' },
  { key: 'kidswear', label: 'Kidswear', href: '/collection.html?category=kidswear' },
  { key: 'women', label: 'Women', href: '/collection.html?category=women' },
  { key: 'knitwear', label: 'Knitwear', href: '/collection.html?category=knitwear' },
  { key: 'about', label: 'About', href: '/about.html' },
];

export function renderAnnouncementBar() {
  return `
    <div class="announcement-bar animate-announcement" role="region" aria-label="Store announcement">
      <div class="container announcement-bar__inner">
        <span>NEW ARRIVALS</span>
        <span class="announcement-bar__sep" aria-hidden="true">•</span>
        <span class="announcement-bar__desktop-only">EVERYDAY STYLE AT LAW GARDEN</span>
        <span class="announcement-bar__sep announcement-bar__desktop-only" aria-hidden="true">•</span>
        <span>DISCOVER YOUR NEXT FAVOURITE</span>
      </div>
    </div>
  `;
}

export function renderHeader({
  activeNav = 'home',
  cartCount = 0,
  wishlistCount = 0,
  isSearchOpen = false,
  searchQuery = '',
} = {}) {
  const navLinksHtml = PRIMARY_NAV_ITEMS.map((item) => {
    const isActive = activeNav === item.key;
    return `
      <a
        href="${item.href}"
        class="desktop-nav__link ${isActive ? 'is-active' : ''}"
        ${isActive ? 'aria-current="page"' : ''}
      >
        ${item.label}
      </a>
    `;
  }).join('');

  return `
    <header class="site-header" id="site-header">
      <div class="container site-header__inner">
        <div class="header-brand-group">
          <button
            type="button"
            class="mobile-menu-btn"
            data-action="open-mobile-menu"
            aria-label="Open navigation menu"
          >
            ${renderIcon('menu', 21)}
          </button>
          <a href="/index.html" class="brand-logo-link" aria-label="${BRAND_CONFIG.name} Home">
            <img
              src="${BRAND_CONFIG.assets.logo}"
              alt="${BRAND_CONFIG.name} logo"
              class="brand-logo-img"
              width="50"
              height="50"
              referrerpolicy="no-referrer"
            />
            <span class="brand-wordmark">${BRAND_CONFIG.name}</span>
          </a>
        </div>

        <nav class="desktop-nav" aria-label="Primary navigation">
          ${navLinksHtml}
        </nav>

        <div class="header-actions">
          <button
            type="button"
            class="icon-btn"
            data-action="toggle-header-search"
            aria-label="Search products"
            aria-expanded="${isSearchOpen ? 'true' : 'false'}"
          >
            ${renderIcon('search', 19)}
          </button>

          <a
            href="/wishlist.html"
            class="icon-btn"
            aria-label="Saved wishlist (${wishlistCount} items)"
          >
            ${renderIcon('heart', 19)}
            <span
              class="icon-badge"
              id="header-wishlist-badge"
              ${wishlistCount === 0 ? 'hidden' : ''}
            >${wishlistCount}</span>
          </a>

          <button
            type="button"
            class="icon-btn"
            data-action="open-cart"
            aria-label="Open shopping bag (${cartCount} items)"
          >
            ${renderIcon('bag', 19)}
            <span
              class="icon-badge"
              id="header-cart-badge"
              ${cartCount === 0 ? 'hidden' : ''}
            >${cartCount}</span>
          </button>
        </div>
      </div>

      <div class="header-search-bar ${isSearchOpen ? 'is-open' : ''}" id="header-search-bar">
        <div class="container">
          <form action="/search.html" method="get" class="header-search-form" role="search">
            <div class="search-input-wrap">
              <span class="search-input-wrap__icon">${renderIcon('search', 16)}</span>
              <label for="global-header-search-input" class="sr-only">Search GLS COLLECTION catalog</label>
              <input
                type="search"
                id="global-header-search-input"
                name="q"
                class="search-input"
                placeholder="Search cardigans, kidswear, linen trousers, kurtis..."
                value="${String(searchQuery || '').replace(/"/g, '&quot;')}"
                autocomplete="off"
              />
            </div>
            <button type="submit" class="btn btn--primary btn--sm">Search</button>
            <button
              type="button"
              class="icon-btn"
              data-action="toggle-header-search"
              aria-label="Close search bar"
            >
              ${renderIcon('close', 18)}
            </button>
          </form>
        </div>
      </div>
    </header>
  `;
}

export function renderBreadcrumbs(items = []) {
  if (!Array.isArray(items) || items.length === 0) return '';
  const listHtml = items
    .map((item, idx) => {
      const isLast = idx === items.length - 1;
      if (isLast || !item.href) {
        return `<li><span class="breadcrumbs__current" aria-current="page">${item.label}</span></li>`;
      }
      return `
        <li>
          <a href="${item.href}" class="breadcrumbs__link">${item.label}</a>
        </li>
        <li aria-hidden="true">/</li>
      `;
    })
    .join('');

  return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <div class="container">
        <ol class="breadcrumbs__list">
          ${listHtml}
        </ol>
      </div>
    </nav>
  `;
}

export function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="/index.html" class="brand-logo-link" style="gap: 0.75rem;">
              <img
                src="${BRAND_CONFIG.assets.logo}"
                alt="${BRAND_CONFIG.name} logo"
                class="brand-logo-img brand-logo-img--footer"
                width="58"
                height="58"
                referrerpolicy="no-referrer"
              />
              <span class="brand-wordmark" style="color: #ffffff; font-size: 1.35rem; letter-spacing: 0.05em;">${BRAND_CONFIG.name}</span>
            </a>
            <p class="footer-brand-desc">
              ${BRAND_CONFIG.tagline} · ${BRAND_CONFIG.subTagline}. Fashion clothing retail destination in ${BRAND_CONFIG.locationContext}.
            </p>
          </div>

          <div>
            <h3 class="footer-heading">SHOP COLLECTIONS</h3>
            <ul class="footer-links">
              <li><a href="/collections.html" class="footer-link">Explore All Collections</a></li>
              <li><a href="/collection.html?category=new-arrivals" class="footer-link">New Arrivals</a></li>
              <li><a href="/collection.html?category=kidswear" class="footer-link">Kidswear (Ages 4–14)</a></li>
              <li><a href="/collection.html?category=knitwear" class="footer-link">Cardigans &amp; Knitwear</a></li>
              <li><a href="/collection.html?category=tops" class="footer-link">Tops, Shirts &amp; Kurtis</a></li>
              <li><a href="/collection.html?category=pants" class="footer-link">Trousers, Linen &amp; Joggers</a></li>
              <li><a href="/collection.html?category=dresses" class="footer-link">Midi Dresses &amp; Gowns</a></li>
            </ul>
          </div>

          <div>
            <h3 class="footer-heading">CUSTOMER CARE &amp; INFO</h3>
            <ul class="footer-links">
              <li><a href="/about.html" class="footer-link">About GLS COLLECTION</a></li>
              <li><a href="/contact.html" class="footer-link">Contact &amp; Store Location</a></li>
              <li><a href="/faq.html" class="footer-link">Frequently Asked Questions</a></li>
              <li><a href="/policies.html" class="footer-link">Store Policies (Demo)</a></li>
              <li><a href="/cart.html" class="footer-link">Shopping Bag</a></li>
              <li><a href="/wishlist.html" class="footer-link">Saved Wishlist</a></li>
            </ul>
          </div>

          <div>
            <h3 class="footer-heading">VISIT OUR SHOWROOM</h3>
            <ul class="footer-links">
              <li class="footer-link">${BRAND_CONFIG.locationContext}</li>
              <li class="footer-link">${BRAND_CONFIG.storeHours}</li>
              <li>
                <a href="${BRAND_CONFIG.googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="footer-link">
                  Open in Google Maps ↗
                </a>
              </li>
              <li>
                <a href="${BRAND_CONFIG.instagramUrl}" target="_blank" rel="noopener noreferrer" class="footer-link">
                  Instagram: ${BRAND_CONFIG.instagramHandle} ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${BRAND_CONFIG.name}. Multi-Page E-Commerce Presentation Demo.</span>
          <span>All sample prices (₹), sizes, and policies are illustrative placeholders for client review.</span>
        </div>
      </div>
    </footer>
  `;
}
