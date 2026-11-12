# ALAMAT — Creature Art Production Tracker

**Purpose:** This is the single source of truth for which creature designs have been created, approved, packaged, and integrated. Check this document **before writing a new PixelLab prompt**, to avoid using credits on a creature we have already designed.

**Last reviewed:** 2026-11-12

## Status definitions

- **Not started** — no approved PixelLab design yet; existing procedural game art is **not** a finished design.
- **Concept** — generated options exist, but no design has been selected.
- **Battle ready** — front and back battle crops have been selected/created and packaged.
- **Overworld ready** — usable idle/walk artwork exists for field use.
- **Complete** — battle and overworld assets are ready, and the Dex, party, starter screen (where applicable), overworld and battle were verified with the intended design.

## All 15 creatures

| Dex # | Creature | Attribute | Approved concept | Battle front | Battle back | Overworld | Menu/Dex consistency | Overall status |
|---|---|---|---|---|---|---|---|---|
| 001 | Tarsilaw | Light | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 002 | Agilunos | Gale (Wind) | **Yes** | **Yes** | **Yes** | No | **Shared UI loader fixed; verify in game** | **Battle ready — in progress** |
| 003 | Bagaon | Flame (Fire) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 004 | Alitaptap | Spark | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 005 | Lumot | Bloom (Nature) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 006 | Pakpak | Shadow | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 007 | Bato | Stone (Earth) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 008 | Dagat | Tide (Water) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 009 | Kidlatin | Spark | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 010 | Silong | Shadow | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 011 | Arawan | Light | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 012 | Ugbok | Stone (Earth) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 013 | Bulakna | Bloom (Nature) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 014 | Habagat | Gale (Wind) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |
| 015 | Liyaban | Flame (Fire) | **Yes** | **Yes** | **Yes** | No | **Loader ready; verify in game** | **Battle ready — in progress** |

**Current counts:** 15 of 15 species have approved battle art prepared; 0 of 15 are verified fully complete across all views because overworld art and local in-game visual confirmation are pending. **No more battle species need initial PixelLab generations.**

## Approved art notes

### Final batch — #010 to #015

