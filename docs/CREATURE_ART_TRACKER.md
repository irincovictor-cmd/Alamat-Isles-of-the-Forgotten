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
| 005 | Lumot | Bloom (Nature) | No | No | No | No | Placeholder | Not started |
| 006 | Pakpak | Shadow | No | No | No | No | Placeholder | Not started |
| 007 | Bato | Stone (Earth) | No | No | No | No | Placeholder | Not started |
| 008 | Dagat | Tide (Water) | No | No | No | No | Placeholder | Not started |
| 009 | Kidlatin | Spark | No | No | No | No | Placeholder | Not started |
| 010 | Silong | Shadow | No | No | No | No | Placeholder | Not started |
| 011 | Arawan | Light | No | No | No | No | Placeholder | Not started |
| 012 | Ugbok | Stone (Earth) | No | No | No | No | Placeholder | Not started |
| 013 | Bulakna | Bloom (Nature) | No | No | No | No | Placeholder | Not started |
| 014 | Habagat | Gale (Wind) | No | No | No | No | Placeholder | Not started |
| 015 | Liyaban | Flame (Fire) | No | No | No | No | Placeholder | Not started |

**Current counts:** 4 of 15 species have battle art prepared (Tarsilaw, Agilunos, Bagaon and Alitaptap); 0 of 15 are verified fully complete across all views. **11 creatures remain without prepared designs.**

## Approved art notes

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
