# ALAMAT Background Music — Recorded Track Integration

## Current installed soundtrack

The browser now plays the owner's supplied **Village Soundtrack Compilation (C 140 BPM).mp3** (CLAIM.BEATS), rather than the previous procedural synthesized melody.

- 96 seconds, 44.1 kHz stereo MP3.
- The file loops when it reaches the end.
- **Important:** this is one compiled audio track, not seven separate loop files. It currently plays continuously in Title, Lumina Village, Balete Forest, Ancient Shrine and battles. Seamless per-area music switching is reserved for when separate licensed tracks are available.
- The MP3 is **not committed to this GitHub repository**. It is distributed as a separate private asset ZIP for the project owner.
- Download the audio ZIP from the owner's private Google Drive **Alamat Game Assets** folder: `Alamat_Village_Background_Music.zip`.

## Install

Extract the ZIP directly into the Alamat project root. The expected final file is:

```
game/static/game/assets/audio/village_compilation.mp3
```

This location is resolved relative to `game/static/game/alamat-music.js` by the browser (Django static file server when DEBUG is enabled).

## Controls

- **♫ Music: On/Off** button, or press **M**, to toggle.
- **Volume** slider (0–100%; default 28%).
- Saved in browser localStorage, separately from the cloud game save.
- Click or press any game key once to start audio. Browser autoplay policy prevents audio from playing unsolicited.
- When the page is hidden, audio pauses and resumes if the player has already enabled it.
- If the file cannot be loaded, the music button changes to **Audio file missing** and status displays the expected ZIP name.

## Verification

1. `git pull --ff-only origin main`.
2. Extract `Alamat_Village_Background_Music.zip` into the project root, preserving directories.
3. Start Django with `python manage.py runserver`, open `http://127.0.0.1:8000/play/`, hard refresh.
4. Ensure **Music: On**, click inside the game or press a key.
5. Confirm sound plays, the slider changes volume, **M** mutes, and looping works. If muted from earlier settings, click Music once.
6. If no sound, open `http://127.0.0.1:8000/static/game/assets/audio/village_compilation.mp3` in the browser: an HTTP 404 means files were extracted to the wrong location.
7. The browser console and Network tab can help diagnose browser audio blocking.

## Source and permissions

The audio was supplied by the project owner. The creator's public itch.io pack describes free game use; observe the exact license accompanying the downloaded track and preserve credit in the final game's documentation if desired. Don't publish this uploaded MP3 on a public repo without confirming redistribution permission.

## Implementation

`game/static/game/alamat-music.js` uses an HTMLAudioElement so actual MP3 files play across modern browsers. The canvas game calls `setScene()` every animation frame; the player tracks the scene for future track switching but deliberately keeps one continuous compilation playing for now.
