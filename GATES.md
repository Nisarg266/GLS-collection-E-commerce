# Gates: GLS homepage motion upgrade

OWNS: src/main.js, src/styles/home.css, src/components/pages.js, src/components/product-card.js

Scope: Add coordinated GSAP campaign transitions and selective homepage scroll reveals without changing shopping behavior.

- [x] G1: The multi-page Vite production build succeeds.
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=574d9d6fddf407cb59a4d9aa7c3c0d04028d111e6dbbd6c15d175becf23e31ec; output-bytes=1049; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G2: The existing automated store tests pass.
  CHECK: npm test
  EXPECT: ℹ pass
  EVIDENCE: automatic-evidence=v1; definition-sha256=49f7417dad4d71770a77415a2875389782b2d2acf12c25abc4c5c5df754e7768; exit=0; EXPECT=matched; output-sha256=b43365317fa83c8e3a2b9b171d2aada19405fcbd3dfac8821086f1449aa7a8d1; output-bytes=744; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G3: The carousel and reveal code preserves reduced-motion, interaction, and fallback behavior.
  EVIDENCE: Reviewed the final carousel lifecycle in src/main.js: one timeout is cleared before scheduling; the active GSAP timeline is killed before another transition; visibility and reduced-motion handlers pause or clear motion; gsap.context.revert removes reveal ScrollTriggers; catch paths clear inline reveal styles; slide destinations remain direct links.
