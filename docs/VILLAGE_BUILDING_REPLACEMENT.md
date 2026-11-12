# Lumina Village — Building Replacement Batch

## Changes
- Removed the temporary striped market stall, the obsolete neighbor huts, and **all coconut/palm tree placements from Lumina Village**. Trees elsewhere in the game remain.
- The Player Home, Research Center and Healing House keep their original gameplay interactions, and now load approved art by explicit `buildingAsset` ID instead of coordinate-based or procedural house fallback.
- Potion Shop remains in the former market area.
- Placed a Selyo & General Shop, a Creature Storage House, and a Village Workshop, with collision footprints, clear approach tiles, and temporary interactions.
- The buildings are visible only when the local PNG files have been extracted correctly. If an image is missing, the game renders a clear **Missing building art** placeholder instead of the obsolete wooden house.
- The shop and workshop are not yet functional shops/crafting interfaces; their dialogue is a placeholder. The existing `B` Storage menu remains functional.

## Install the consolidated assets

[Download approved replacements ZIP](https://drive.google.com/file/d/1gnXpYL7XJ57StFdVe6Cn8XwG3fLb6nzP/view)

Extract the ZIP **at the project root**, preserving the folder tree:
`C:\Users\vtemp\alamat\game\static\game\assets\environment\buildings\finished\`

The package contains these images:

| Asset | Role |
|---|---|
| home.png | Player Home |
| research.png | Research Center |
| healing.png | Creature Healing House |
| potion_shop.png | Herb & Potion Shop |
| general_shop.png | Selyo & General Shop |
| supply_storage.png | Creature Storage House |
| forge.png | Village Workshop |
| shop.png | Earlier general-shop reference; archived option |
| carpentry.png | Future craft building option |
| workshop.png | Future workshop variation |
| market_hall.png | Future market variation |
| village_hall.png | Future village hall |
| craft_shop.png | Future craft shop variation |

The new art was cropped from two user-generated transparent sprite sheets. Existing approved `home`, `research`, `healing`, and `potion_shop` images are included so users can do **one extraction** rather than manually merging previous ZIPs.

## Current village placements

| Site | Origin tile | Collision width × height | Interaction footprint |
|---|---|---|---|
| Player Home | 6,6 | 5×4 | 8,9 |
| Research Center | 26,4 | 8×6 | 30,9 |
| Healing House | 5,18 | 6×5 | 8,22 |
| Potion Shop | 25,17 | 6×4 | 28,20 |
| General Shop | 12,6 | 5×4 | 14,9 |
| Creature Storage | 33,17 | 4×4 | 35,20 |
| Workshop | 33,10 | 4×3 | 35,12 |

The player interacts by standing on an adjacent traversable tile and facing the listed collision/entrance tile. This prototype uses collision boxes for entire building footprints; precise roof/wall collision and door animations are future refinements.

## Verification checklist
1. `git pull --ff-only origin main` and extract the latest consolidated ZIP.
2. Hard refresh `http://127.0.0.1:8000/play/` with Ctrl+Shift+R.
3. Verify no old striped market stall or palms remain.
4. Verify no legacy wooden hut fallback appears at any building site.
5. Visit every building and check that new PNG art appears and the player can approach/interact at the entrance.
6. Run `python manage.py test game`; inspect the in-game self-test result at the bottom of the page.

> This code was syntax-checked and a new client self-test was added. The full visual and Django regression tests still require a local run.
