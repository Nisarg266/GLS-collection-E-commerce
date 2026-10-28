/**
 * Central Brand, Collection & Policy Configuration for GLS COLLECTION
 * Replace image paths or store details here without editing layout or page templates.
 */
export const BRAND_CONFIG = {
  name: 'GLS COLLECTION',
  tagline: 'Every Day, Something New',
  subTagline: 'Your One-Stop Fashion Destination',
  locationContext: 'Law Garden, Ahmedabad, Gujarat, India',
  instagramHandle: '@gls_collection_lawgarden',
  instagramUrl: 'https://www.instagram.com/gls_collection_lawgarden?rpxt=azIzdDAyeHpzdmo2',
  googleMapsUrl: 'https://maps.app.goo.gl/f5gHbxmje2qp2dBb9',
  storeHours: '11:00 AM – 12:00 AM (Daily • Editable)',
  contactPhone: '+91 85110 70243 (From Instagram Reference • Editable)',
  contactEmail: 'contact@glscollection-demo.example (Editable Placeholder)',
  locationLabel: 'Law Garden Area, Ahmedabad, Gujarat (Editable Street Address Placeholder)',
  demoShippingThreshold: 999,
  assets: {
    logo: '/images/logo.png',
    heroDesktop: '/images/hero-desktop.jpg',
    heroMobile: '/images/hero-mobile.jpg',
    featuredEditorial: '/images/featured-collection.jpg',
    storefrontPhoto: '/images/storefront.jpg',
    instagramProfileScreenshot: '/assets/aistudio/image_8c1b9c8a.png',
  },
};

export const CATEGORIES = [
  {
    id: 'cat-kidswear',
    slug: 'kidswear',
    aliases: ['kidswear', 'kids'],
    name: 'Kidswear',
    subtitle: 'Co-ord sets, denim jumpsuits & festive tops (Ages 4–14)',
    description:
      'Playful, comfort-first children’s outfits spanning waffle-knit co-ord sets, vintage-wash denim dungarees, and embroidered festive tops for ages 4 to 14 years.',
    image: '/images/categories/kidswear.jpg',
    filterValue: 'Kidswear',
  },
  {
    id: 'cat-knitwear',
    slug: 'knitwear',
    aliases: ['knitwear', 'cardigans'],
    name: 'Knitwear',
    subtitle: '3D floral batwing sweaters, cardigans & ribbed knits',
    description:
      'Tactile ribbed knitwear, handcrafted 3D ribbon-flower batwing tops, and lightweight button-front cardigans designed for effortless layering.',
    image: '/images/categories/knitwear.jpg',
    filterValue: 'Knitwear',
  },
  {
    id: 'cat-tops-tees',
    slug: 'tops',
    aliases: ['tops', 'tops-tees', 'tops & tees'],
    name: 'Tops & Tees',
    subtitle: 'Korean lace-collar shirts, embroidered blouses & kurtis',
    description:
      'From crisp Korean crochet-collar shirts and botanical embroidered blouses to breathable pure cotton mirror-work and Ajrakh print kurtis.',
    image: '/images/categories/tops-tees.jpg',
    filterValue: 'Tops & Tees',
  },
  {
    id: 'cat-pants-bottoms',
    slug: 'pants',
    aliases: ['pants', 'pants-bottoms', 'pants & bottoms', 'bottoms'],
    name: 'Pants & Bottoms',
    subtitle: 'Drawstring linen wide-leg pants, urban joggers & skorts',
    description:
      'Relaxed everyday silhouettes including high-waist drawstring linen trousers, street-ready parachute cargo joggers, and tiered mini skorts.',
    image: '/images/categories/pants-bottoms.jpg',
    filterValue: 'Pants & Bottoms',
  },
  {
    id: 'cat-dresses',
    slug: 'dresses',
    aliases: ['dresses', 'one-piece'],
    name: 'Dresses',
    subtitle: 'Pearl-neck midis, watercolor maxis & evening gowns',
    description:
      'Statement one-piece silhouettes ranging from pearl-beaded A-line midi dresses and watercolor floral maxis to 3D butterfly tulle occasion gowns.',
    image: '/images/categories/dresses.jpg',
    filterValue: 'Dresses',
  },
  {
    id: 'cat-new-arrivals',
    slug: 'new-arrivals',
    aliases: ['new-arrivals', 'new'],
    name: 'New Arrivals',
    subtitle: 'Fresh weekly drops across women & children collections',
    description:
      'Our latest showroom arrivals in Law Garden—featuring freshly unpacked Korean shirts, 3D floral sweaters, vacation dresses, and kids co-ord sets.',
    image: '/images/categories/new-arrivals.jpg',
    filterValue: 'new-arrivals',
  },
];

