# External AI Art Prompt Pack — Phase 01

**Use in PixelLab or another pixel-art model.** Generate concepts separately first, then use the **same approved master image** for additional directions or variations. Prompts do not guarantee exact pixel grids: check dimensions and alignment afterward.

## Shared style instruction (prepend to all prompts)

"Original modern HD pixel art for a top-down orthographic tropical Philippine-inspired 2D browser RPG, 32px tile grid, crisp pixel clusters, consistent pixel density and clear silhouettes, soft golden lighting from upper-left and restrained cool shadows, vivid tropical greens, warm natural bamboo and sand, subtle magical cyan accents, coherent non-isometric 3/4 perspective, legible at 2x-3x game scale; original designs only, no logos, no text, no copied videogame art."

**Universal negative guidance:** "photorealistic, 3D render, smooth vector, blurred edges, mismatched perspective, isometric diamond grid, over-detailed noise, baked UI labels, watermark, anime screencap, copied Pokemon assets, inconsistent shadow direction."

## Prompt A1 — Explorer master concept

"Full-body turnaround concept of the **same** original young Filipino island explorer character, neutral friendly expression, dark short hair, practical dark teal short-sleeve overshirt over cream undershirt, tan shorts or fitted travel trousers, brown shoes, compact crossbody canvas satchel, subtle gold woven trim used only as a fictional decorative accent. Four views: facing down/front, left, right, back. Keep exact same face, costume, proportions and accessories in all views. Modern HD pixel art, simple clear outline. Transparent or solid neutral background, no lettering. Designed to fit 64x64 game sprite cell after downscaling/redrawing."

After owner approves, create the 4-direction sprites using the concept as **reference image**, not independent unrelated prompts.

## Prompt A2 — Movement animation

"Using the approved player explorer reference, create four-frame walk cycle facing [DOWN/UP/LEFT/RIGHT]; preserve exact outfit, head/body proportions, color palette and consistent 64x64 canvas positioning. Natural short footsteps, fixed ground contact line and bottom-center feet anchor, hands and satchel move only subtly, no camera movement, transparent background. No changes to character design."

Repeat per direction. Verify actual frame grid and upload a sprite-sheet frame-order note.

## Prompt B1 — Home building

"Single original wooden-and-bamboo Filipino coastal village dwelling for a top-down 3/4-view modern HD pixel art RPG. Raised timber foundation, woven bamboo walls, warm brown roof with subtle weathering, modest front porch and south-facing visible door, tropical weather-appropriate architecture, warm upper-left sunlight; coherent 32x32 tile grid, modular object, isolated transparent background, no humans, no text. Approximate 5x4 tile footprint; sprite can exceed ground footprint vertically."

## Prompt B2 — Research center

"Original tropical village research and guardian center, modest two-room timber and plaster building with deep teal roof accents, open front walkway, herb planter, large south-facing front door and community-science details, same perspective and light as approved home, 32x32 modular grid, modern HD pixel art, isolated transparent background; no words, no copied symbols. Approximate 8x6 tile footprint."

## Prompt B3 — Healing house

"Original island village healing house, bamboo-and-timber walls, teal textile awning, herbal planters, small lantern, visible south-facing entry, same roof perspective, light direction and 32px pixel density as approved home, isolated transparent background, no text or logo. Approximate 6x5 tile footprint."

## Prompt B4 — Market and house kit

"Modular set of original tropical island market stall, item shop and three small village houses, matching the approved home building's scale, roof pitch, material palette and 3/4 top-down perspective; separate non-overlapping objects with transparent background, south-facing interactable storefronts, no baked labels."

## Prompt C1 — Ground terrain

"Tileable 32x32 top-down RPG ground tileset with tropical meadow grass, shaded grass, warm packed-earth dirt, thin dirt walking path, pale beach sand, stone path and small leaf scatter, identical pixel clusters and palette across every tile, seamless edge transitions, each tile aligned to a regular 32x32 grid, no buildings or trees, no perspective distortion."

## Prompt C2 — Nature props

"Separate original 3/4-top-down modern HD pixel art environment objects: coconut palm, broadleaf tropical hardwood tree, enormous old balete-inspired tree with distinct buttress roots, dark and light shrubs, small flowers, rock cluster, woven fence and bamboo lantern post; consistent upper-left light and 32px map grid scale, transparent background, no text. Preserve exact object silhouettes and coherent scale when separating sprites."

## Prompt C3 — Water transitions

"Top-down tropical coast pixel-art tileset, shallow teal water, deeper blue water, pale sand, waterline foam and corners, seamless tile transitions, 32x32 tiles, upper-left light, consistent modern HD pixel art pixels, no birds/boats/buildings, no large composed scene."

## Prompt D1 — Mockup for art approval ONLY

"Top-down orthographic modern HD pixel art mockup of an original small Philippine-inspired island RPG village: 5–8 wooden houses, small research center, healing house, dirt crossroads, coconut palms, tropical grass, sea on eastern edge, welcoming market stalls, playable-looking paths and visible entrances. 32px tile-grid aesthetic, consistent 3/4 building faces, warm upper-left morning light and crisp pixel clusters. No text, characters or UI. **Moodboard only, not an editable map or canonical game asset.**"

## Export / review checklist

- Use same approved master reference for all variants.
- Confirm true transparent background (checkerboard preview alone is insufficient).
- Check exact exported dimensions and sprite-sheet frames.
- Check 32px tile seams, including grass/dirt and water edge corners.
- Match lighting, shadow angles, roof pitches and player/building scale.
- Record provenance and usage rights in `assets/manifest.json` before committing.
- Never treat a picture of an entire village as the Tiled map; reconstruct from reusable assets and export Tiled JSON.
