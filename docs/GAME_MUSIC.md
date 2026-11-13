# ALAMAT Background Music — Original Procedural Soundtrack

The game now includes a lightweight **original, synthesized instrumental soundtrack** using the browser's Web Audio API. No external music files, samples, or licensed recordings are necessary.

## Musical themes

| Context | Theme | Style |
|---|---|---|
| Title | Title | Warm pentatonic introduction |
| Lumina Village (V) | Village | Calming, gentle light tones |
| Balete Forest (F) | Forest | Slower, mysterious and airy |
| Ancient Shrine (S) | Shrine | Sparse, supernatural ambience |
| Battle | Battle | Fast, tense melody with bass pulse |

Tracks loop and change automatically as the player moves between scenes. The browser-generated original melodies are a **prototype**, not final recorded orchestral music.

## Player controls

- **♫ Music: On/Off** button toggles playback. Keyboard shortcut: **M**.
- **Volume slider** adjusts music volume from 0 to 100%; default 28%.
- Preferences are saved in local browser storage, not the Django account.
- Audio begins after the player first clicks or presses a key, because browsers forbid unsolicited autoplay.
- Music pauses while the tab is hidden and resumes on a later permitted interaction/visibility change.
- If the browser does not support Web Audio, the game remains playable without music.

## Implementation

- `game/static/game/alamat-music.js` — independent audio engine, note sequences, scheduling, controls
- `game/templates/game/play.html` — toggle/volume UI and soundtrack loader
- `game/static/game/alamat.css` — compact responsive controls
- `game/static/game/alamat.js` — maps battle/title/map state to track ID

Future enhancement: replace individual synthesized themes with project-owned or properly licensed OGG/MP3 recordings. Keep the same scene IDs and controls. Do not upload commercial game music without the rights to reuse it.

## Verify locally

```cmd
git pull --ff-only origin main
python manage.py runserver
```

Open `http://127.0.0.1:8000/play/`, hard refresh, then click or press a key in the game. Confirm audio is audible with **Music: On**, the slider works, the **M** key mutes, and music changes in forest/shrine/battle. The automated static JavaScript syntax checks pass; actual speaker playback still requires browser verification.
