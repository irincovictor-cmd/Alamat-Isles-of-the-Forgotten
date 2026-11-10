# Game Design Document (GDD) — v0.1

**State:** Working design; not yet a finalized content bible.  
**Genre:** 2D top-down creature-collecting exploration RPG; browser-based.  
**Mood:** Wonder, mystery and local environmental identity; accessible for players who are unfamiliar with Philippine folklore.

## Core fantasy and differentiator

Explore an original archipelago, meet its inhabitants, discover creatures inspired by real fauna and locally documented traditions, build a party and restore habitats disrupted by **Lilim** (a fictional corruption). Unlike ordinary capture-only games, recruitment uses **bonding** and an item called a **Selyo**. These are invented game mechanics; do not present them as traditional rituals.

### Story premise

A young traveler arrives on **Isla Maharlika** and discovers unusual disturbances. A researcher/guardian organization investigates the Lilim. Main quests introduce the world through local NPCs, habitat stewardship, and a guardian mystery. Story characters and place names are fictional and provisional.

### World / zones

**First island (MVP roadmap):** Lumina Village (hub), Balete Forest (encounters), Baybay Coast (water habitat), Anino Cave (quest dungeon), Ancient Shrine (guardian story). Build village + part of forest first. Later expansions can introduce highlands, wetlands and volcanic islands; regional cultural traditions must be researched individually.

## Core loop

Explore -> converse/quest -> encounter -> turn-based battle -> bond/recruit or defeat -> manage party -> advance area/story -> save.

## Initial systems specification

| System | First-release rule |
|---|---|
| Movement | 4 directions; camera follows player; tile-based collisions |
| Encounters | Map-defined wild encounter zones; simple weighted tables |
| Combat | Turn-based; one active creature per side; player party max 3 |
| Moves | Maximum 4 equipped per creature |
| Stats | HP, Attack, Defense, Spirit, Speed |
| Levels | 1–30 initially (tunable) |
| Types | Nature, Fire, Water, Wind, Earth, Spirit |
| Recruiting | Wild-creature bonding action using Selyo and Trust |
| Save | Django-side player progress, team, inventory, location |
| Online multiplayer | Explicitly excluded from MVP |

**Shadow** and **Storm** were previously used in descriptions but are **not additional types** for MVP; model them as status/move themes until the type chart is deliberately expanded.

### Battle resolution

- Server starts encounter from a validated map/encounter table.
- On a turn, player selects one of its available moves, item, switch (when available), or bonding action.
- Server validates turn state, resources, move legality and encounter eligibility.
- Speed influences turn ordering. Accuracy, damage, statuses and experience use server-side deterministic formulas with seeded RNG in tests.
- Creature KO, victory/loss, rewards and recruitment are persisted atomically.
- Type effectiveness table and balance numbers remain TBD; **do not invent a final chart without review**.

### Bonding rule (provisional)

An ordinary wild creature's bond attempt considers Trust, remaining HP, Selyo tier and encounter modifiers. Story/guardian beings may require quest flags and may be non-recruitable in MVP. Probability formulas and caps require balancing before development, but the interface can expose a bond action early.

### Progression and content

- Short introductory quest: meet guide, choose starter, enter forest, encounter and battle a wild creature, return to village.
- 3 original starter candidates inspired by Philippine animals/habitats; details remain subject to visual and naming review.
- Up to 10 creature species as a **target**, not a finalized roster.
- Tikbalang, Bakunawa and Kapre are **traditional reference subjects**, not automatically starter/catchable species. Their inclusion, visual treatment and roles require research approval.
- Proposed later features: Diwa Awakening, day/night, weather, trading, PvP, events, multiple regions.

## Acceptance criteria: vertical slice

1. Create/login to account and resume session.
2. Walk through Lumina Village, cross valid map transitions, collide with solid tiles.
3. Speak with one NPC and complete one simple quest flag.
4. Select one starter; inventory/team persist after reload.
5. Trigger one forest encounter and battle it.
6. Attempt recruitment using Selyo, with server-side outcome.
7. Return to village with saved progress.
8. Run automated backend tests and one browser smoke test.

## Guardrails

No Pokémon names, assets, copied battle UI or derivative designs; “inspired by creature-collecting RPGs” describes the genre only. Always distinguish game inventions from documented tradition. Maintain descriptive accessibility text and keyboard controls.
