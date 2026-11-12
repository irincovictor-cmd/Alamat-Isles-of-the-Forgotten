# Creature Dex and Attribute Guide — Milestone 1

## Overview

ALAMAT now has 15 original creature species, 8 battle attributes, and an in-game collection Dex.

- **Dex**: use the on-screen **Dex** button or press **K** while exploring.
- **Attribute guide**: press **G** or click **Guide**. When the Dex is open, **Enter** switches between the roster and the guide, **Esc** closes it.
- Unknown creatures display only a dark silhouette, their slot number and `???`. Name, attribute, counters and lore are revealed only after that species is recruited.
- A starter selected from Ate Luz automatically unlocks. A successfully bonded creature unlocks when it actually joins the party or replaces an existing party member.
- All 15 species appear in at least one encounter pool (Balete Forest or Ancient Shrine); exploration and story gates remain in place.
- Permanent discoveries are stored in each account's `dex` list. Old saves infer unlocks from existing party members on load; there is no retroactive history for creatures released before this feature was added.
- The existing three-creature party limit remains. Players can fill the Dex through later bonds and party swaps.

## Species roster

| # | ID | Display name | Type |
|---|---|---|---|
| 1 | tarsilaw | Tarsilaw | Light |
| 2 | agilunos | Agilunos | Wind (Gale) |
| 3 | bagaon | Bagaon | Fire (Flame) |
| 4 | alitaptap | Alitaptap | Spark |
| 5 | lumot | Lumot | Nature (Bloom) |
| 6 | pakpak | Pakpak | Shadow |
| 7 | bato | Bato | Earth (Stone) |
| 8 | dagat | Dagat | Water (Tide) |
| 9 | kidlatin | Kidlatin | Spark |
| 10 | silong | Silong | Shadow |
| 11 | arawan | Arawan | Light |
| 12 | ugbok | Ugbok | Earth (Stone) |
| 13 | bulakna | Bulakna | Nature (Bloom) |
| 14 | habagat | Habagat | Wind (Gale) |
| 15 | liyaban | Liyaban | Fire (Flame) |

These are **original game species**, influenced by Philippine ecosystems and folklore. They are not presented as established creatures from documented folklore traditions. Future canonical mythological characters require separate research and attribution.

## Matchup summary

The source of truth is `game/data/game_data.json` under `type_chart` (1.5× effective damage, 0.7× resisted, 1.0× neutral). The guide calculates counters from that chart instead of using a separate inconsistent hard-coded table.

| Defending type | Counter with attacking type |
|---|---|
| Flame / Fire | Tide / Water, Stone / Earth |
| Tide / Water | Spark, Bloom / Nature |
| Stone / Earth | Tide / Water, Bloom / Nature |
| Bloom / Nature | Flame / Fire, Gale / Wind |
| Gale / Wind | Stone / Earth, Spark |
| Spark | Stone / Earth, Light |
| Light | Gale / Wind, Stone / Earth, Shadow |
| Shadow | Flame / Fire, Light |

Note: Light and Shadow can trade super-effective attacks against one another. Some listed advantages are asymmetric by design; actual damage is based on the *move* type.

## Current art behavior

Agilunos retains its dedicated front/back battle art where locally installed. Seven new species currently use deterministic placeholder pixel sprites; assets can be added individually using the existing `creatures/<id>.png` convention and optional `creatures/<id>/battle_front.png` and `battle_back.png`. Neither the Dex nor gameplay requires new AI art credits.

## Save / security notes

The Django save validator preserves canonical party stats and validates the `dex` species list. As with the existing client-side bond system, this prototype cannot cryptographically prove a capture actually happened: fully authoritative battle resolution is a separate future milestone. The Dex is account-scoped via the existing authenticated cloud save.

## Validation

Run `python manage.py test game` and `python manage.py check` after pulling. In the game footer, the JavaScript self-test count should increase beyond 14. Manual checks: an empty Dex should have all silhouettes; starter choice unlocks one; recruiting another unlocks it; saving and reloading preserves entries; choosing another creature in a full party keeps previous Dex entries.
