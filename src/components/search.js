import { formatINR, calculateDiscountPercent } from '../utils/currency.js';
import { renderIcon } from '../utils/icons.js';
import { BRAND_CONFIG } from '../data/categories.js';

export const COLLECTION_CATEGORY_OPTIONS = [
  { label: 'All Products', value: 'all' },
  { label: 'New Arrivals', value: 'new-arrivals' },
  { label: "Women's Collection", value: 'women' },
  { label: 'Kidswear', value: 'kidswear' },
  { label: 'Knitwear', value: 'knitwear' },
  { label: 'Tops & Tees', value: 'tops' },
  { label: 'Pants & Bottoms', value: 'pants' },
  { label: 'Dresses', value: 'dresses' },
];

export const PRICE_RANGE_OPTIONS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under ₹300', value: 'under-300' },
  { label: '₹300 – ₹500', value: '300-500' },
  { label: '₹500 – ₹1,000', value: '500-1000' },
  { label: 'Over ₹1,000', value: 'over-1000' },
];

export const SIZE_FILTER_OPTIONS = [
  'all',
  'Free Size',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '4-5Y',
  '6-7Y',
  '8-9Y',
  '10-12Y',
];

export function renderFilterGroupsHtml(criteria = {}) {
  const {
    filter = 'all',
    priceRange = 'all',
    size = 'all',
    inStockOnly = false,
  } = criteria;

  const catHtml = COLLECTION_CATEGORY_OPTIONS.map((opt) => {
    const isActive = String(filter).toLowerCase() === opt.value.toLowerCase();
    return `
      <button
        type="button"
        class="filter-radio-btn ${isActive ? 'is-active' : ''}"
        data-action="set-collection-category"
        data-value="${opt.value}"
      >
        <span>${opt.label}</span>
        ${isActive ? renderIcon('check', 14) : ''}
      </button>
    `;
  }).join('');

  const priceHtml = PRICE_RANGE_OPTIONS.map((opt) => {
    const isActive = priceRange === opt.value;
    return `
      <button
        type="button"
        class="filter-radio-btn ${isActive ? 'is-active' : ''}"
        data-action="set-collection-price"
        data-value="${opt.value}"
      >
        <span>${opt.label}</span>
        ${isActive ? renderIcon('check', 14) : ''}
      </button>
    `;
  }).join('');

  const sizeHtml = SIZE_FILTER_OPTIONS.map((sz) => {
    const isActive = size === sz;
    const label = sz === 'all' ? 'All Sizes' : sz;
    return `
      <button
        type="button"
        class="option-btn ${isActive ? 'is-selected' : ''}"
        style="min-height: 34px; padding: 0.25rem 0.65rem;"
        data-action="set-collection-size"
        data-value="${sz}"
      >
        ${label}
      </button>
    `;
  }).join('');

  return `
    <div class="filter-group">
      <h3 class="filter-group__title">Category</h3>
      <div class="filter-option-list">
        ${catHtml}
      </div>
    </div>

    <div class="filter-group">
      <h3 class="filter-group__title">Price Range (Sample INR)</h3>
      <div class="filter-option-list">
        ${priceHtml}
      </div>
    </div>

    <div class="filter-group">
      <h3 class="filter-group__title">Size</h3>
      <div class="option-choices">
        ${sizeHtml}
      </div>
    </div>

    <div class="filter-group">
      <h3 class="filter-group__title">Availability</h3>
      <label style="display: flex; align-items: center; gap: 0.5rem; font-size: var(--text-sm); cursor: pointer;">
        <input
          type="checkbox"
          data-action="toggle-collection-stock"
          ${inStockOnly ? 'checked' : ''}
        />
        <span>In Stock Only (Sample Inventory)</span>
      </label>
    </div>

    <button
      type="button"
      class="btn btn--outline btn--sm btn--full"
      data-action="clear-collection-filters"
    >
      Clear All Filters
    </button>
  `;
}

