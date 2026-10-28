# Gates: GLS homepage motion upgrade

OWNS: src/main.js, src/styles/home.css, src/components/pages.js, src/components/product-card.js

Scope: Add coordinated GSAP campaign transitions and selective homepage scroll reveals without changing shopping behavior.

- [x] G1: The multi-page Vite production build succeeds.
  CHECK: npm run build
  EXPECT: built in
  EVIDENCE: automatic-evidence=v1; definition-sha256=46d72eccd628b28a4b0e974e69890ad856bb5d28a16876531804fc540a571513; exit=0; EXPECT=matched; output-sha256=9e6d4d378006dc4dca0b1425c8344b2f9af99aae0ee76d2e9da4af276a6f448f; output-bytes=1049; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [x] G2: The existing automated store tests pass.
  CHECK: npm test
  EXPECT: ℹ pass
  EVIDENCE: automatic-evidence=v1; definition-sha256=49f7417dad4d71770a77415a2875389782b2d2acf12c25abc4c5c5df754e7768; exit=0; EXPECT=matched; output-sha256=c383b921dbd48ec2c8060c3b54b04df4b31ac8f7dfaa392bef8a5df9098ca8fb; output-bytes=744; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\panch\Downloads\gls-collection-—-law-garden-fashion-store-demo; path=48268305a738/33 entries

- [ ] G3: The carousel and reveal code preserves reduced-motion, interaction, and fallback behavior.
  EVIDENCE: pending
