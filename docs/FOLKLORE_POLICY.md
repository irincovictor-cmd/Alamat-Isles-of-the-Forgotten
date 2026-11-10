# Folklore Research, Naming and Attribution Policy

**Primary research starting point (requested by project owner):** [The Aswang Project — Bikolano Mythology](https://www.aswangproject.com/philippine-mythology/bikolano-mythology-beliefs/).

**Crucial distinction:** That link is a **Bikol-specific archive**, not an exhaustive or universally applicable list of Philippine folklore. Use [mythologies by cultural group](https://www.aswangproject.com/philippine-mythologies-by-cultural-group/) and original studies to research Visayan, Tagalog, Bikol and other material in their own context. The Aswang Project organizes and cites research, but it is a secondary guide; investigate the underlying sources when making definitive claims.

## Mandatory naming convention

- A traditional creature keeps the documented standard name in our catalog: **Tikbalang**, **Bakunawa**, **Kapre** (where applicable to the cited source).
- Do not alter traditional names to sound like a game monster. Specifically replace previous **Tikbalan -> Tikbalang** and **Bakunara -> Bakunawa**.
- Document attested historical or linguistic variants in `source_variants`, not as invented species names; variants must be explicitly sourced.
- Invented creatures (e.g. Tarsilaw or Agilunos) are labeled `original_species`. They should have a real-animal/habitat inspiration reference and a clear original-game disclaimer.
- Do not present **Diwa**, **Selyo**, **Lilim** or the fictional island names as sourced traditional taxonomies, rituals, or ethnographic facts; these are game inventions/borrowed ordinary vocabulary with fictional meanings.
- A figure described as a deity, revered spirit or ancestor is not automatically a tameable combat monster. Use it as lore/NPC/story content only after careful research and editorial review.

## Verified research examples

### Tikbalang

Article: https://www.aswangproject.com/tikbalang/  
Tradition: historical accounts centered on Tagalog records, with other local variants and comparisons; do not generalize a single form to the whole country. Widely known as a long-limbed being associated with lost travelers; the horse-headed figure emerges clearly in later documentation. The specific appearance changes across historical sources. **Gameplay depiction remains pending.**

### Bakunawa

Article: https://www.aswangproject.com/bakunawa/  
Tradition: documented Visayan eclipse serpent. Older records describe a serpent associated with swallowing the moon/eclipses; the elaborate six/seven-moon narrative is traceable in a later literary retelling. Modern dragon features (wings/horns/whiskers) should not be portrayed as universally ancient attested traits. **Gameplay depiction remains pending.**

### Bikol archive examples

Article index: https://www.aswangproject.com/philippine-mythology/bikolano-mythology-beliefs/  
Contains Bikol-relevant entries about Oryol, Okot, Asuang, Gugurang, Magindara and others. **Do not convert deities or culturally important figures into catchable units without an explicit decision and community-aware review.**

## Creature registry required fields

- `id`: stable slug
- `display_name`: exact documented name, or clearly original name
- `origin_type`: `folklore_being`, `original_species`, or `wildlife`
- `tradition_region`: specific community/region or `original_fiction`
- `source_urls`: specific source articles, not only a category landing page
- `research_status`: `verified_reference`, `needs_review` or `original_concept`
- `gameplay_status`: `lore_only`, `proposed`, `approved`, etc.
- `visual_status`: `not_started`, `concept`, `approved`, `production`
- `notes`: what belongs to traditional account vs invented gameplay

## Licensing and representation

1. Treat website prose, photos and artwork as copyrighted unless an explicit license permits reuse; **link and cite, don't scrape/rehost**.
2. Do not copy long text passages or turn article illustrations into sprites without permission.
3. Document creation method, license, artist, generation model, prompts and approvals for all committed assets.
4. Preserve regional identity; avoid amalgamating unrelated myths into an alleged national canon.
5. Label adaptation and invented mechanics clearly; cultural consultation is recommended before public release.
6. Maintain a changelog for naming and research corrections.

## Core source index

- https://www.aswangproject.com/philippine-mythology/
- https://www.aswangproject.com/philippine-mythologies-by-cultural-group/
- https://www.aswangproject.com/creatures-mythical-beings-philippine-folklore-mythology/
- https://www.aswangproject.com/tikbalang/
- https://www.aswangproject.com/bakunawa/
- https://www.aswangproject.com/philippine-mythology/bikolano-mythology-beliefs/
