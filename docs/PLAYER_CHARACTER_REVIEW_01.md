# Player Explorer — Candidate 01 Review

**Status:** candidate reference only, **not yet approved**.  
**Source:** owner-supplied file `main character.gif` in project chat (2026-11-11).  
**Binary asset in GitHub:** not yet uploaded; this document does **not** mean the GIF is present in the repository.

## Inspection

- GIF, **128 × 128 pixels**
- **8 animation frames**, each displayed for about **200 ms**
- GIF transparency present
- Artwork shows multiple orientations of a young traveler wearing dark teal/green clothes, brown footwear and a brown cross-body bag
- Frame contents vary; do not assume this is a standard four-direction 64x64 movement sprite sheet

## Visual review

- Good direction: distinct traveler silhouette, readable bag/outfit, palette suitable for the forest/village.
- Current GIF is a **concept/reference animation**, not separated game-ready front/back/left/right sprite frames.
- Need individual direction exports, consistent feet anchors, confirmed 64x64 sprite cell, walking frames, and transparent PNG sheets.
- Confirm the generator's license/usage rights before redistributing publicly.
- If the owner approves, treat this as the **master character appearance** and generate missing directions from the same reference. Do not redesign the face, hairstyle, outfit, proportions or satchel in each prompt.

## Next asset checklist

- [ ] Owner confirms candidate look
- [ ] Source tool and commercial-use license recorded
- [ ] Original GIF uploaded to `assets/concepts/player_explorer_candidate_01.gif`
- [ ] Approved reference image at `assets/concepts/player_explorer_master.png`
- [ ] Directional idle sheets, aligned 64x64 PNG
- [ ] Four-direction walk sheets (4 frames/direction), aligned 64x64 PNG
- [ ] Add provenance and metadata to `assets/manifest.json`
- [ ] In-game Phaser preview screenshot and QA approval

**Claude note:** Never treat the three-view preview GIF as the final 4-direction walk sprite. Use placeholders until the final exports exist.
