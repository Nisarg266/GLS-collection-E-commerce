import { formatINR, calculateDiscountPercent } from '../utils/currency.js';
import { renderIcon } from '../utils/icons.js';

/**
 * Renders a single reusable product card linking to /product.html?handle=...
 * @param {object} product
 * @param {{wishlistIds?: Array<string>, sectionPrefix?: string, motionClass?: string}} options
 */
export function renderProductCard(product, options = {}) {
  const { wishlistIds = [], sectionPrefix = 'catalog', motionClass = '' } = options;
  const isWishlisted = wishlistIds.includes(product.id);
  const primaryImage = (product.images && product.images[0]) || '/images/logo.png';
  const secondaryImage =
    product.secondaryImage || (product.images && product.images[1]) || null;
  const discountPct = calculateDiscountPercent(product.price, product.compareAtPrice);
  const productUrl = `/product.html?handle=${encodeURIComponent(product.handle)}`;

  const metaParts = [product.category];
  if (product.isNewArrival) {
    metaParts.push('<span class="product-card__meta-highlight">New Arrival</span>');
  } else if (product.isBestseller) {
    metaParts.push('<span>Trending</span>');
  }

  return `
    <article class="product-card ${motionClass}" data-product-id="${product.id}" data-product-handle="${product.handle}">
      <div class="product-card__media">
        <a
          href="${productUrl}"
          aria-label="View ${product.name}"
        >
          <img
            src="${primaryImage}"
            alt="${product.name} — ${product.category}"
            class="product-card__img product-card__img--primary"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          ${
            secondaryImage
              ? `<img
                  src="${secondaryImage}"
                  alt="${product.name} alternate view"
                  class="product-card__img product-card__img--secondary"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                />`
              : ''
          }
        </a>

        <button
          type="button"
          class="product-card__wishlist-btn ${isWishlisted ? 'is-wishlisted' : ''}"
          data-action="toggle-wishlist"
          data-product-id="${product.id}"
          aria-label="${isWishlisted ? 'Remove' : 'Save'} ${product.name} ${isWishlisted ? 'from' : 'to'} wishlist"
          aria-pressed="${isWishlisted ? 'true' : 'false'}"
        >
          ${renderIcon('heart', 16)}
        </button>

        <button
          type="button"
          class="product-card__quickview-btn"
          data-action="open-quick-view"
          data-product-id="${product.id}"
          aria-label="Quick view ${product.name} (${sectionPrefix})"
        >
          ${renderIcon('eye', 14)}
          <span>Quick View</span>
        </button>
      </div>

      <div class="product-card__body">
        <div class="product-card__meta">
          ${metaParts.join('<span aria-hidden="true">·</span>')}
        </div>

        <h3 class="product-card__title">
          <a href="${productUrl}" class="product-card__title-link">
            ${product.name}
          </a>
        </h3>

        <div class="product-card__price-row tabular-nums">
          <span class="product-card__price">${formatINR(product.price)}</span>
          ${
            product.compareAtPrice && product.compareAtPrice > product.price
              ? `<span class="product-card__compare">${formatINR(product.compareAtPrice)}</span>`
              : ''
          }
          ${
            discountPct > 0
              ? `<span class="product-card__discount">${discountPct}% off</span>`
              : ''
          }
        </div>

        <div class="product-card__footer">
          <button
            type="button"
            class="btn btn--primary btn--sm btn--full"
            data-action="add-to-bag"
            data-product-id="${product.id}"
            aria-label="Add ${product.name} to bag"
          >
            ${renderIcon('bag', 14)}
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  `;
}
