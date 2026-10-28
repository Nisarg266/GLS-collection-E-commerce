const CART_STORAGE_KEY = 'gls_collection_demo_cart_v1';
const WISHLIST_STORAGE_KEY = 'gls_collection_demo_wishlist_v1';

/**
 * Generates a unique line-item key for a product + size + color combination.
 */
export function getCartLineKey(productId, size, color) {
  return `${productId}__${size || 'Default'}__${color || 'Default'}`;
}

/**
 * Pure helper: Adds or increments an item in a cart array after validating the product ID.
 */
export function addItemToCartList(cartList, products, payload) {
  const current = Array.isArray(cartList) ? [...cartList] : [];
  if (!payload || !payload.productId) return current;

  const product = Array.isArray(products)
    ? products.find((p) => p.id === payload.productId)
    : null;
  if (!product || !product.inStock) return current;

  const size = payload.size || (product.sizes && product.sizes[0]) || 'Free Size';
  const color = payload.color || (product.availableColors && product.availableColors[0]) || 'Standard';
  const addQty = Math.max(1, Math.min(20, Math.floor(Number(payload.quantity) || 1)));
  const key = getCartLineKey(product.id, size, color);

  const existingIndex = current.findIndex(
    (item) => getCartLineKey(item.productId, item.size, item.color) === key
  );

  if (existingIndex > -1) {
    const updatedQty = Math.min(99, current[existingIndex].quantity + addQty);
    current[existingIndex] = {
      ...current[existingIndex],
      quantity: updatedQty,
    };
  } else {
    current.push({
      key,
      productId: product.id,
      size,
      color,
      quantity: addQty,
    });
  }

  return current;
}

/**
 * Pure helper: Updates quantity for a specific cart line key, removing it if newQuantity <= 0.
 */
export function updateCartListQuantity(cartList, lineKey, newQuantity) {
  if (!Array.isArray(cartList)) return [];
  const parsed = Math.floor(Number(newQuantity));
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return cartList.filter((item) => item.key !== lineKey);
  }
  const clamped = Math.min(99, parsed);
  return cartList.map((item) =>
    item.key === lineKey ? { ...item, quantity: clamped } : item
  );
}

/**
 * Pure helper: Removes a cart line item by key.
 */
export function removeCartListItem(cartList, lineKey) {
  if (!Array.isArray(cartList)) return [];
  return cartList.filter((item) => item.key !== lineKey);
}

/**
 * Pure helper: Toggles a product ID in a wishlist array.
 */
export function toggleWishlistList(wishlistIds, productId, products) {
  const current = Array.isArray(wishlistIds) ? [...wishlistIds] : [];
  if (!productId) return current;

  if (Array.isArray(products) && !products.some((p) => p.id === productId)) {
    return current;
  }

  const idx = current.indexOf(productId);
  if (idx > -1) {
    current.splice(idx, 1);
  } else {
    current.push(productId);
  }
  return current;
}

/**
 * Loads persisted cart from localStorage safely.
 */
export function loadCart(products) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set((products || []).map((p) => p.id));
    return parsed.filter(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        validIds.has(item.productId) &&
        Number(item.quantity) > 0
    );
  } catch {
    return [];
  }
}

/**
 * Saves cart items to localStorage safely.
 */
export function saveCart(cartItems) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems || []));
  } catch {
    // Ignore storage quota errors in restricted browsing modes
  }
}

/**
 * Loads persisted wishlist IDs from localStorage safely.
 */
export function loadWishlist(products) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const validIds = new Set((products || []).map((p) => p.id));
    return parsed.filter((id) => typeof id === 'string' && validIds.has(id));
  } catch {
    return [];
  }
}

/**
 * Saves wishlist IDs to localStorage safely.
 */
export function saveWishlist(wishlistIds) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds || []));
  } catch {
    // Ignore storage quota errors
  }
}