Six remaining creatures were supplied as transparent 256×256, 4×4 PixelLab sheets on November 12, 2026. Individual transparent 64×64 battle sprites and a reused front-view menu portrait were extracted and packaged using the standard `game/static/game/assets/creatures/<id>/battle/{front,back}.png` and `menu.png` paths. All six can also be installed with the [combined final-six ZIP](https://drive.google.com/file/d/1aXLpF2klZZvbC3uu2v0zsEeeK-gaimCZ/view).

| # | Creature | Fixed visual design | Front / Menu pose | Rear pose | ZIP |
|---|---|---|---|---|---|
| 010 | Silong | Deep purple stealth creature with long ears, pink-red eyes, curling tail and shadow markings | Row 1 col 1 | Row 4 col 1 | [Silong ZIP](https://drive.google.com/file/d/1E_EO1J_HxyNiQepzdohhOn3xeZgHdD59/view) |
| 011 | Arawan | Golden sun guardian with radiant spiky mane, bright eyes and flame-like glowing tail | Row 1 col 1 | Row 2 col 3 | [Arawan ZIP](https://drive.google.com/file/d/1wXBqPIx9_m-DPHw0F2zHHqOzTEVewiun/view) |
| 012 | Ugbok | Stocky brown rock-plated guardian with armadillo-like armor, sandstone underbelly and sturdy claws | Row 1 col 1 | Row 3 col 1 | [Ugbok ZIP](https://drive.google.com/file/d/1oxSu-iF2PJa411ggWk9u0vpCW7JJGZjy/view) |
| 013 | Bulakna | Pale mint forest creature with oversized pink floral crown, hanging petal ears and curled vine tail | Row 1 col 1 | Row 4 col 4 | [Bulakna ZIP](https://drive.google.com/file/d/128A0hFUFLRYj3zMCHj8runbPY7og9qKS/view) |
| 014 | Habagat | Aqua-blue serpentine wind dragon with flowing crest, mane and curled tail | Row 1 col 1 | Row 3 col 1 | [Habagat ZIP](https://drive.google.com/file/d/15Eo_ig_5ISNHJtVfS-gCrYh0KsJxjD8_/view) |
| 015 | Liyaban | Bright orange-red fiery creature with pointed flame crest, ember markings and fire-tipped tail | Row 1 col 1 | Row 2 col 3 | [Liyaban ZIP](https://drive.google.com/file/d/1lNoA-jtejsaKEz6M689suludD8CpXwVf/view) |

**Status:** all six battle portraits are cropped and ZIPs are uploaded to Google Drive. They still require installing into the local game and visually checking battle, Dex, party and any other relevant menus. Their overworld sprites are not yet produced. Do **not** generate these designs again unless the user explicitly requests a redesign.


### #008 Dagat

- **Reference:** user-provided `DAGAT(1).png` (256×256 transparent 4×4 pose sheet, 64×64 cells).
- **Approved design:** cyan-blue amphibious sea guardian with pale cream belly, fin ears, bright blue eyes and a curled wave-like tail.
- **Battle front/menu:** row 1 column 1. **Battle back:** row 3 column 1.
- **Package:** [Alamat_Dagat_Battle_Assets.zip](https://drive.google.com/file/d/14-K3ZuOFlpiKxYd6r73ZaoBDkUSwKtBv/view) in the Google Drive Alamat Game Assets folder.
- **Paths:** `game/static/game/assets/creatures/dagat/battle/front.png`, `battle/back.png`, `menu.png`.
- **Status:** prepared and packaged; local installation, battle/Menu/Dex verification and overworld art pending. No need to regenerate.

### #009 Kidlatin

- **Reference:** user-provided `KIDLATIN(1).png` (256×256 transparent 4×4 pose sheet, 64×64 cells).
- **Approved design:** small deep-navy electric runner with yellow lightning markings, cyan eyes, pointed ears and bright zigzag sparks.
- **Battle front/menu:** row 1 column 1. **Battle back:** row 3 column 1.
- **Package:** [Alamat_Kidlatin_Battle_Assets.zip](https://drive.google.com/file/d/1FccR0FSzYYDpp4XxlWIxznDoCoGO7oeN/view) in the Google Drive Alamat Game Assets folder.
- **Paths:** `game/static/game/assets/creatures/kidlatin/battle/front.png`, `battle/back.png`, `menu.png`.
- **Status:** prepared and packaged; local installation, battle/Menu/Dex verification and overworld art pending. No need to regenerate.

### #006 Pakpak

- **Reference:** user-supplied `pakpak.png`, transparent 256×256 sheet (4×4, 64px cells).
- **Locked design:** small purple-black bat guardian, red eyes, pointed ears, violet webbed wings and gray chest.
- **Front/menu:** row 1 column 1; **back:** row 4 column 1.
- **Package:** [Alamat_Pakpak_Battle_Assets.zip](https://drive.google.com/file/d/17jSw76vLBETucYCWUM70yu6q8VwxK2qj/view).
- **Assets:** `game/static/game/assets/creatures/pakpak/battle/front.png`, `battle/back.png`, `menu.png`.
- **Status:** battle art prepared, not yet visually verified in browser; overworld sprite not created. Don't regenerate unless user asks.

### #007 Bato

- **Reference:** user-supplied `bato.png`, transparent 256×256 sheet (4×4, 64px cells).
- **Locked design:** dark gray rock-armored upright creature, warm sandstone torso, blue accents, yellow eyes, heavy stone fists.
- **Front/menu:** row 1 column 1; **back:** row 4 column 1.
- **Package:** [Alamat_Bato_Battle_Assets.zip](https://drive.google.com/file/d/10CyXE_XneKQ7M_ISYtrKtye1sW7cqRI4/view).
- **Assets:** `game/static/game/assets/creatures/bato/battle/front.png`, `battle/back.png`, `menu.png`.
- **Status:** battle art prepared, not yet visually verified in browser; overworld sprite not created. Don't regenerate unless user asks.

### #005 Lumot

- **Reference:** user-provided `lumot.png`, 256×256 transparent 4×4 pose sheet (64×64 cells).
- **Design:** moss-green forest creature with large amber eyes, leafy branch-like horns, rounded belly, curled moss-covered tail.
- **Chosen front/menu:** row 1, column 1. **Battle back:** row 4, column 2 (rear view).
- **Package:** [Alamat_Lumot_Battle_Assets.zip](https://drive.google.com/file/d/1qw6RDDWRkhUbjZIgUGkLiG95yjVpIvZN/view) in Google Drive's `Alamat Game Assets`.
- **Expected paths:** `game/static/game/assets/creatures/lumot/battle/front.png`, `battle/back.png`, and `menu.png`.
- **Pending:** installation, visual confirmation, overworld art. Do not regenerate unless the user requests redesign.

### #004 Alitaptap

- **Reference:** user-provided `alitaptap.png`, a 256×256 transparent 4×4 pose sheet (64×64 cells).
- **Design:** indigo/violet firefly with large golden eyes, cyan translucent wings, two glowing antennae and a yellow-lit abdomen.
- **Chosen front and menu:** row 1, column 1. **Back:** row 4, column 1 (rear view).
- **Package:** [Alamat_Alitaptap_Battle_Assets.zip](https://drive.google.com/file/d/1gzfvP9NshxGwGotYxDt2HN2Gbt66bF19/view) in `Alamat Game Assets`.
- **Expected paths:** `game/static/game/assets/creatures/alitaptap/battle/front.png`, `battle/back.png`, and `menu.png`.
- **Pending:** user import/visual confirmation, overworld art. Do not regenerate without a user request.

### #003 Bagaon

- **Approved generated reference:** user-supplied transparent `bagaon.png`, 256×256 px arranged as a 4×4 pose sheet (16 cells of 64×64).
- **Design locked:** charcoal-gray horned face/crest, deep reddish-brown stocky body, bright ember-orange glowing accents, thick curling tail tipped with fire, yellow-orange eyes.
- **Front and menu:** first row, first column. **Battle back:** second row, fourth column (rear/side pose).
- **Packaged assets:** [Alamat_Bagaon_Battle_Assets.zip](https://drive.google.com/file/d/104AWOe39KxHtYdaJNUOIDJ1kpAl5vsLh/view) in Google Drive's Alamat Game Assets folder.
- **Paths:** `game/static/game/assets/creatures/bagaon/battle/front.png`, `battle/back.png`, `menu.png`.
- **State:** cropped and packaged, awaiting user install and visual verification. No overworld animations yet.
- **Do not regenerate** Bagaon battle art unless the user requests a redesign.

### #001 Tarsilaw

- **Approved generated reference:** user-supplied transparent `tarsilaw.png`, 256×256 pixels arranged as a 4×4 pose sheet (16 cells of 64×64).
- **Design locked:** small chestnut-brown tarsier-inspired guardian, large round golden eyes, cream belly, curling tail and upright rounded ears.
- **Battle front/menu:** first row, first column. **Battle back:** third row, first column.
- **Packaged assets:** [Alamat_Tarsilaw_Battle_Assets.zip](https://drive.google.com/file/d/1pvt6mmO3F7dsBRO-ERWU4zcCYJBkGZzh/view) in the user's Google Drive Alamat Game Assets folder.
- **Folder layout:** `game/static/game/assets/creatures/tarsilaw/battle/front.png`, `battle/back.png`, `menu.png`.
- **State:** art cropped and packaged; shared loader integrated with code, but still needs visual confirmation after importing ZIP. No overworld/idle sprite was prepared.
- **Do not regenerate** Tarsilaw battle art unless the user explicitly asks to redesign it.

### #002 Agilunos

- **Design locked:** dark brown feathers/wings, cream chest, distinct shaggy Philippine-eagle crest, hooked beak and golden talons. Maintain the same markings and proportions.
- **Approved reference:** the user's PixelLab 4×4 pose sheet from November 12, 2026. Do **not** regenerate Agilunos just to improve minor poses.
- **Battle art:** chosen front/back cropped sprites, distributed as `Alamat_Agilunos_Battle_Assets.zip` in the Alamat Game Assets Google Drive folder.
- **Current code asset paths (until loader migration):** `game/static/game/assets/creatures/agilunos/battle_front.png` and `battle_back.png`.
- **UI integration:** shared UI sprite loader was updated to prefer menu art and battle front art across Dex, party, starter selection and title (commit `d76e8a2`). **Still needs player visual confirmation**, with Agilunos's old artwork ZIP installed locally. Overworld sprite is not yet produced.
- **Do not mark Complete** before user verifies appearance in game.

## Required production workflow for each new creature

1. **Read this tracker first.** Skip any creature whose approved design already exists.
2. Prepare **one credit-conscious PixelLab prompt** for one consistent design. Mention the species' fixed palette, silhouette, anatomy, and style; avoid alternate variants unless explicitly requested.
3. User generates a sprite sheet and uploads the result.
4. Select matching front/back poses from the sheet, crop to transparent PNGs, and reuse the front view for the menu when practical. Do not invent missing angles; clearly label any temporary reuse.
5. Package into a ZIP that can be extracted directly into the game's expected folder tree without renaming.
6. Integrate the artwork across **battle, Dex, party, starter screen (where applicable), and overworld when supplied**. Confirm loader paths and fallback behavior.
7. Verify in the running game, then update this tracker with status, source/reference, ZIP link or name, and GitHub commit.

## Planned standardized future paths

```text
game/static/game/assets/creatures/<species_id>/
  overworld/idle.png
  overworld/walk.png          # optional; only when animation exists
  battle/front.png
  battle/back.png
  menu.png                    # optional: fallback to battle/front.png
```

**Implemented:** Starting with commit `d76e8a2`, battle art first checks `battle/front.png` and `battle/back.png`, then falls back to legacy `battle_front.png` and `battle_back.png`. UI screens first check `menu.png`, then the battle front, then the procedural sprite. The overworld paths remain reserved for a later field-art update.

## Art consistency rules

- Original, Philippine-inspired modern HD pixel art; consistent proportions, palette, outlines and lighting.
- Transparent PNGs, single approved creature design, no unrelated recolors or variants.
- Do not call procedural placeholder sprites approved designs.
- Agilunos is the style benchmark for this batch; its approved anatomy and colors are **unique to Agilunos**, not mandatory for every species.