export const VIRTUAL_COLLECTIONS = {
  all: {
    slug: 'all',
    name: 'All Collections & Catalog',
    subtitle: 'Every Day, Something New · Complete Demo Inventory',
    description:
      'Browse the complete GLS COLLECTION sample catalogue across Women’s Wear, Knitwear, Korean Tops, Linen Bottoms, Occasion Dresses, and Kidswear.',
    image: '/images/hero-desktop.jpg',
  },
  women: {
    slug: 'women',
    name: "Women's Collection",
    subtitle: 'Knitwear, Korean Shirts, Dresses, Kurtis & Linen Trousers',
    description:
      'Explore contemporary women’s everyday fashion—curated from our Law Garden showroom floor for effortless daily and festive styling.',
    image: '/images/featured-collection.jpg',
  },
};

export function resolveCollectionMeta(rawCategoryParam) {
  const key = String(rawCategoryParam || 'all').trim().toLowerCase();
  if (!key || key === 'all') {
    return VIRTUAL_COLLECTIONS.all;
  }
  if (key === 'women') {
    return VIRTUAL_COLLECTIONS.women;
  }
  const found = CATEGORIES.find(
    (c) =>
      c.slug.toLowerCase() === key ||
      c.name.toLowerCase() === key ||
      (c.aliases && c.aliases.includes(key))
  );
  return found || VIRTUAL_COLLECTIONS.all;
}

export const FAQ_ITEMS = [
  {
    id: 'faq-demo',
    category: 'Shopping Demonstration',
    question: 'Is this website a live store or a client presentation preview?',
    answer:
      'This website is an interactive e-commerce presentation demo built for GLS COLLECTION (Law Garden, Ahmedabad). It demonstrates how customers can browse collections, filter products, inspect high-resolution garment photography, save items to a wishlist, and use a shopping bag across mobile and desktop devices.',
  },
  {
    id: 'faq-sizing',
    category: 'Product Sizing',
    question: 'How do I choose the right size for Women’s Wear and Kidswear?',
    answer:
      'Each product detail page includes a Size selector and a "Size & Fit" guide. Women’s styles typically span XS to XXL (or Free Size for relaxed batwing knitwear), while Kidswear items are organized by age group from 3–4 Years up to 13–14 Years.',
  },
  {
    id: 'faq-cart',
    category: 'Cart Functionality',
    question: 'Are my Shopping Bag and Wishlist saved when I move between pages?',
    answer:
      'Yes. Your Shopping Bag and Saved Wishlist are stored locally in your browser using persistent storage, so your selected sizes, colors, and quantities remain intact as you navigate across Home, Collections, Product pages, Search, and Cart.',
  },
  {
    id: 'faq-delivery',
    category: 'Delivery Information',
    question: 'What delivery and in-store pickup options will be offered?',
    answer:
      'In the live production store, GLS COLLECTION can offer both local Law Garden showroom pickup and standard courier shipping across Ahmedabad and India. Any shipping thresholds shown in this demo are illustrative placeholders awaiting final confirmation from the store.',
  },
  {
    id: 'faq-returns',
    category: 'Returns & Exchanges',
    question: 'What is the store’s return or exchange policy?',
    answer:
      'Official exchange windows, bill/tag requirements, and alteration terms are not fabricated in this presentation preview. Once confirmed by GLS COLLECTION management, the official store exchange policy will be published on the Policies page and Product Detail accordions.',
  },
  {
    id: 'faq-contact',
    category: 'Contacting the Store',
    question: 'How can I visit or contact GLS COLLECTION in Law Garden?',
    answer:
      'You can visit the showroom in Law Garden, Ahmedabad using the official Google Maps link on our Contact page, or connect with the store on Instagram at @gls_collection_lawgarden for daily new arrival reels and updates.',
  },
];
