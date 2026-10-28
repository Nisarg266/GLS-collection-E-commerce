import {
  BRAND_CONFIG,
  CATEGORIES,
  FAQ_ITEMS,
  resolveCollectionMeta,
} from '../data/categories.js';
import {
  PRODUCTS,
  INSTAGRAM_SHOWCASE,
  findProductByHandleOrId,
} from '../data/products.js';
import {
  formatINR,
  calculateDiscountPercent,
  calculateCartSummary,
  filterAndSortProducts,
} from '../utils/currency.js';
import { renderIcon } from '../utils/icons.js';
import { renderBreadcrumbs } from './header.js';
import { renderProductCard } from './product-card.js';
import { renderFilterGroupsHtml } from './search.js';

export function renderHomePage({ wishlist = [], newsletterState = {} } = {}) {
  const newArrivals = PRODUCTS.filter((p) => p.isNewArrival).slice(0, 8);
  const trendingBestsellers = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);

  const categoryCardsHtml = CATEGORIES.map(
    (cat) => `
      <a
        href="/collection.html?category=${encodeURIComponent(cat.slug)}"
        class="category-card gs-reveal"
        aria-label="Shop ${cat.name} — ${cat.subtitle}"
      >
        <div class="category-card__media">
          <img
            src="${cat.image}"
            alt="${cat.name}"
            class="category-card__img"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="category-card__body">
          <div>
            <h3 class="category-card__title">${cat.name}</h3>
            <p class="category-card__meta">${cat.subtitle}</p>
          </div>
          <span style="color: var(--color-accent); flex-shrink: 0;">
            ${renderIcon('arrowRight', 17)}
          </span>
        </div>
      </a>
    `
  ).join('');

  const instaCardsHtml = INSTAGRAM_SHOWCASE.map(
    (item) => `
      <button
        type="button"
        class="insta-card gs-reveal"
        data-action="open-reel"
        data-reel-id="${item.id}"
        aria-label="Watch reel preview: ${item.title}"
      >
        <img
          src="${item.thumbnail}"
          alt="${item.title}"
          class="insta-card__img"
          loading="lazy"
          referrerpolicy="no-referrer"
        />
        <div class="insta-card__overlay">
          <span class="insta-card__play" aria-hidden="true">
            ${renderIcon('play', 14)}
          </span>
          <div>
            <div class="insta-card__caption">${item.title}</div>
          </div>
        </div>
      </button>
    `
  ).join('');

  return `
    <!-- B. Premium Hero Campaign -->
    <section class="hero-section" aria-labelledby="hero-headline">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content gs-hero-text">
            <div class="hero-meta">
              <span class="hero-meta__accent">${BRAND_CONFIG.name}</span>
              <span aria-hidden="true">·</span>
              <span>LAW GARDEN, AHMEDABAD</span>
              <span aria-hidden="true">·</span>
              <span>SEASONAL SHOWCASE</span>
            </div>

            <h1 class="hero-title" id="hero-headline">
              Everyday Style, Beautifully Found.
            </h1>

            <p class="hero-subtitle">
              Fresh looks for every little moment. Explore 3D floral batwing knitwear, Korean crochet-collar shirts, fluid vacation dresses, and joyful kidswear.
            </p>

            <div class="hero-actions">
              <a
                href="/collection.html?category=new-arrivals"
                class="btn btn--accent"
              >
                <span>Shop New Arrivals</span>
                ${renderIcon('arrowRight', 16)}
              </a>
              <a
                href="/collections.html"
                class="btn btn--outline"
              >
                <span>Explore Collections</span>
              </a>
            </div>

            <div class="hero-highlights tabular-nums">
              <span><strong>${BRAND_CONFIG.tagline}</strong></span>
              <span aria-hidden="true">·</span>
              <span>${BRAND_CONFIG.subTagline}</span>
              <span aria-hidden="true">·</span>
              <span>Sample Demo Prices from ₹199</span>
            </div>
          </div>

          <div class="hero-media gs-hero-media">
            <picture class="hero-picture">
              <source media="(min-width: 768px)" srcset="${BRAND_CONFIG.assets.heroDesktop}" />
              <img
                src="${BRAND_CONFIG.assets.heroMobile}"
                alt="GLS Collection Featured Apparel on Hanger"
                class="hero-media__img"
                referrerpolicy="no-referrer"
              />
            </picture>
            <div class="hero-media__scrim">
              <span class="hero-media__caption-kicker">${BRAND_CONFIG.subTagline}</span>
              <p class="hero-media__caption-title">Curated Showroom Arrivals at Law Garden</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- C. Shop by Category -->
    <section class="section" id="categories-section" aria-labelledby="categories-heading">
      <div class="container">
        <div class="section-header--split gs-reveal">
          <div>
            <span class="section-kicker">CURATED DEPARTMENTS</span>
            <h2 class="section-title" id="categories-heading">Shop by Category</h2>
          </div>
          <a href="/collections.html" class="btn btn--outline btn--sm">
            <span>View All Collections</span>
            ${renderIcon('arrowRight', 15)}
          </a>
        </div>
        <div class="category-grid">
          ${categoryCardsHtml}
        </div>
      </div>
    </section>

    <!-- D. New Arrivals -->
    <section class="section section--surface" id="new-arrivals-section" aria-labelledby="new-arrivals-heading">
      <div class="container">
        <div class="section-header--split gs-reveal">
          <div>
            <span class="section-kicker">FRESH DROPS</span>
            <h2 class="section-title" id="new-arrivals-heading">New Arrivals</h2>
            <p class="section-subtitle">
              Discover our latest showroom additions across women’s knitwear, Korean tops, dresses, and children’s sets.
            </p>
          </div>
          <a href="/collection.html?category=new-arrivals" class="btn btn--primary btn--sm">
            <span>View All New Arrivals</span>
            ${renderIcon('arrowRight', 15)}
          </a>
        </div>

        <div class="product-grid">
          ${newArrivals
            .map((product) =>
              renderProductCard(product, {
                wishlistIds: wishlist,
                sectionPrefix: 'new-arrivals',
              })
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- E. Editorial Feature -->
    <section class="section" id="editorial-section" aria-labelledby="editorial-heading">
      <div class="container">
        <div class="editorial-split gs-reveal">
          <div class="editorial-media">
            <img
              src="${BRAND_CONFIG.assets.featuredEditorial}"
              alt="GLS Collection 3D Floral Knitwear & Seasonal Edit"
              class="editorial-media__img"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </div>
          <div class="editorial-body">
            <span class="section-kicker">SEASONAL EDITORIAL</span>
            <h2 class="section-title" id="editorial-heading">
              Tactile Knitwear &amp; Contemporary Silhouettes
            </h2>
            <p class="section-subtitle">
              Whether dressing for a relaxed afternoon outing, festive gathering, or family celebration, our curated racks pair statement textures—from 3D ribbon florals and pearl collars to breathable cotton-linen—with effortless everyday comfort.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; padding-top: 0.5rem;">
              <a href="/collection.html?category=knitwear" class="btn btn--accent">
                <span>Explore Knitwear Collection</span>
                ${renderIcon('arrowRight', 16)}
              </a>
              <a href="/product.html?handle=cute-bow-cardigan" class="btn btn--outline">
                Inspect Featured Cardigan
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- F. Featured / Trending Collection -->
    <section class="section section--muted" id="trending-section" aria-labelledby="trending-heading">
      <div class="container">
        <div class="section-header--split gs-reveal">
          <div>
            <span class="section-kicker">MOST LOVED PIECES</span>
            <h2 class="section-title" id="trending-heading">Trending in Showroom</h2>
          </div>
          <a href="/collection.html?category=all" class="btn btn--outline btn--sm">
            <span>Shop Complete Catalog (${PRODUCTS.length})</span>
            ${renderIcon('arrowRight', 15)}
          </a>
        </div>
        <div class="product-grid">
          ${trendingBestsellers
            .map((product) =>
              renderProductCard(product, {
                wishlistIds: wishlist,
                sectionPrefix: 'trending',
              })
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- G. Instagram Showcase -->
    <section class="section section--surface" id="instagram-section" aria-labelledby="instagram-heading">
      <div class="container">
        <div class="section-header--split gs-reveal">
          <div>
            <span class="section-kicker">INSTAGRAM-INSPIRED SHOWCASE</span>
            <h2 class="section-title" id="instagram-heading">
              ${BRAND_CONFIG.instagramHandle}
            </h2>
            <p class="section-subtitle">
              Curated visual grid using actual supplied showroom reels. Tap any tile to preview the reel video or open the official Instagram profile.
            </p>
          </div>
          <a
            href="${BRAND_CONFIG.instagramUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--accent btn--sm"
          >
            ${renderIcon('instagram', 16)}
            <span>Follow on Instagram</span>
            ${renderIcon('external', 14)}
          </a>
        </div>

        <div class="instagram-grid">
          ${instaCardsHtml}
        </div>
      </div>
    </section>

    <!-- H. Brand Introduction & I. Store Discovery -->
    <section class="section" id="store-discovery-section" aria-labelledby="brand-intro-heading">
      <div class="container">
        <div class="story-grid gs-reveal">
          <div class="info-panel">
            <span class="section-kicker">THE DESTINATION</span>
            <h2 class="section-title" id="brand-intro-heading">
              ${BRAND_CONFIG.tagline}. ${BRAND_CONFIG.subTagline}.
            </h2>
            <p style="color: var(--color-text-secondary);">
              Located in Law Garden, Ahmedabad, <strong>${BRAND_CONFIG.name}</strong> brings together fresh daily fashion across Kidswear, Cardigans &amp; Knitwear, Korean Tops, Linen Trousers, Kurtis, and Occasion Dresses.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: auto; padding-top: 0.5rem;">
              <a href="/about.html" class="btn btn--primary btn--sm">
                <span>Read About GLS COLLECTION</span>
                ${renderIcon('arrowRight', 15)}
              </a>
              <a href="/contact.html" class="btn btn--outline btn--sm">
                Contact &amp; Store Info
              </a>
            </div>
          </div>

          <div class="info-panel">
            <span class="section-kicker">VISIT OUR STORE</span>
            <h3 class="section-title" style="font-size: 1.75rem;">Law Garden Showroom</h3>
            <div class="store-details-list">
              <div>
                <div class="store-detail-item__label">Location Context</div>
                <div class="store-detail-item__value">${BRAND_CONFIG.locationContext}</div>
              </div>
              <div>
                <div class="store-detail-item__label">Showroom Hours</div>
                <div class="store-detail-item__value">${BRAND_CONFIG.storeHours}</div>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              <a
                href="${BRAND_CONFIG.googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn--accent btn--sm"
              >
                ${renderIcon('mapPin', 15)}
                <span>Open Location in Google Maps</span>
                ${renderIcon('external', 14)}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- J. Newsletter Demonstration -->
    <section class="section section--muted" aria-labelledby="newsletter-heading">
      <div class="container">
        <div class="newsletter-box gs-reveal">
          <span class="section-kicker">STAY IN THE LOOP (DEMO)</span>
          <h2 class="section-title" id="newsletter-heading" style="font-size: 1.9rem;">
            New Arrival Alerts &amp; Showroom Updates
          </h2>
          <p class="section-subtitle">
            Preview how shoppers can subscribe to receive notifications when new seasonal collections arrive at GLS COLLECTION.
          </p>
          ${
            newsletterState.submittedEmail
              ? `
                <div class="demo-mode-banner" role="status">
                  <strong>Demo Subscription Confirmed:</strong> Thank you! <em>${newsletterState.submittedEmail}</em> has been validated in this presentation preview (no external emails are sent in demo mode).
                </div>
              `
              : `
                <form id="newsletter-demo-form" class="newsletter-form" novalidate>
                  <label for="newsletter-email-input" class="sr-only">Email address</label>
                  <input
                    type="email"
                    id="newsletter-email-input"
                    name="email"
                    class="form-input"
                    style="flex: 1 1 220px;"
                    placeholder="Enter your email address..."
                    required
                  />
                  <button type="submit" class="btn btn--primary">
                    Subscribe (Demo)
                  </button>
                </form>
                ${
                  newsletterState.error
                    ? `<p style="font-size: 12px; color: var(--color-danger);" role="alert">${newsletterState.error}</p>`
                    : `<p style="font-size: 11px; color: var(--color-text-muted);">Demonstration feature — no real email list is stored remotely.</p>`
                }
              `
          }
        </div>
      </div>
    </section>
  `;
}

