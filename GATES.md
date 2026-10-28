# Gates: GLS premium responsive storefront upgrade

OWNS: src/components/pages.js, src/components/header.js, src/main.js, src/styles/home.css, src/styles/layout.css, src/styles/components.css, src/styles/responsive.css

Scope: Deliver a richer premium homepage, refined footer, smooth accessible scroll motion, balanced spacing, and responsive layouts while preserving the store flow.

- [x] G1: The complete multi-page Vite production build succeeds after the redesign.
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=88cd90c3538b5fc323f1c9474c58c6f8e093a9a73053c5d1fbb7c9eea2cc97fe; output-bytes=1049; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G2: Existing cart, wishlist, filtering, and store utility behavior continues to pass its automated suite.
  CHECK: npm test
  EXPECT: ℹ pass 7
  EVIDENCE: automatic-evidence=v1; definition-sha256=22e24d5d1a7b5c2c8ba4320cc62f9933ed2dfc38f53b69ab4d54ae42620e9d6e; exit=0; EXPECT=matched; output-sha256=514cc36431e82f6bdc2f863a54cdafaf85caeca0573fca55d12cabcf232e54ba; output-bytes=742; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G3: Homepage and footer source include the new editorial sections, premium footer structure, responsive rules, reduced-motion fallback, and GSAP reveal targets.
  CHECK: node -e "const fs=require('fs');const files=['src/components/pages.js','src/components/header.js','src/main.js','src/styles/home.css','src/styles/layout.css','src/styles/components.css','src/styles/responsive.css'].map(p=>fs.readFileSync(p,'utf8')).join('\n');const required=['home-values','home-lookbook','home-store-story','footer-newsletter','footer-social','home-lookbook-card','prefers-reduced-motion','home-values__item'];if(!required.every(s=>files.includes(s)))process.exit(1);console.log('premium storefront contract passed')"
  EXPECT: premium storefront contract passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=6dec75e7f0af03ab24234c696e5253bd9a1d1ea2aed69b2a6ac9e676d0f40267; exit=0; EXPECT=matched; output-sha256=a0930742c8d32acbb275527557176c96605493b37569ccaff79166bdf77025fd; output-bytes=35; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G4: The final homepage is manually reviewed for coherent section progression, usable mobile stacking, readable spacing, keyboard-visible controls, and motion that never hides content when reduced motion is requested.
  EVIDENCE: Reviewed live at 1440×900 desktop, 768×900 tablet, and 390×844 mobile. All measured document widths matched their client widths with no horizontal overflow; the lookbook, showroom story, value strip, and footer stacked cleanly; browser logs had zero warnings/errors; focus styles remain global; reduced-motion skips GSAP and disables CSS motion; Add to Bag opened the drawer with the selected item and updated the badge.