export function renderQuickViewModal({
  product = null,
  selectedImageIndex = 0,
  selectedSize = '',
  selectedColor = '',
  quantity = 1,
  wishlistIds = [],
} = {}) {
  if (!product) {
    return `<div class="modal-container" id="quick-view-modal" aria-hidden="true"></div>`;
  }

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ['/images/logo.png'];
  const safeIndex = Math.min(images.length - 1, Math.max(0, selectedImageIndex));
  const activeImage = images[safeIndex];
  const activeSize = selectedSize || product.sizes[0] || 'Free Size';
  const colors = product.colors || product.availableColors || [];
  const activeColor = selectedColor || colors[0] || 'Standard';
  const isWishlisted = wishlistIds.includes(product.id);
  const discountPct = calculateDiscountPercent(product.price, product.compareAtPrice);
  const productUrl = `/product.html?handle=${encodeURIComponent(product.handle)}`;

  return `
    <div
      class="modal-container is-open"
      id="quick-view-modal"
      role="dialog"
      aria-modal="true"
      aria-label="${product.name} quick view"
    >
      <div class="modal-card">
        <button
          type="button"
          class="modal-close-btn"
          data-action="close-overlays"
          aria-label="Close quick view"
        >
          ${renderIcon('close', 18)}
        </button>

        <div class="pdp-grid">
          <div class="pdp-gallery">
            <div class="pdp-main-img-wrap">
              <img
                src="${activeImage}"
                alt="${product.name}"
                class="pdp-main-img"
                referrerpolicy="no-referrer"
              />
            </div>
            ${
              images.length > 1
                ? `
                  <div class="pdp-thumbs" role="group" aria-label="Product gallery thumbnails">
                    ${images
                      .map(
                        (imgUrl, idx) => `
                        <button
                          type="button"
                          class="pdp-thumb-btn ${idx === safeIndex ? 'is-active' : ''}"
                          data-action="pdp-select-image"
                          data-image-index="${idx}"
                          aria-label="View image ${idx + 1} of ${images.length}"
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

          <div class="pdp-details">
            <div class="product-card__meta">
              <span>${product.category}</span>
              <span aria-hidden="true">·</span>
              <span>${product.inStock ? 'In Stock (Sample Demo)' : 'Out of Stock'}</span>
            </div>

            <h2 class="section-title" style="font-size: 1.7rem;">
              <a href="${productUrl}" class="product-card__title-link">${product.name}</a>
            </h2>

            <div class="product-card__price-row tabular-nums" style="margin-top: 0;">
              <span class="product-card__price" style="font-size: 1.35rem;">${formatINR(product.price)}</span>
              ${
                product.compareAtPrice && product.compareAtPrice > product.price
                  ? `<span class="product-card__compare" style="font-size: 0.95rem;">${formatINR(product.compareAtPrice)}</span>`
                  : ''
              }
              ${
                discountPct > 0
                  ? `<span class="product-card__discount">${discountPct}% off</span>`
                  : ''
              }
            </div>

            <p style="font-size: var(--text-sm); color: var(--color-text-secondary);">
              ${product.description}
            </p>

            ${
              product.sizes && product.sizes.length > 0
                ? `
                  <div class="option-group">
                    <span class="option-label">Select Size: <strong>${activeSize}</strong></span>
                    <div class="option-choices">
                      ${product.sizes
                        .map(
                          (size) => `
                          <button
                            type="button"
                            class="option-btn ${size === activeSize ? 'is-selected' : ''}"
                            data-action="pdp-select-size"
                            data-size="${size}"
                          >
                            ${size}
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
                    <span class="option-label">Select Color: <strong>${activeColor}</strong></span>
                    <div class="option-choices">
                      ${colors
                        .map(
                          (color) => `
                          <button
                            type="button"
                            class="option-btn ${color === activeColor ? 'is-selected' : ''}"
                            data-action="pdp-select-color"
                            data-color="${color}"
                          >
                            ${color}
                          </button>
                        `
                        )
                        .join('')}
                    </div>
                  </div>
                `
                : ''
            }

            <div style="display: flex; flex-wrap: wrap; gap: 0.65rem; padding-top: 0.4rem;">
              <button
                type="button"
                class="btn btn--primary"
                style="flex: 1 1 180px;"
                data-action="pdp-add-to-bag"
                data-product-id="${product.id}"
              >
                ${renderIcon('bag', 16)}
                <span>Add to Bag · ${formatINR(product.price * quantity)}</span>
              </button>

              <a href="${productUrl}" class="btn btn--outline">
                Full Product Details ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderReelModal({ reel = null } = {}) {
  if (!reel) {
    return `<div class="modal-container" id="reel-modal" aria-hidden="true"></div>`;
  }

  return `
    <div
      class="modal-container is-open"
      id="reel-modal"
      role="dialog"
      aria-modal="true"
      aria-label="${reel.title} Instagram Reel Preview"
    >
      <div class="modal-card modal-card--narrow" style="padding: var(--space-5); display: flex; flex-direction: column; gap: var(--space-4);">
        <button
          type="button"
          class="modal-close-btn"
          data-action="close-overlays"
          aria-label="Close video preview"
        >
          ${renderIcon('close', 18)}
        </button>

        <div>
          <span class="section-kicker">${BRAND_CONFIG.instagramHandle}</span>
          <h3 class="drawer__title">${reel.title}</h3>
          <p style="font-size: var(--text-xs); color: var(--color-text-muted);">${reel.caption}</p>
        </div>

        <div style="border-radius: var(--radius-xs); overflow: hidden; background: #000; aspect-ratio: 9 / 16; max-height: 60vh; margin-inline: auto;">
          <video
            src="${reel.videoUrl}"
            poster="${reel.thumbnail}"
            controls
            playsinline
            style="width: 100%; height: 100%; object-fit: contain;"
          ></video>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.65rem; justify-content: space-between;">
          <a
            href="/product.html?handle=${encodeURIComponent(reel.productHandle)}"
            class="btn btn--primary btn--sm"
          >
            View Featured Product
          </a>
          <a
            href="${BRAND_CONFIG.instagramUrl}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn--outline btn--sm"
          >
            ${renderIcon('instagram', 15)}
            <span>View on Instagram</span>
          </a>
        </div>
      </div>
    </div>
  `;
}