export function renderCollectionsPage() {
  const allTiles = [
    ...CATEGORIES.map((c) => ({
      name: c.name,
      slug: c.slug,
      subtitle: c.subtitle,
      description: c.description,
      image: c.image,
      count: filterAndSortProducts(PRODUCTS, { filter: c.slug }).length,
    })),
    {
      name: "Women's Collection",
      slug: 'women',
      subtitle: 'Complete Women’s Edit • Knitwear, Shirts, Dresses & Bottoms',
      description:
        'Explore our full women’s wardrobe spanning 3D floral sweaters, Korean shirts, cotton kurtis, linen trousers, and evening gowns.',
      image: BRAND_CONFIG.assets.featuredEditorial,
      count: filterAndSortProducts(PRODUCTS, { filter: 'women' }).length,
    },
    {
      name: 'Complete Store Catalog',
      slug: 'all',
      subtitle: 'Every Day, Something New • All Demo Products',
      description:
        'Browse every product across all departments in a single filterable view.',
      image: BRAND_CONFIG.assets.heroDesktop,
      count: PRODUCTS.length,
    },
  ];

  const tilesHtml = allTiles
    .map(
      (tile) => `
      <a
        href="/collection.html?category=${encodeURIComponent(tile.slug)}"
        class="category-card gs-reveal"
      >
        <div class="category-card__media">
          <img
            src="${tile.image}"
            alt="${tile.name}"
            class="category-card__img"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="category-card__body" style="align-items: flex-start; flex-direction: column; gap: 0.45rem;">
          <div style="display: flex; width: 100%; align-items: center; justify-content: space-between;">
            <h2 class="category-card__title">${tile.name}</h2>
            <span class="tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--color-accent);">
              ${tile.count} ${tile.count === 1 ? 'Style' : 'Styles'} →
            </span>
          </div>
          <p class="category-card__meta">${tile.description}</p>
        </div>
      </a>
    `
    )
    .join('');

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Explore Collections' },
    ])}

    <section class="section" aria-labelledby="collections-page-heading">
      <div class="container">
        <div class="section-header gs-reveal">
          <span class="section-kicker">GLS COLLECTION DEPARTMENTS</span>
          <h1 class="section-title" id="collections-page-heading">Explore Collections</h1>
          <p class="section-subtitle">
            Navigate our showroom departments—each curated to reflect the variety of styles featured at GLS COLLECTION in Law Garden.
          </p>
        </div>

        <div class="collections-page-grid">
          ${tilesHtml}
        </div>
      </div>
    </section>
  `;
}

export function renderSingleCollectionPage({
  collectionCriteria = {},
  wishlist = [],
} = {}) {
  const {
    filter = 'all',
    priceRange = 'all',
    size = 'all',
    inStockOnly = false,
    sortBy = 'featured',
  } = collectionCriteria;

  const meta = resolveCollectionMeta(filter);
  const matchingProducts = filterAndSortProducts(PRODUCTS, collectionCriteria);

  const activeChips = [];
  if (filter && filter !== 'all') {
    activeChips.push({
      label: `Category: ${meta.name}`,
      action: 'clear-filter-category',
    });
  }
  if (priceRange && priceRange !== 'all') {
    activeChips.push({
      label: `Price: ${priceRange}`,
      action: 'clear-filter-price',
    });
  }
  if (size && size !== 'all') {
    activeChips.push({
      label: `Size: ${size}`,
      action: 'clear-filter-size',
    });
  }
  if (inStockOnly) {
    activeChips.push({
      label: 'In Stock Only',
      action: 'clear-filter-stock',
    });
  }

  const chipsHtml =
    activeChips.length > 0
      ? `
        <div class="active-filter-bar">
          ${activeChips
            .map(
              (chip) => `
              <button
                type="button"
                class="active-filter-chip"
                data-action="${chip.action}"
                aria-label="Remove filter ${chip.label}"
              >
                <span>${chip.label}</span>
                ${renderIcon('close', 12)}
              </button>
            `
            )
            .join('')}
          <button
            type="button"
            class="remove-link-btn"
            data-action="clear-collection-filters"
          >
            Clear all
          </button>
        </div>
      `
      : '';

  const productGridHtml =
    matchingProducts.length === 0
      ? `
        <div class="empty-state">
          <h3 class="empty-state__title">No Matching Products in This Filter View</h3>
          <p class="empty-state__desc">
            Try clearing one or more active filters (such as size or price range) to view all available styles in this collection.
          </p>
          <button
            type="button"
            class="btn btn--primary btn--sm"
            data-action="clear-collection-filters"
          >
            Reset Collection Filters
          </button>
        </div>
      `
      : `
        <div class="product-grid" id="collection-product-grid">
          ${matchingProducts
            .map((product) =>
              renderProductCard(product, {
                wishlistIds: wishlist,
                sectionPrefix: 'collection',
              })
            )
            .join('')}
        </div>
      `;

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Collections', href: '/collections.html' },
      { label: meta.name },
    ])}

    <section class="section--compact" aria-labelledby="collection-title">
      <div class="container">
        <div class="section-header" style="margin-bottom: var(--space-6);">
          <span class="section-kicker">COLLECTION CATALOGUE</span>
          <h1 class="section-title" id="collection-title">${meta.name}</h1>
          <p class="section-subtitle">${meta.description || meta.subtitle}</p>
        </div>

        <div class="catalog-toolbar">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <button
              type="button"
              class="btn btn--outline btn--sm collection-mobile-filter-btn"
              data-action="open-collection-filter-drawer"
            >
              ${renderIcon('sliders', 15)}
              <span>Filter &amp; Refine</span>
            </button>
            <span class="tabular-nums" style="font-size: var(--text-xs); color: var(--color-text-muted);">
              Showing <strong>${matchingProducts.length}</strong> ${matchingProducts.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <label for="collection-sort-select" style="font-size: var(--text-xs); color: var(--color-text-muted);">Sort by:</label>
            <select id="collection-sort-select" class="sort-select" aria-label="Sort collection products">
              <option value="featured" ${sortBy === 'featured' ? 'selected' : ''}>Featured</option>
              <option value="newest" ${sortBy === 'newest' ? 'selected' : ''}>Newest Arrivals</option>
              <option value="price-asc" ${sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-desc" ${sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            </select>
          </div>
        </div>

        ${chipsHtml}

        <div class="collection-layout">
          <aside class="collection-sidebar" aria-label="Collection filters">
            ${renderFilterGroupsHtml(collectionCriteria)}
          </aside>

          <div>
            ${productGridHtml}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderProductDetailPage({
  handle = '',
  pdpState = {},
  wishlist = [],
} = {}) {
  const product = findProductByHandleOrId(handle);

  if (!product) {
    return `
      ${renderBreadcrumbs([
        { label: 'Home', href: '/index.html' },
        { label: 'Collections', href: '/collections.html' },
        { label: 'Product Not Found' },
      ])}
      <section class="section">
        <div class="container">
          <div class="empty-state">
            <span class="section-kicker">404 • PRODUCT NOT FOUND</span>
            <h1 class="empty-state__title">We Couldn't Find That Outfit</h1>
            <p class="empty-state__desc">
              The product handle "${String(handle || 'unknown')}" does not match any item in our current demo catalogue.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center;">
              <a href="/collections.html" class="btn btn--primary">Explore Collections</a>
              <a href="/index.html" class="btn btn--outline">Return to Homepage</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['/images/logo.png'];
  const safeImgIndex = Math.min(
    images.length - 1,
    Math.max(0, Number(pdpState.imageIndex) || 0)
  );
  const activeImage = images[safeImgIndex];
  const activeSize = pdpState.size || (product.sizes && product.sizes[0]) || 'Free Size';
  const colors = product.colors || product.availableColors || [];
  const activeColor = pdpState.color || colors[0] || 'Standard';
  const quantity = Math.max(1, Number(pdpState.quantity) || 1);
  const openAccordion = pdpState.openAccordion || 'details';
  const isWishlisted = wishlist.includes(product.id);
  const discountPct = calculateDiscountPercent(product.price, product.compareAtPrice);

  const relatedProducts = (product.relatedHandles || [])
    .map((h) => findProductByHandleOrId(h))
    .filter(Boolean)
    .slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const accordions = [
    {
      key: 'details',
      title: 'Product Details & Craftsmanship',
      body: `<ul style="list-style: disc; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.35rem;">${(
        product.details || [product.description]
      )
        .map((line) => `<li>${line}</li>`)
        .join('')}</ul>`,
    },
    {
      key: 'fit',
      title: 'Size & Fit Guidance',
      body: `<p>${product.sizeAndFit || 'Standard boutique sizing. Select your usual size.'}</p>`,
    },
    {
      key: 'shipping',
      title: 'Shipping & Store Pickup (Demo Policy)',
      body: `<p><strong>Illustrative Demo Information:</strong> In the live storefront, customers will be able to choose between Law Garden showroom pickup and standard courier shipping. Official delivery timelines and charges will be confirmed by GLS COLLECTION.</p>`,
    },
    {
      key: 'returns',
      title: 'Returns & Exchanges (Demo Policy)',
      body: `<p><strong>Illustrative Demo Information:</strong> Official exchange windows and tag/receipt conditions will be populated here once verified with the store management.</p>`,
    },
  ];

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: product.category, href: `/collection.html?category=${encodeURIComponent(product.categorySlug)}` },
      { label: product.name },
    ])}

    <section class="section--compact" aria-labelledby="pdp-product-title">
      <div class="container">
        <div class="pdp-page-layout">
          <!-- Left Column: Gallery -->
          <div class="pdp-gallery-sticky">
            <div class="pdp-main-stage">
              <img
                src="${activeImage}"
                alt="${product.name} — view ${safeImgIndex + 1}"
                class="pdp-main-img"
                referrerpolicy="no-referrer"
              />
              ${
                images.length > 1
                  ? `
                    <button
                      type="button"
                      class="pdp-stage-nav-btn pdp-stage-nav-btn--prev"
                      data-action="page-pdp-prev-img"
                      aria-label="Previous product image"
                    >
                      ${renderIcon('chevronLeft', 18)}
                    </button>
                    <button
                      type="button"
                      class="pdp-stage-nav-btn pdp-stage-nav-btn--next"
                      data-action="page-pdp-next-img"
                      aria-label="Next product image"
                    >
                      ${renderIcon('chevronRight', 18)}
                    </button>
                  `
                  : ''
              }
              <button
                type="button"
                class="pdp-zoom-btn"
                data-action="open-lightbox"
                data-image-src="${activeImage}"
                aria-label="Enlarge product image"
              >
                ${renderIcon('zoomIn', 14)}
                <span>Inspect Fabric</span>
              </button>
            </div>

            ${
              images.length > 1
                ? `
                  <div class="pdp-thumbs" role="group" aria-label="Product thumbnails">
                    ${images
                      .map(
                        (imgUrl, idx) => `
                        <button
                          type="button"
                          class="pdp-thumb-btn ${idx === safeImgIndex ? 'is-active' : ''}"
                          data-action="page-pdp-select-image"
                          data-image-index="${idx}"
                          aria-label="Select thumbnail ${idx + 1}"
                        >
                          <img src="${imgUrl}" alt="" class="pdp-thumb-img" referrerpolicy="no-referrer" />
                        </button>
                      `
                      )
                      .join('')}
                  </div>
                `
                : ''
            }
          </div>

          <!-- Right Column: Sticky Purchase Module -->
          <div class="pdp-info-sticky">
            <div class="product-card__meta">
              <span>${product.category}</span>
              <span aria-hidden="true">·</span>
              <span>${product.inStock ? 'In Stock (Sample Demo Inventory)' : 'Out of Stock'}</span>
              ${
                product.isNewArrival
                  ? `<span aria-hidden="true">·</span><span class="product-card__meta-highlight">New Arrival</span>`
                  : ''
              }
            </div>

            <h1 class="section-title" id="pdp-product-title" style="font-size: clamp(1.75rem, 2.6vw, 2.35rem);">
              ${product.name}
            </h1>

            <div class="product-card__price-row tabular-nums" style="margin-top: 0;">
              <span class="product-card__price" style="font-size: 1.55rem;">${formatINR(product.price)}</span>
              ${
                product.compareAtPrice && product.compareAtPrice > product.price
                  ? `<span class="product-card__compare" style="font-size: 1rem;">${formatINR(product.compareAtPrice)}</span>`
                  : ''
              }
              ${
                discountPct > 0
                  ? `<span class="product-card__discount">${discountPct}% off (Sample Pricing)</span>`
                  : ''
              }
            </div>

            <p style="font-size: var(--text-base); color: var(--color-text-secondary);">
              ${product.description}
            </p>

            ${
              product.sizes && product.sizes.length > 0
                ? `
                  <div class="option-group">
                    <span class="option-label">Size: <strong>${activeSize}</strong></span>
                    <div class="option-choices" role="radiogroup" aria-label="Select size">
                      ${product.sizes
                        .map(
                          (sz) => `
                          <button
                            type="button"
                            class="option-btn ${sz === activeSize ? 'is-selected' : ''}"
                            data-action="page-pdp-select-size"
                            data-size="${sz}"
                            aria-pressed="${sz === activeSize ? 'true' : 'false'}"
                          >
                            ${sz}
                          </button>
                        `
                        )
                        .join('')}
                    </div>
                  </div>
                `
                : ''
            }

            ${
              colors.length > 0
                ? `
                  <div class="option-group">
                    <span class="option-label">Color / Finish: <strong>${activeColor}</strong></span>
                    <div class="option-choices" role="radiogroup" aria-label="Select color">
                      ${colors
                        .map(
                          (clr) => `
                          <button
                            type="button"
                            class="option-btn ${clr === activeColor ? 'is-selected' : ''}"
                            data-action="page-pdp-select-color"
                            data-color="${clr}"
                            aria-pressed="${clr === activeColor ? 'true' : 'false'}"
                          >
                            ${clr}
                          </button>
                        `
                        )
                        .join('')}
                    </div>
                  </div>
                `
                : ''
            }

            <div class="option-group">
              <span class="option-label">Quantity</span>
              <div style="display: flex; align-items: center; gap: 0.85rem;">
                <div class="qty-stepper" role="group" aria-label="Select quantity">
                  <button
                    type="button"
                    class="qty-stepper__btn"
                    data-action="page-pdp-qty-dec"
                    aria-label="Decrease quantity"
                  >
                    ${renderIcon('minus', 14)}
                  </button>
                  <span class="qty-stepper__val">${quantity}</span>
                  <button
                    type="button"
                    class="qty-stepper__btn"
                    data-action="page-pdp-qty-inc"
                    aria-label="Increase quantity"
                  >
                    ${renderIcon('plus', 14)}
                  </button>
                </div>
                <span style="font-size: 12px; color: var(--color-text-muted);">
                  Sample inventory for presentation demo
                </span>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              <button
                type="button"
                class="btn btn--accent"
                style="flex: 1 1 220px;"
                data-action="page-pdp-add-to-bag"
                data-product-id="${product.id}"
              >
                ${renderIcon('bag', 17)}
                <span>Add to Bag · ${formatINR(product.price * quantity)}</span>
              </button>

              <button
                type="button"
                class="btn btn--outline"
                data-action="toggle-wishlist"
                data-product-id="${product.id}"
                aria-label="${isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}"
              >
                ${renderIcon('heart', 17)}
                <span>${isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            <!-- Supporting Accordions -->
            <div class="accordion-list">
              ${accordions
                .map((acc) => {
                  const isOpen = openAccordion === acc.key;
                  return `
                    <div class="accordion-item ${isOpen ? 'is-open' : ''}">
                      <button
                        type="button"
                        class="accordion-trigger"
                        data-action="toggle-pdp-accordion"
                        data-acc-key="${acc.key}"
                        aria-expanded="${isOpen ? 'true' : 'false'}"
                      >
                        <span>${acc.title}</span>
                        <span class="accordion-trigger__icon">${renderIcon('chevronDown', 16)}</span>
                      </button>
                      <div class="accordion-content">
                        ${acc.body}
                      </div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- You May Also Like -->
    <section class="section section--muted" aria-labelledby="related-heading">
      <div class="container">
        <div class="section-header--split">
          <div>
            <span class="section-kicker">COMPLETE THE LOOK</span>
            <h2 class="section-title" id="related-heading">You May Also Like</h2>
          </div>
          <a href="/collection.html?category=${encodeURIComponent(product.categorySlug)}" class="btn btn--outline btn--sm">
            <span>More in ${product.category}</span>
            ${renderIcon('arrowRight', 15)}
          </a>
        </div>
        <div class="product-grid">
          ${fallbackRelated
            .map((rel) =>
              renderProductCard(rel, {
                wishlistIds: wishlist,
                sectionPrefix: 'related',
              })
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

export function renderAboutPage() {
  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'About GLS COLLECTION' },
    ])}

    <section class="section" aria-labelledby="about-heading">
      <div class="container">
        <div class="story-grid" style="margin-bottom: var(--space-12);">
          <div class="info-panel">
            <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: var(--space-5); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border);">
              <img
                src="${BRAND_CONFIG.assets.logo}"
                alt="${BRAND_CONFIG.name} Emblem"
                style="width: 76px; height: 76px; object-fit: contain; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.08));"
                referrerpolicy="no-referrer"
              />
              <div>
                <span class="section-kicker">OFFICIAL BRAND IDENTITY</span>
                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--color-text); line-height: 1.15;">${BRAND_CONFIG.name}</div>
                <div style="font-size: var(--text-xs); color: var(--color-accent); font-weight: 600; margin-top: 2px;">${BRAND_CONFIG.tagline} • ${BRAND_CONFIG.subTagline}</div>
              </div>
            </div>
            <span class="section-kicker">BRAND INTRODUCTION</span>
            <h1 class="section-title" id="about-heading">Discover GLS COLLECTION</h1>
            <p style="font-size: var(--text-md); color: var(--color-text-secondary);">
              <strong>"${BRAND_CONFIG.tagline} — ${BRAND_CONFIG.subTagline}."</strong>
            </p>
            <p style="color: var(--color-text-secondary);">
              Based in <strong>${BRAND_CONFIG.locationContext}</strong>, GLS COLLECTION is a fashion clothing retail destination offering a continually refreshed assortment of everyday and seasonal styles for women and children.
            </p>
            <p style="color: var(--color-text-secondary);">
              Our showroom floor brings together contemporary knitwear, 3D floral sweater tops, Korean lace-collar shirts, breathable pure cotton kurtis, wide-leg linen trousers, evening dresses, and playful kidswear for ages 4 to 14 years.
            </p>
            <div class="editable-note">
              <strong>Presentation Note:</strong> In keeping with authentic representation, no unverified founding dates, manufacturing claims, or fabricated testimonials have been included. Official store background copy can be added directly by the client.
            </div>
          </div>

          <div class="info-panel" style="padding: var(--space-4);">
            <img
              src="${BRAND_CONFIG.assets.storefrontPhoto}"
              alt="${BRAND_CONFIG.name} Law Garden Showroom"
              style="width: 100%; height: 100%; min-height: 280px; object-fit: cover; border-radius: var(--radius-xs);"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>

        <div class="editorial-split" style="margin-bottom: var(--space-12);">
          <div class="editorial-media">
            <img
              src="${BRAND_CONFIG.assets.featuredEditorial}"
              alt="Everyday fashion curated at GLS Collection"
              class="editorial-media__img"
              loading="lazy"
              referrerpolicy="no-referrer"
            />
          </div>
          <div class="editorial-body">
            <span class="section-kicker">EVERYDAY DRESSING</span>
            <h2 class="section-title">Curated for Every Little Moment</h2>
            <p class="section-subtitle">
              From casual weekday essentials to weekend co-ord sets and celebration gowns, shoppers can explore each department online before visiting the Law Garden showroom or placing an order.
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.65rem; padding-top: 0.5rem;">
              <a href="/collection.html?category=new-arrivals" class="btn btn--accent btn--sm">New Arrivals</a>
              <a href="/collection.html?category=kidswear" class="btn btn--outline btn--sm">Kidswear</a>
              <a href="/collection.html?category=knitwear" class="btn btn--outline btn--sm">Knitwear</a>
              <a href="/collection.html?category=tops" class="btn btn--outline btn--sm">Tops &amp; Kurtis</a>
              <a href="/collection.html?category=dresses" class="btn btn--outline btn--sm">Dresses</a>
            </div>
          </div>
        </div>

        <div class="store-grid">
          <div class="info-panel">
            <span class="section-kicker">CONNECT ON INSTAGRAM</span>
            <h2 class="section-title" style="font-size: 1.75rem;">${BRAND_CONFIG.instagramHandle}</h2>
            <p style="color: var(--color-text-secondary);">
              Follow our official Instagram profile for daily reels showcasing newly unpacked styles, fabric close-ups, and showroom updates from Law Garden.
            </p>
            <a
              href="${BRAND_CONFIG.instagramUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--primary btn--sm"
              style="align-self: flex-start;"
            >
              ${renderIcon('instagram', 16)}
              <span>Visit Official Instagram</span>
              ${renderIcon('external', 14)}
            </a>
          </div>

          <div class="info-panel">
            <span class="section-kicker">SHOWROOM LOCATION</span>
            <h2 class="section-title" style="font-size: 1.75rem;">Visit Us in Law Garden</h2>
            <p style="color: var(--color-text-secondary);">
              ${BRAND_CONFIG.locationContext} · ${BRAND_CONFIG.storeHours}
            </p>
            <a
              href="${BRAND_CONFIG.googleMapsUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn--accent btn--sm"
              style="align-self: flex-start;"
            >
              ${renderIcon('mapPin', 16)}
              <span>Open Google Maps Location</span>
              ${renderIcon('external', 14)}
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderContactPage({ contactState = {} } = {}) {
  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Contact & Store Information' },
    ])}

    <section class="section" aria-labelledby="contact-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-kicker">GET IN TOUCH</span>
          <h1 class="section-title" id="contact-heading">Contact &amp; Showroom Information</h1>
          <p class="section-subtitle">
            Plan your visit to GLS COLLECTION in Law Garden, connect via Instagram, or preview our customer inquiry form below.
          </p>
        </div>

        <div class="store-grid">
          <div class="info-panel">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: var(--space-4); padding-bottom: var(--space-3); border-bottom: 1px solid var(--color-border);">
              <img
                src="${BRAND_CONFIG.assets.logo}"
                alt="${BRAND_CONFIG.name} Logo"
                style="width: 60px; height: 60px; object-fit: contain; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.06));"
                referrerpolicy="no-referrer"
              />
              <div>
                <span class="section-kicker">SHOWROOM DETAILS</span>
                <h2 class="section-title" style="font-size: 1.5rem; margin: 0;">${BRAND_CONFIG.name}</h2>
              </div>
            </div>

            <div class="store-details-list">
              <div>
                <div class="store-detail-item__label">Location Area</div>
                <div class="store-detail-item__value">${BRAND_CONFIG.locationLabel}</div>
              </div>
              <div>
                <div class="store-detail-item__label">Opening Hours</div>
                <div class="store-detail-item__value">${BRAND_CONFIG.storeHours}</div>
              </div>
              <div>
                <div class="store-detail-item__label">Phone / WhatsApp (Editable)</div>
                <div class="store-detail-item__value tabular-nums">${BRAND_CONFIG.contactPhone}</div>
              </div>
              <div>
                <div class="store-detail-item__label">Email Placeholder (Editable)</div>
                <div class="store-detail-item__value">${BRAND_CONFIG.contactEmail}</div>
              </div>
            </div>

            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
              <a
                href="${BRAND_CONFIG.googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn--accent"
              >
                ${renderIcon('mapPin', 16)}
                <span>Google Maps Location</span>
                ${renderIcon('external', 14)}
              </a>
              <a
                href="${BRAND_CONFIG.instagramUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn--outline"
              >
                ${renderIcon('instagram', 16)}
                <span>${BRAND_CONFIG.instagramHandle}</span>
              </a>
            </div>

            <div class="editable-note">
              <strong>Editable Placeholders:</strong> Exact street address, landmark details, and official customer care contact fields can be updated in <code>src/data/categories.js</code> prior to launch.
            </div>
          </div>

          <div class="info-panel">
            <span class="section-kicker">CUSTOMER INQUIRY PREVIEW</span>
            <h2 class="section-title" style="font-size: 1.75rem;">Send a Message (Demo)</h2>

            ${
              contactState.submitted
                ? `
                  <div class="demo-mode-banner" role="status">
                    <strong>Demo Inquiry Validated:</strong> Thank you, <strong>${contactState.name}</strong>! Your message regarding "<em>${contactState.subject}</em>" has been validated locally. Because this is a presentation demo, no message has been transmitted to a server.
                  </div>
                  <button
                    type="button"
                    class="btn btn--outline btn--sm"
                    data-action="reset-contact-form"
                    style="align-self: flex-start;"
                  >
                    Send Another Demo Inquiry
                  </button>
                `
                : `
                  ${
                    contactState.error
                      ? `<div style="padding: 0.65rem 0.85rem; background: #fef3f2; border: 1px solid #fecdca; color: var(--color-danger); font-size: 12px; border-radius: 4px;" role="alert">${contactState.error}</div>`
                      : ''
                  }
                  <form id="contact-demo-form" class="form-grid" novalidate>
                    <div class="form-field">
                      <label class="form-label" for="contact-name">Your Name *</label>
                      <input id="contact-name" name="name" type="text" class="form-input" placeholder="e.g. Ananya Shah" required />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="contact-email">Email Address *</label>
                      <input id="contact-email" name="email" type="email" class="form-input" placeholder="e.g. ananya@example.com" required />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="contact-subject">Subject *</label>
                      <input id="contact-subject" name="subject" type="text" class="form-input" placeholder="e.g. Size inquiry for 3D Floral Cardigan" required />
                    </div>
                    <div class="form-field">
                      <label class="form-label" for="contact-message">Message *</label>
                      <textarea id="contact-message" name="message" class="form-textarea" placeholder="Write your question or bulk/store inquiry..." required></textarea>
                    </div>
                    <button type="submit" class="btn btn--primary">
                      Submit Demo Inquiry
                    </button>
                    <p style="font-size: 11px; color: var(--color-text-muted);">
                      Demonstration form — validates inputs client-side without sending external emails.
                    </p>
                  </form>
                `
            }
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderSearchPage({ query = '', wishlist = [] } = {}) {
  const cleanQuery = String(query || '').trim();
  const results = filterAndSortProducts(PRODUCTS, {
    filter: 'all',
    query: cleanQuery,
    sortBy: 'featured',
  });

  const suggestedCategories = CATEGORIES.map(
    (c) => `
      <a
        href="/collection.html?category=${encodeURIComponent(c.slug)}"
        class="btn btn--outline btn--sm"
      >
        ${c.name}
      </a>
    `
  ).join('');

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Search Catalogue' },
    ])}

    <section class="section" aria-labelledby="search-page-heading">
      <div class="container">
        <div class="section-header">
          <span class="section-kicker">CATALOGUE SEARCH</span>
          <h1 class="section-title" id="search-page-heading">
            ${cleanQuery ? `Search Results for "${cleanQuery}"` : 'Search GLS COLLECTION'}
          </h1>
        </div>

        <div class="catalog-toolbar" style="margin-bottom: var(--space-6);">
          <div class="search-input-wrap" style="width: 100%;">
            <span class="search-input-wrap__icon">${renderIcon('search', 16)}</span>
            <label for="search-page-input" class="sr-only">Search by product name, category, color, or fabric</label>
            <input
              type="search"
              id="search-page-input"
              class="search-input"
              placeholder="Type to search cardigans, kidswear, linen pants, kurtis, gowns..."
              value="${cleanQuery.replace(/"/g, '&quot;')}"
              autocomplete="off"
            />
          </div>
          <span class="tabular-nums" style="font-size: var(--text-xs); color: var(--color-text-muted);">
            <strong>${results.length}</strong> matching ${results.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: var(--space-8);">
          <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Suggested Categories:</span>
          ${suggestedCategories}
        </div>

        ${
          results.length === 0
            ? `
              <div class="empty-state">
                <h2 class="empty-state__title">No Styles Match "${cleanQuery}"</h2>
                <p class="empty-state__desc">
                  Try searching for another term such as "Cardigan", "Korean", "Kids", "Linen", or "Dress", or explore all collections below.
                </p>
                <a href="/collections.html" class="btn btn--primary btn--sm">
                  Explore All Collections
                </a>
              </div>
            `
            : `
              <div class="product-grid" id="search-results-grid">
                ${results
                  .map((product) =>
                    renderProductCard(product, {
                      wishlistIds: wishlist,
                      sectionPrefix: 'search',
                    })
                  )
                  .join('')}
              </div>
            `
        }
      </div>
    </section>
  `;
}

export function renderCartPage({ cartItems = [] } = {}) {
  const summary = calculateCartSummary(cartItems, PRODUCTS);
  const threshold = BRAND_CONFIG.demoShippingThreshold || 999;
  const remaining = Math.max(0, threshold - summary.subtotal);
  const progressPct = Math.min(100, Math.round((summary.subtotal / threshold) * 100));

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Shopping Cart' },
    ])}

    <section class="section" aria-labelledby="cart-page-heading">
      <div class="container">
        <div class="section-header--split">
          <div>
            <span class="section-kicker">YOUR BAG</span>
            <h1 class="section-title" id="cart-page-heading">
              Shopping Cart (${summary.itemCount} ${summary.itemCount === 1 ? 'Item' : 'Items'})
            </h1>
          </div>
          <a href="/collections.html" class="btn btn--outline btn--sm">
            Continue Shopping
          </a>
        </div>

        ${
          summary.detailedItems.length === 0
            ? `
              <div class="empty-state">
                <div style="color: var(--color-text-muted);">${renderIcon('bag', 40)}</div>
                <h2 class="empty-state__title">Your Shopping Cart is Empty</h2>
                <p class="empty-state__desc">
                  You haven't added any outfits to your bag yet. Explore our collections to add your favorite styles.
                </p>
                <a href="/collections.html" class="btn btn--accent">
                  Explore Collections
                </a>
              </div>
            `
            : `
              <div class="cart-page-layout">
                <div class="info-panel">
                  <div style="padding: var(--space-3); background: var(--color-surface-muted); border-radius: var(--radius-xs); font-size: 12px;">
                    <div style="margin-bottom: 6px;">
                      ${
                        remaining === 0
                          ? `<strong>Demo Threshold Reached:</strong> Qualifies for illustrative free shipping (${formatINR(threshold)}+ demo rule).`
                          : `Add <strong>${formatINR(remaining)}</strong> more to reach the illustrative ${formatINR(threshold)} demo shipping threshold.`
                      }
                    </div>
                    <div style="height: 6px; background: var(--color-border); border-radius: 999px; overflow: hidden;">
                      <div style="height: 100%; width: ${progressPct}%; background: var(--color-accent);"></div>
                    </div>
                  </div>

                  <div class="cart-item-list">
                    ${summary.detailedItems
                      .map(
                        (item) => `
                        <div class="cart-item" data-line-key="${item.key}">
                          <a href="/product.html?handle=${encodeURIComponent(item.product.handle)}">
                            <img
                              src="${item.product.images[0]}"
                              alt="${item.product.name}"
                              class="cart-item__img"
                              referrerpolicy="no-referrer"
                            />
                          </a>
                          <div class="cart-item__info">
                            <a
                              href="/product.html?handle=${encodeURIComponent(item.product.handle)}"
                              class="cart-item__title"
                              style="font-size: var(--text-md);"
                            >
                              ${item.product.name}
                            </a>
                            <div class="cart-item__variant">
                              Category: ${item.product.category} · Size: <strong>${item.size}</strong> · Color: <strong>${item.color}</strong>
                            </div>
                            <div class="cart-item__price tabular-nums">
                              Unit Price: ${formatINR(item.product.price)} · Line Total: <strong>${formatINR(item.lineSubtotal)}</strong>
                            </div>
                            <div class="cart-item__actions">
                              <div class="qty-stepper" role="group" aria-label="Quantity for ${item.product.name}">
                                <button
                                  type="button"
                                  class="qty-stepper__btn"
                                  data-action="cart-qty-dec"
                                  data-line-key="${item.key}"
                                  aria-label="Decrease quantity of ${item.product.name}"
                                >
                                  ${renderIcon('minus', 13)}
                                </button>
                                <span class="qty-stepper__val">${item.quantity}</span>
                                <button
                                  type="button"
                                  class="qty-stepper__btn"
                                  data-action="cart-qty-inc"
                                  data-line-key="${item.key}"
                                  aria-label="Increase quantity of ${item.product.name}"
                                >
                                  ${renderIcon('plus', 13)}
                                </button>
                              </div>
                              <button
                                type="button"
                                class="remove-link-btn"
                                data-action="cart-remove-item"
                                data-line-key="${item.key}"
                              >
                                Remove Item
                              </button>
                            </div>
                          </div>
                        </div>
                      `
                      )
                      .join('')}
                  </div>
                </div>

                <div class="info-panel">
                  <span class="section-kicker">ORDER SUMMARY</span>
                  <h2 class="drawer__title">Bag Summary</h2>

                  <div class="cart-summary-row tabular-nums">
                    <span>Items (${summary.itemCount})</span>
                    <span>${formatINR(summary.subtotal)}</span>
                  </div>

                  ${
                    summary.totalSavings > 0
                      ? `
                        <div class="cart-summary-row tabular-nums" style="color: var(--color-success);">
                          <span>Compare-at Savings</span>
                          <span>−${formatINR(summary.totalSavings)}</span>
                        </div>
                      `
                      : ''
                  }

                  <div class="cart-summary-row">
                    <span>Delivery (Demo)</span>
                    <span style="font-size: var(--text-xs); color: var(--color-text-muted);">Calculated at Checkout / Store Pickup</span>
                  </div>

                  <div class="cart-summary-row cart-summary-row--total tabular-nums">
                    <span>Subtotal (Sample INR)</span>
                    <span>${formatINR(summary.subtotal)}</span>
                  </div>

                  <button
                    type="button"
                    class="btn btn--accent btn--full"
                    data-action="open-checkout"
                  >
                    <span>Proceed to Demo Checkout</span>
                    ${renderIcon('arrowRight', 16)}
                  </button>

                  <p style="font-size: 11px; color: var(--color-text-muted);">
                    Demonstration mode — no real payment is collected.
                  </p>
                </div>
              </div>
            `
        }
      </div>
    </section>
  `;
}

export function renderWishlistPage({ wishlist = [] } = {}) {
  const savedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Saved Wishlist' },
    ])}

    <section class="section" aria-labelledby="wishlist-page-heading">
      <div class="container">
        <div class="section-header--split">
          <div>
            <span class="section-kicker">SAVED FAVOURITES</span>
            <h1 class="section-title" id="wishlist-page-heading">
              Your Wishlist (${savedProducts.length})
            </h1>
          </div>
          <a href="/collections.html" class="btn btn--outline btn--sm">
            Continue Shopping
          </a>
        </div>

        ${
          savedProducts.length === 0
            ? `
              <div class="empty-state">
                <div style="color: var(--color-text-muted);">${renderIcon('heart', 40)}</div>
                <h2 class="empty-state__title">No Saved Styles Yet</h2>
                <p class="empty-state__desc">
                  Tap the heart icon on any product card or product detail page to save outfits here for easy comparison.
                </p>
                <a href="/collections.html" class="btn btn--accent">
                  Browse Collections
                </a>
              </div>
            `
            : `
              <div class="product-grid">
                ${savedProducts
                  .map(
                    (product) => `
                    <article class="product-card" data-product-id="${product.id}">
                      <div class="product-card__media">
                        <a href="/product.html?handle=${encodeURIComponent(product.handle)}">
                          <img
                            src="${product.images[0]}"
                            alt="${product.name}"
                            class="product-card__img"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                          />
                        </a>
                        <button
                          type="button"
                          class="product-card__wishlist-btn is-wishlisted"
                          data-action="toggle-wishlist"
                          data-product-id="${product.id}"
                          aria-label="Remove ${product.name} from wishlist"
                        >
                          ${renderIcon('heart', 16)}
                        </button>
                      </div>
                      <div class="product-card__body">
                        <div class="product-card__meta">${product.category}</div>
                        <h2 class="product-card__title">
                          <a href="/product.html?handle=${encodeURIComponent(product.handle)}" class="product-card__title-link">
                            ${product.name}
                          </a>
                        </h2>
                        <div class="product-card__price-row tabular-nums">
                          <span class="product-card__price">${formatINR(product.price)}</span>
                        </div>
                        <div class="product-card__footer" style="display: flex; flex-direction: column; gap: 0.45rem;">
                          <button
                            type="button"
                            class="btn btn--primary btn--sm btn--full"
                            data-action="wishlist-move-to-bag"
                            data-product-id="${product.id}"
                          >
                            ${renderIcon('bag', 14)}
                            <span>Move to Bag</span>
                          </button>
                          <button
                            type="button"
                            class="btn btn--outline btn--sm btn--full"
                            data-action="toggle-wishlist"
                            data-product-id="${product.id}"
                          >
                            Remove from Wishlist
                          </button>
                        </div>
                      </div>
                    </article>
                  `
                  )
                  .join('')}
              </div>
            `
        }
      </div>
    </section>
  `;
}

