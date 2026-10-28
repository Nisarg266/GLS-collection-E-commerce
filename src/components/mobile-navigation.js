import { BRAND_CONFIG } from '../data/categories.js';
import { PRIMARY_NAV_ITEMS } from './header.js';
import { renderIcon } from '../utils/icons.js';

export function renderMobileNavigationDrawer({ isOpen = false, activeNav = 'home' } = {}) {
  const linksHtml = PRIMARY_NAV_ITEMS.map((item) => {
    const isActive = activeNav === item.key;
    return `
      <li>
        <a
          href="${item.href}"
          class="btn ${isActive ? 'btn--accent' : 'btn--outline'} btn--full"
          style="justify-content: space-between;"
        >
          <span>${item.label}</span>
          ${renderIcon('arrowRight', 15)}
        </a>
      </li>
    `;
  }).join('');

  return `
    <aside
      class="drawer drawer--left ${isOpen ? 'is-open' : ''}"
      id="mobile-nav-drawer"
      aria-label="Mobile navigation menu"
      aria-hidden="${isOpen ? 'false' : 'true'}"
    >
      <div class="drawer__header">
        <a href="/index.html" class="brand-logo-link">
          <img
            src="${BRAND_CONFIG.assets.logo}"
            alt="${BRAND_CONFIG.name}"
            class="brand-logo-img"
            width="44"
            height="44"
            referrerpolicy="no-referrer"
          />
          <span class="drawer__title">${BRAND_CONFIG.name}</span>
        </a>
        <button
          type="button"
          class="icon-btn"
          data-action="close-overlays"
          aria-label="Close mobile menu"
        >
          ${renderIcon('close', 20)}
        </button>
      </div>

      <div class="drawer__body">
        <p class="section-kicker" style="margin-bottom: 0.75rem;">Browse Store</p>
        <ul style="display: flex; flex-direction: column; gap: 0.55rem; margin-bottom: 1.75rem;">
          ${linksHtml}
        </ul>

        <p class="section-kicker" style="margin-bottom: 0.75rem;">Customer Pages</p>
        <div style="display: flex; flex-direction: column; gap: 0.55rem;">
          <a href="/search.html" class="btn btn--outline btn--sm btn--full">Search Products</a>
          <a href="/wishlist.html" class="btn btn--outline btn--sm btn--full">Saved Wishlist</a>
          <a href="/cart.html" class="btn btn--outline btn--sm btn--full">Shopping Cart</a>
          <a href="/contact.html" class="btn btn--outline btn--sm btn--full">Contact &amp; Location</a>
          <a href="/faq.html" class="btn btn--outline btn--sm btn--full">FAQ</a>
          <a href="/policies.html" class="btn btn--outline btn--sm btn--full">Demo Policies</a>
        </div>
      </div>

      <div class="drawer__footer">
        <div style="font-size: 12px; color: var(--color-text-muted);">
          <div><strong>${BRAND_CONFIG.tagline}</strong></div>
          <div>${BRAND_CONFIG.locationContext}</div>
        </div>
        <a
          href="${BRAND_CONFIG.instagramUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--accent btn--sm btn--full"
        >
          ${renderIcon('instagram', 15)}
          <span>Follow ${BRAND_CONFIG.instagramHandle}</span>
        </a>
      </div>
    </aside>
  `;
}

export function renderMobileBottomNav({
  cartCount = 0,
  wishlistCount = 0,
  activeNav = 'home',
} = {}) {
  return `
    <nav class="mobile-bottom-nav" aria-label="Mobile quick actions">
      <a
        href="/index.html"
        class="mobile-bottom-nav__btn ${activeNav === 'home' ? 'is-active' : ''}"
        aria-label="Home"
      >
        ${renderIcon('home', 18)}
        <span>Home</span>
      </a>

      <a
        href="/search.html"
        class="mobile-bottom-nav__btn ${activeNav === 'search' ? 'is-active' : ''}"
        aria-label="Search catalog"
      >
        ${renderIcon('search', 18)}
        <span>Search</span>
      </a>

      <a
        href="/wishlist.html"
        class="mobile-bottom-nav__btn ${activeNav === 'wishlist' ? 'is-active' : ''}"
        aria-label="Wishlist (${wishlistCount})"
      >
        ${renderIcon('heart', 18)}
        <span>Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ''}</span>
      </a>

      <a
        href="/cart.html"
        class="mobile-bottom-nav__btn ${activeNav === 'cart' ? 'is-active' : ''}"
        aria-label="Shopping Bag (${cartCount})"
      >
        ${renderIcon('bag', 18)}
        <span>Bag${cartCount > 0 ? ` (${cartCount})` : ''}</span>
      </a>
    </nav>
  `;
}
