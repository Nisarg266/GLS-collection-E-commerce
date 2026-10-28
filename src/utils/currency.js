const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Formats a numeric amount into Indian Rupee format (e.g. ₹499, ₹1,499).
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  const num = Number(amount);
  if (!Number.isFinite(num) || num < 0) {
    return '₹0';
  }
  return inrFormatter.format(Math.round(num));
}

/**
 * Computes percentage savings when compareAtPrice > price.
 * @param {number} price
 * @param {number} [compareAtPrice]
 * @returns {number}
 */
export function calculateDiscountPercent(price, compareAtPrice) {
  const p = Number(price);
  const c = Number(compareAtPrice);
  if (!Number.isFinite(p) || !Number.isFinite(c) || c <= p || c <= 0) {
    return 0;
  }
  return Math.round(((c - p) / c) * 100);
}

/**
 * Calculates total item count, subtotal, and total savings for the shopping bag.
 * @param {Array<{productId: string, size: string, color: string, quantity: number}>} cartItems
 * @param {Array<object>} products
 */
export function calculateCartSummary(cartItems, products) {
  if (!Array.isArray(cartItems) || !Array.isArray(products)) {
    return { itemCount: 0, subtotal: 0, totalSavings: 0, detailedItems: [] };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  let itemCount = 0;
  let subtotal = 0;
  let totalSavings = 0;
  const detailedItems = [];

  for (const entry of cartItems) {
    const product = productMap.get(entry.productId);
    if (!product) continue;

    const qty = Math.max(1, Math.min(99, Math.floor(Number(entry.quantity) || 1)));
    const lineSubtotal = product.price * qty;
    const compareUnit =
      product.compareAtPrice && product.compareAtPrice > product.price
        ? product.compareAtPrice
        : product.price;
    const lineSavings = (compareUnit - product.price) * qty;

    itemCount += qty;
    subtotal += lineSubtotal;
    totalSavings += lineSavings;

    detailedItems.push({
      ...entry,
      quantity: qty,
      product,
      lineSubtotal,
      lineSavings,
    });
  }

  return {
    itemCount,
    subtotal,
    totalSavings,
    detailedItems,
  };
}

/**
 * Normalizes a category filter string into a canonical match key.
 */
export function matchesProductCategory(product, rawFilter) {
  const f = String(rawFilter || 'all').trim().toLowerCase();
  if (!f || f === 'all' || f === 'all products') return true;
  if (f === 'new-arrivals' || f === 'new arrivals' || f === 'new') {
    return Boolean(product.isNewArrival);
  }
  if (f === 'women' || f === "women's collection") {
    return String(product.department || '').toLowerCase() === 'women';
  }
  if (f === 'kidswear' || f === 'kids') {
    return (
      String(product.category || '').toLowerCase() === 'kidswear' ||
      String(product.categorySlug || '').toLowerCase() === 'kidswear'
    );
  }
  if (f === 'knitwear' || f === 'cardigans') {
    return (
      String(product.category || '').toLowerCase() === 'knitwear' ||
      String(product.categorySlug || '').toLowerCase() === 'knitwear'
    );
  }
  if (f === 'tops' || f === 'tops-tees' || f === 'tops & tees') {
    return (
      String(product.category || '').toLowerCase() === 'tops & tees' ||
      String(product.categorySlug || '').toLowerCase() === 'tops'
    );
  }
  if (f === 'pants' || f === 'pants-bottoms' || f === 'pants & bottoms' || f === 'bottoms') {
    return (
      String(product.category || '').toLowerCase() === 'pants & bottoms' ||
      String(product.categorySlug || '').toLowerCase() === 'pants'
    );
  }
  if (f === 'dresses' || f === 'one-piece') {
    return (
      String(product.category || '').toLowerCase() === 'dresses' ||
      String(product.categorySlug || '').toLowerCase() === 'dresses'
    );
  }
  return (
    String(product.category || '').toLowerCase() === f ||
    String(product.categorySlug || '').toLowerCase() === f
  );
}

/**
 * Filters and sorts a product list by category/department, price range, size, stock availability, search query, and sort mode.
 * @param {Array<object>} products
 * @param {{filter?: string, priceRange?: string, size?: string, inStockOnly?: boolean, query?: string, sortBy?: string}} criteria
 */
export function filterAndSortProducts(products, criteria = {}) {
  if (!Array.isArray(products)) return [];
  const {
    filter = 'all',
    priceRange = 'all',
    size = 'all',
    inStockOnly = false,
    query = '',
    sortBy = 'featured',
  } = criteria;

  const normalizedQuery = String(query || '').trim().toLowerCase();
  const normalizedSize = String(size || 'all').trim();

  let result = products.filter((product) => {
    if (!matchesProductCategory(product, filter)) {
      return false;
    }

    if (inStockOnly && !product.inStock) {
      return false;
    }

    if (priceRange && priceRange !== 'all') {
      if (priceRange === 'under-300' && product.price >= 300) return false;
      if (priceRange === '300-500' && (product.price < 300 || product.price > 500)) return false;
      if (priceRange === '500-1000' && (product.price <= 500 || product.price > 1000)) return false;
      if (priceRange === 'over-1000' && product.price <= 1000) return false;
    }

    if (normalizedSize && normalizedSize !== 'all') {
      const sizes = Array.isArray(product.sizes) ? product.sizes : [];
      if (!sizes.includes(normalizedSize)) return false;
    }

    if (normalizedQuery) {
      const searchable = [
        product.name,
        product.handle,
        product.category,
        product.department,
        product.description,
        ...(product.colors || product.availableColors || []),
        ...(product.details || []),
      ]
        .join(' ')
        .toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });

  result = [...result];

  if (sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    result.sort((a, b) => {
      if (a.isNewArrival !== b.isNewArrival) {
        return a.isNewArrival ? -1 : 1;
      }
      return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
    });
  } else {
    // 'featured' default
    result.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (a.isNewArrival !== b.isNewArrival) return a.isNewArrival ? -1 : 1;
      return 0;
    });
  }

  return result;
}