export function renderFaqPage({ openFaqId = 'faq-demo' } = {}) {
  const faqHtml = FAQ_ITEMS.map((item) => {
    const isOpen = openFaqId === item.id;
    return `
      <div class="accordion-item ${isOpen ? 'is-open' : ''}">
        <button
          type="button"
          class="accordion-trigger"
          data-action="toggle-faq-item"
          data-faq-id="${item.id}"
          aria-expanded="${isOpen ? 'true' : 'false'}"
        >
          <span>
            <span style="display: block; font-size: 11px; color: var(--color-accent); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">${item.category}</span>
            ${item.question}
          </span>
          <span class="accordion-trigger__icon">${renderIcon('chevronDown', 16)}</span>
        </button>
        <div class="accordion-content">
          <p>${item.answer}</p>
        </div>
      </div>
    `;
  }).join('');

  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Frequently Asked Questions' },
    ])}

    <section class="section" aria-labelledby="faq-heading">
      <div class="container" style="max-width: 860px;">
        <div class="section-header">
          <span class="section-kicker">HELP &amp; GUIDANCE</span>
          <h1 class="section-title" id="faq-heading">Frequently Asked Questions</h1>
          <p class="section-subtitle">
            Answers regarding product sizing, this interactive shopping demonstration, cart persistence, delivery, and contacting GLS COLLECTION.
          </p>
        </div>

        <div class="info-panel">
          <div class="accordion-list">
            ${faqHtml}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function renderPoliciesPage() {
  return `
    ${renderBreadcrumbs([
      { label: 'Home', href: '/index.html' },
      { label: 'Demo Store Policies' },
    ])}

    <section class="section" aria-labelledby="policies-heading">
      <div class="container" style="max-width: 920px;">
        <div class="section-header">
          <span class="section-kicker">ILLUSTRATIVE &amp; EDITABLE TEMPLATES</span>
          <h1 class="section-title" id="policies-heading">Store Policies (Demo)</h1>
          <p class="section-subtitle">
            The policy sections below are structured templates prepared for client review. None of the sample terms below are presented as verified official GLS COLLECTION rules until confirmed by store management.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          <article class="info-panel" id="policy-shipping">
            <span class="section-kicker">01 • SHIPPING &amp; PICKUP (ILLUSTRATIVE DEMO COPY)</span>
            <h2 class="drawer__title">Shipping &amp; In-Store Pickup Policy</h2>
            <p style="color: var(--color-text-secondary);">
              <strong>Editable Placeholder:</strong> Once e-commerce fulfillment is activated for GLS COLLECTION, this section will specify official dispatch hours from the Law Garden showroom, local Ahmedabad delivery options, pan-India courier partners, and verified shipping rates.
            </p>
          </article>

          <article class="info-panel" id="policy-returns">
            <span class="section-kicker">02 • RETURNS &amp; EXCHANGES (ILLUSTRATIVE DEMO COPY)</span>
            <h2 class="drawer__title">Return &amp; Exchange Policy</h2>
            <p style="color: var(--color-text-secondary);">
              <strong>Editable Placeholder:</strong> Official exchange eligibility windows, original tag &amp; invoice requirements, and size-exchange procedures will be inserted here exactly as approved by GLS COLLECTION.
            </p>
          </article>

          <article class="info-panel" id="policy-privacy">
            <span class="section-kicker">03 • PRIVACY NOTICE (ILLUSTRATIVE DEMO COPY)</span>
            <h2 class="drawer__title">Privacy Policy</h2>
            <p style="color: var(--color-text-secondary);">
              <strong>Demo Environment Note:</strong> This presentation website stores your Shopping Bag and Wishlist exclusively in your browser's local storage (<code>localStorage</code>) and does not transmit personal data or payment details to any external server.
            </p>
          </article>

          <article class="info-panel" id="policy-terms">
            <span class="section-kicker">04 • TERMS OF SERVICE (ILLUSTRATIVE DEMO COPY)</span>
            <h2 class="drawer__title">Terms of Use &amp; Presentation Disclaimer</h2>
            <p style="color: var(--color-text-secondary);">
              <strong>Client Presentation Disclaimer:</strong> All sample prices in Indian Rupees (₹), stock indicators, and promotional banners displayed across this demo website are illustrative examples created to demonstrate UI/UX and e-commerce capabilities for GLS COLLECTION.
            </p>
          </article>
        </div>
      </div>
    </section>
  `;
}
