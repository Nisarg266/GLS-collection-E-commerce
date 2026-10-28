import { formatINR, calculateCartSummary } from '../utils/currency.js';
import { BRAND_CONFIG } from '../data/categories.js';
import { renderIcon } from '../utils/icons.js';

export function renderCartDrawer({ isOpen = false, cartItems = [], products = [] } = {}) {
  const summary = calculateCartSummary(cartItems, products);
  const threshold = BRAND_CONFIG.demoShippingThreshold || 999;
  const remainingForFreeShipping = Math.max(0, threshold - summary.subtotal);
  const progressPct = Math.min(100, Math.round((summary.subtotal / threshold) * 100));

  const itemsHtml =
    summary.detailedItems.length === 0
      ? `
        <div class="empty-state" style="border: none; padding-inline: 1rem;">
          <div style="color: var(--color-text-muted);">${renderIcon('bag', 36)}</div>
          <h3 class="empty-state__title">Your Shopping Bag is Empty</h3>
          <p class="empty-state__desc">
            Explore our latest Kidswear, Knitwear, Korean Tops, and Dresses to add your favourite pieces.
          </p>
          <a href="/collections.html" class="btn btn--primary btn--sm">
            Explore Collections
          </a>
        </div>
      `
      : `
        <div style="margin-bottom: var(--space-4); padding: var(--space-3); background: var(--color-surface-muted); border-radius: var(--radius-xs); font-size: 12px;">
          <div style="margin-bottom: 6px;">
            ${
              remainingForFreeShipping === 0
                ? `<strong>Unlocked:</strong> Demo complimentary shipping threshold reached!`
                : `Add <strong>${formatINR(remainingForFreeShipping)}</strong> more for demo free delivery threshold (Illustrative ${formatINR(threshold)} target)`
            }
          </div>
          <div style="height: 5px; background: var(--color-border); border-radius: 999px; overflow: hidden;">
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
                  >
                    ${item.product.name}
                  </a>
                  <div class="cart-item__variant">
                    Size: ${item.size} · Color: ${item.color}
                  </div>
                  <div class="cart-item__price tabular-nums">
                    ${formatINR(item.product.price)} × ${item.quantity} = <strong>${formatINR(item.lineSubtotal)}</strong>
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
                      aria-label="Remove ${item.product.name} from bag"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            `
            )
            .join('')}
        </div>
      `;

  return `
    <aside
      class="drawer ${isOpen ? 'is-open' : ''}"
      id="cart-drawer"
      aria-label="Shopping Bag"
      aria-hidden="${isOpen ? 'false' : 'true'}"
    >
      <div class="drawer__header">
        <h2 class="drawer__title">Shopping Bag (${summary.itemCount})</h2>
        <button
          type="button"
          class="icon-btn"
          data-action="close-overlays"
          aria-label="Close shopping bag"
        >
          ${renderIcon('close', 20)}
        </button>
      </div>

      <div class="drawer__body">
        ${itemsHtml}
      </div>

      ${
        summary.detailedItems.length > 0
          ? `
            <div class="drawer__footer">
              ${
                summary.totalSavings > 0
                  ? `
                    <div class="cart-summary-row tabular-nums" style="color: var(--color-success);">
                      <span>Estimated Savings</span>
                      <span>−${formatINR(summary.totalSavings)}</span>
                    </div>
                  `
                  : ''
              }
              <div class="cart-summary-row cart-summary-row--total tabular-nums">
                <span>Subtotal (Sample Pricing)</span>
                <span id="cart-subtotal-value">${formatINR(summary.subtotal)}</span>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <a href="/cart.html" class="btn btn--outline btn--sm btn--full">
                  View Cart Page
                </a>
                <button
                  type="button"
                  class="btn btn--accent btn--sm btn--full"
                  data-action="open-checkout"
                >
                  <span>Demo Checkout</span>
                </button>
              </div>
            </div>
          `
          : ''
      }
    </aside>
  `;
}

export function renderDemoCheckoutModal({
  isOpen = false,
  cartItems = [],
  products = [],
  orderConfirmed = null,
  formError = '',
} = {}) {
  if (!isOpen) {
    return `<div class="modal-container" id="checkout-modal" aria-hidden="true"></div>`;
  }

  const summary = calculateCartSummary(cartItems, products);

  const contentHtml = orderConfirmed
    ? `
      <div style="padding: var(--space-8); text-align: center; display: flex; flex-direction: column; align-items: center; gap: var(--space-4);">
        <div style="width: 52px; height: 52px; border-radius: 50%; background: var(--color-accent-soft); color: var(--color-accent); display: flex; align-items: center; justify-content: center;">
          ${renderIcon('check', 26)}
        </div>
        <span class="section-kicker">DEMO MODE • SIMULATED ORDER</span>
        <h2 class="section-title" style="font-size: 1.75rem;">Demo Order Preview Confirmed</h2>
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); max-width: 44ch;">
          Reference <strong>#${orderConfirmed.orderId}</strong> for <strong>${orderConfirmed.customerName}</strong> (${orderConfirmed.itemCount} items · ${formatINR(orderConfirmed.total)}).
          Because this is a client presentation demo, no real payment or order dispatch has been processed.
        </p>
        <div style="display: flex; gap: 0.75rem;">
          <a href="/collections.html" class="btn btn--primary" data-action="close-overlays">
            Continue Shopping
          </a>
        </div>
      </div>
    `
    : `
      <div style="padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4);">
        <div class="demo-mode-banner">
          <strong>DEMO MODE — CLIENT PRESENTATION ONLY:</strong> This screen demonstrates how customers will complete orders once payment gateway or WhatsApp/COD checkout is connected. Do not enter real financial details.
        </div>

        <div>
          <span class="section-kicker">GLS COLLECTION CHECKOUT</span>
          <h2 class="drawer__title" style="margin-top: 2px;">Complete Demo Order (${summary.itemCount} items · ${formatINR(summary.subtotal)})</h2>
        </div>

        ${
          formError
            ? `<div style="padding: 0.65rem 0.85rem; background: #fef3f2; border: 1px solid #fecdca; color: var(--color-danger); font-size: 12px; border-radius: 4px;" role="alert">${formError}</div>`
            : ''
        }

        <form id="demo-checkout-form" class="form-grid" novalidate>
          <div class="form-field">
            <label class="form-label" for="checkout-name">Full Name *</label>
            <input
              id="checkout-name"
              name="customerName"
              type="text"
              class="form-input"
              placeholder="e.g. Riya Patel"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="checkout-phone">Mobile / WhatsApp Number *</label>
            <input
              id="checkout-phone"
              name="customerPhone"
              type="tel"
              class="form-input"
              placeholder="e.g. 98765 43210"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="checkout-city">Delivery Area / City *</label>
            <input
              id="checkout-city"
              name="customerCity"
              type="text"
              class="form-input"
              placeholder="e.g. Law Garden, Ahmedabad"
              required
            />
          </div>

          <div class="form-field">
            <label class="form-label" for="checkout-method">Preferred Checkout Mode (Demo)</label>
            <select id="checkout-method" name="paymentMode" class="form-input">
              <option value="Store Pickup at Law Garden">Reserve for In-Store Pickup (Law Garden)</option>
              <option value="Cash on Delivery (Demo)">Cash on Delivery / UPI on Delivery (Demo)</option>
            </select>
          </div>

          <div class="cart-summary-row cart-summary-row--total tabular-nums">
            <span>Demo Order Total</span>
            <span>${formatINR(summary.subtotal)}</span>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; padding-top: 0.5rem;">
            <button type="button" class="btn btn--outline" data-action="close-overlays">
              Cancel
            </button>
            <button type="submit" class="btn btn--accent">
              Simulate Order Placement
            </button>
          </div>
        </form>
      </div>
    `;

  return `
    <div class="modal-container is-open" id="checkout-modal" role="dialog" aria-modal="true" aria-label="Demo Checkout">
      <div class="modal-card modal-card--narrow">
        <button
          type="button"
          class="modal-close-btn"
          data-action="close-overlays"
          aria-label="Close checkout dialog"
        >
          ${renderIcon('close', 18)}
        </button>
        ${contentHtml}
      </div>
    </div>
  `;
}
