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
| 001 | Tarsilaw | Light | No | No | No | No | Placeholder | Not started |
| 002 | Agilunos | Gale (Wind) | **Yes** | **Yes** | **Yes** | No | **Needs fix / verification** | **Battle ready — in progress** |
| 003 | Bagaon | Flame (Fire) | No | No | No | No | Placeholder | Not started |
| 004 | Alitaptap | Spark | No | No | No | No | Placeholder | Not started |
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

**Current counts:** 1 of 15 species has approved battle art (Agilunos); 0 of 15 are verified fully complete across all views. **14 creatures remain without approved designs.**

## Approved art notes

### #002 Agilunos

- **Design locked:** dark brown feathers/wings, cream chest, distinct shaggy Philippine-eagle crest, hooked beak and golden talons. Maintain the same markings and proportions.
- **Approved reference:** the user's PixelLab 4×4 pose sheet from November 12, 2026. Do **not** regenerate Agilunos just to improve minor poses.
- **Battle art:** chosen front/back cropped sprites, distributed as `Alamat_Agilunos_Battle_Assets.zip` in the Alamat Game Assets Google Drive folder.
- **Current code asset paths (until loader migration):** `game/static/game/assets/creatures/agilunos/battle_front.png` and `battle_back.png`.
- **Open issues:** user confirmed the Dex still displays the old fallback portrait; update *all* UI locations (Dex, party, starter selection, title if applicable) to prefer approved art. Overworld sprite is not yet produced.
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

**Migration caution:** These are **planned** paths. The current implemented battle loader still expects `battle_front.png` and `battle_back.png` directly inside the species folder. Do not place assets only in the planned paths until the game loader is updated and verified. Keep fallback support for the old path.

## Art consistency rules

- Original, Philippine-inspired modern HD pixel art; consistent proportions, palette, outlines and lighting.
- Transparent PNGs, single approved creature design, no unrelated recolors or variants.
- Do not call procedural placeholder sprites approved designs.
- Agilunos is the style benchmark for this batch; its approved anatomy and colors are **unique to Agilunos**, not mandatory for every species.
