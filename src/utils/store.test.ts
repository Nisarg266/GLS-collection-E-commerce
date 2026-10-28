import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatINR,
  calculateDiscountPercent,
  calculateCartSummary,
  filterAndSortProducts,
} from './currency.js';
import {
  addItemToCartList,
  updateCartListQuantity,
  removeCartListItem,
  toggleWishlistList,
} from './storage.js';
import { PRODUCTS, findProductByHandleOrId } from '../data/products.js';
import { resolveCollectionMeta } from '../data/categories.js';

test('formatINR formats Indian Rupees accurately', () => {
  assert.equal(formatINR(199), '₹199');
  assert.equal(formatINR(1499), '₹1,499');
  assert.equal(formatINR(-50), '₹0');
});

test('calculateDiscountPercent returns accurate percentage savings', () => {
  assert.equal(calculateDiscountPercent(499, 999), 50);
  assert.equal(calculateDiscountPercent(500, 500), 0);
  assert.equal(calculateDiscountPercent(600, 400), 0);
});

test('findProductByHandleOrId resolves both URL handles and product IDs', () => {
  const cardigan = findProductByHandleOrId('cute-bow-cardigan');
  assert.ok(cardigan);
  assert.equal(cardigan.id, 'gls-prod-01');

  const cordSet = findProductByHandleOrId('kids-casual-cord-set');
  assert.ok(cordSet);
  assert.equal(cordSet.id, 'gls-prod-03');

  const missing = findProductByHandleOrId('non-existent-handle');
  assert.equal(missing, null);
});

test('resolveCollectionMeta maps URL category parameters cleanly', () => {
  assert.equal(resolveCollectionMeta('kidswear').name, 'Kidswear');
  assert.equal(resolveCollectionMeta('tops').name, 'Tops & Tees');
  assert.equal(resolveCollectionMeta('women').name, "Women's Collection");
  assert.equal(resolveCollectionMeta('unknown-cat').slug, 'all');
});

test('addItemToCartList, updateCartListQuantity, and calculateCartSummary work end-to-end', () => {
  let cart: any[] = [];
  cart = addItemToCartList(cart, PRODUCTS, {
    productId: 'gls-prod-01',
    size: 'S/M',
    color: 'Ivory Cream',
    quantity: 2,
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);

  cart = addItemToCartList(cart, PRODUCTS, {
    productId: 'gls-prod-01',
    size: 'S/M',
    color: 'Ivory Cream',
    quantity: 1,
  });
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);

  const summary = calculateCartSummary(cart, PRODUCTS);
  assert.equal(summary.itemCount, 3);
  assert.equal(summary.subtotal, 599 * 3);

  cart = updateCartListQuantity(cart, cart[0].key, 1);
  assert.equal(cart[0].quantity, 1);

  cart = removeCartListItem(cart, cart[0].key);
  assert.equal(cart.length, 0);
});

test('toggleWishlistList adds and removes valid product IDs', () => {
  let wishlist: string[] = [];
  wishlist = toggleWishlistList(wishlist, 'gls-prod-02', PRODUCTS);
  assert.deepEqual(wishlist, ['gls-prod-02']);

  wishlist = toggleWishlistList(wishlist, 'gls-prod-02', PRODUCTS);
  assert.deepEqual(wishlist, []);
});

test('filterAndSortProducts supports category slugs, price ranges, size filters, search, and sort', () => {
  const kidswear = filterAndSortProducts(PRODUCTS, { filter: 'kidswear' });
  assert.ok(kidswear.length >= 3);
  assert.ok(kidswear.every((p) => p.category === 'Kidswear'));

  const tops = filterAndSortProducts(PRODUCTS, { filter: 'tops' });
  assert.ok(tops.length >= 3);
  assert.ok(tops.every((p) => p.category === 'Tops & Tees'));

  const under300 = filterAndSortProducts(PRODUCTS, { priceRange: 'under-300' });
  assert.ok(under300.length >= 3);
  assert.ok(under300.every((p) => p.price < 300));

  const sizeM = filterAndSortProducts(PRODUCTS, { size: 'M' });
  assert.ok(sizeM.length >= 5);
  assert.ok(sizeM.every((p) => p.sizes.includes('M')));

  const searched = filterAndSortProducts(PRODUCTS, { query: 'cardigan' });
  assert.ok(searched.length >= 2);

  const sortedAsc = filterAndSortProducts(PRODUCTS, { sortBy: 'price-asc' });
  for (let i = 1; i < sortedAsc.length; i++) {
    assert.ok(sortedAsc[i].price >= sortedAsc[i - 1].price);
  }
});
